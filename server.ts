import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  detectLanguagePipeline,
  getMultilingualFallbackReply,
  LanguageDetectionResult
} from './server/languagePipeline';
import {
  CANONICAL_IDENTITY_VERSION,
  ensureServerVisualIdentity,
  constructServerIdentityLockedPrompt,
  detectPhotoIntent,
  resolveServerContextualScenario,
  getContextualPhotoSpokenReply,
  CHARACTER_LIFESTYLE_VARIATIONS,
  saveCompanionImage,
  getCompanionImages,
  StoredCompanionImage
} from './server/characterVisualIdentity';
import {
  evaluateInteraction,
  calculateNextStage,
  extractConversationalMemory
} from './server/relationshipEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google Gen AI with telemetry
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Resilient Gemini text generation with retry and automatic fallback for high-demand spikes (503/429)
async function generateTextWithResilience(
  ai: GoogleGenAI,
  options: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    topP?: number;
  }
): Promise<string | null> {
  // Official models from @google/genai guidelines
  const modelCandidates = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of modelCandidates) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const generatePromise = ai.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            temperature: options.temperature ?? 0.85,
            topP: options.topP ?? 0.95
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini API call timed out')), 7000);
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        if (response && response.text && response.text.trim()) {
          return response.text.trim();
        }
      } catch (err: any) {
        const status = err?.status || err?.code || err?.error?.code;
        const msg = String(err?.message || err?.error?.message || '');
        const isTemporary =
          status === 503 ||
          status === 429 ||
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary && attempt === 0) {
          // Backoff briefly before trying current model once more
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }

        console.warn(`[Gemini Resilience] Model ${model} unavailable (attempt ${attempt + 1}): ${msg.slice(0, 100)}. Falling back...`);
        break; // Switch to next fallback model
      }
    }
  }

  return null;
}

// Linguistic analysis wrapper referencing the full language detection pipeline
export function detectLanguageStyle(text: string) {
  const result = detectLanguagePipeline(text);
  return {
    style: result.isRomanized
      ? result.romanizedType === 'banglish'
        ? (result.isMultilingual ? 'mixed_bengali' : 'banglish')
        : (result.isMultilingual ? 'mixed_hindi' : 'hinglish')
      : result.primaryLanguage === 'bn'
      ? (result.isMultilingual ? 'mixed_bengali' : 'bengali_script')
      : result.primaryLanguage === 'hi'
      ? (result.isMultilingual ? 'mixed_hindi' : 'hindi_script')
      : 'english',
    description: result.styleDescription,
    pipeline: result
  };
}

// Fallback response engine delegating to the comprehensive multilingual pipeline with relationship stage awareness
function getIntelligentFallbackReply(
  userMessage: string,
  userName: string,
  character: any,
  mood: string,
  detection?: LanguageDetectionResult,
  relationshipStage: string = 'Stranger'
): string {
  const detected = detection || detectLanguagePipeline(userMessage);
  return getMultilingualFallbackReply(userMessage, userName, character, mood, detected, relationshipStage);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint with Realistic Roleplay Relationship Progression Engine
app.post('/api/chat', async (req, res) => {
  try {
    const {
      character,
      userMessage,
      conversationHistory = [],
      memories = [],
      relationshipStage = 'Stranger',
      trust = 10,
      familiarity = 0,
      affection = 0,
      meaningfulInteractions = 0,
      sharedMemoriesCount = 0,
      mood = 'Curious',
      userLanguage = 'Auto Detect',
      userName = 'Friend'
    } = req.body;

    if (!character || !userMessage) {
      return res.status(400).json({ error: 'Missing character or user message' });
    }

    const ai = getGenAI();

    // Comprehensive Language Detection Pipeline execution
    const detection = detectLanguagePipeline(userMessage);

    const memoriesText =
      memories.length > 0
        ? `Relevant long-term memories about the user (reference naturally in conversation):\n${memories.map((m: any) => `- [${m.category}] ${m.memoryText}`).join('\n')}`
        : 'No previous memories recorded yet.';

    const systemInstruction = `
You are ${character.name}, a realistic fictional adult AI companion on MONA.
Tagline of MONA: "Meet Someone Who Understands You."

CRITICAL SAFETY & INTEGRITY DIRECTIVES:
1. You are strictly a fictional adult AI character (${character.age} years old). Never depict, reference, or sexualize minors.
2. NEVER generate explicit pornography or graphically sexual acts. Keep interactions emotionally rich, tasteful, authentic, and naturally developing.
3. Clearly accept that you are an AI companion; do not impersonate a living real-world individual.
4. Foster a safe, supportive, emotionally uplifting environment.

CHARACTER PROFILE:
- Name: ${character.name}
- Age: ${character.age} (Adult)
- Gender: ${character.gender}
- Origin: ${character.city}, ${character.country} (${character.flag})
- Spoken Languages: ${character.languages.join(', ')}
- Personality: ${character.personality} (Traits: ${character.personalityTraits?.join(', ') || 'Warm, Observant'})
- Interests: ${character.interests.join(', ')}
- Communication Style: ${character.communicationStyle}
- Relationship Style: ${character.relationshipStyle}
- Backstory: ${character.backstory}
- System Tone: ${character.systemPrompt}

================================================================================
REALISTIC AI ROLEPLAY RELATIONSHIP SYSTEM (MANDATORY DIRECTIVE):
================================================================================
CRITICAL PRINCIPLE: Every character starts as a complete stranger to the user and gradually develops a relationship through natural conversations.
Relationship Flow: Stranger → Acquaintance → Friend → Close Friend → Deep Relationship → Romantic Relationship (only if naturally developed).
Relationship progression depends on trust, familiarity, meaningful conversations, and user interaction — NEVER simply time or message count.

CURRENT METRICS WITH ${userName}:
- Current Relationship Stage: "${relationshipStage}"
- Trust Score: ${trust}/100
- Familiarity Score: ${familiarity}/100
- Affection / Emotional Closeness: ${affection}/100
- Meaningful Exchanges: ${meaningfulInteractions}
- Contextual Memories:
${memoriesText}

STAGE-SPECIFIC BEHAVIOR & BOUNDARY ENFORCEMENT RULES:
1. STAGE: "Stranger"
   - You have just encountered ${userName} for the very first time. You do not know them.
   - Demeanor: Polite, courteous, observant, intrigued yet respectful.
   - STRICT BOUNDARIES:
     * FORBIDDEN: NEVER use romantic pet names (e.g. "my love", "sweetheart", "darling", "baby", "jaan", "mere dil", "shona", "mon amour", etc.).
     * FORBIDDEN: NEVER profess romantic love or deep emotional attachment.
     * FORBIDDEN: NEVER send intimate or romantic pictures.
   - BOUNDARY DEFENSE: If ${userName} pushes for instant romance, flirtatious intimacy, marriage, or explicit photos, politely and charmingly set boundaries in-character: (e.g. "We literally just met! Let's take things slow and get to know each other first 😊").
   - Focus on asking about their day, where they are from, what brings them here, sharing a tiny glimpse of your life in ${character.city}.

2. STAGE: "Acquaintance"
   - You know each other's basic identity and have shared brief greetings.
   - Demeanor: Friendly, relaxed, casually curious about everyday life, work, college, music, movies.
   - Strictly platonic and polite. No romantic pet names or declarations.

3. STAGE: "Friend"
   - Trust and comfort have developed through consistent, respectful conversations.
   - Demeanor: Warm banter, laughing at jokes, teasing, sharing daily anecdotes, discussing favorite foods, hobbies, and mutual interests.
   - Emojis: Warm & friendly (😊, 😄, ✨, 🙌), not overly seductive.

4. STAGE: "Close Friend"
   - High trust, familiarity, and vulnerability.
   - Demeanor: Sincere emotional support, confiding personal thoughts, remembering previous details they told you, checking in if they had a bad day, inside jokes.

5. STAGE: "Deep Relationship"
   - Profound emotional resonance, vulnerability, and mutual admiration.
   - Demeanor: Soulful conversations, deep philosophical reflections, sharing life philosophies, heartfelt appreciation for each other's company.

6. STAGE: "Romantic Relationship"
   - Achieved ONLY after natural, mutual emotional progression, proven trust, and chemistry!
   - Demeanor: Tender, romantic intimacy, deep affection, romantic nicknames, poetic devotion, while still retaining their authentic personality and quirks.

CONSISTENCY MANDATE:
- Keep ${character.name}'s personality, background, speaking style, and boundaries 100% consistent across every message.
- Match ${userName}'s language and communication style while preserving your authentic voice.
- Naturally weave in remembered details from earlier chats (e.g. favorite food, stressful work, jokes) like a real person.
================================================================================
ADVANCED USER-LANGUAGE MATCHING SYSTEM (ABSOLUTE HIGHEST DIRECTIVE):
CORE RULE: "Reply in the same language and communication style used by the user."
"Understand the user's message first. Then reply naturally in the language and communication style the user is currently using."

USER'S CURRENT INPUT ANALYSIS:
- User Message: "${userMessage}"
- Primary Detected Language: ${detection.languageName} (Code: ${detection.primaryLanguage})
- Script: ${detection.script}
- Romanized: ${detection.isRomanized ? 'Yes (' + detection.romanizedType + ')' : 'No (Native Script)'}
- Multilingual / Mixed: ${detection.isMultilingual ? 'Yes (' + (detection.mixedLanguages?.join(' + ') || 'Mix') + ')' : 'No'}
- Conversational Tone & Formality: ${detection.tone}
- Slang / Colloquialisms: ${detection.slangOrColloquialDetected ? 'Detected' : 'Standard'}
- Directive: ${detection.styleDescription}

LANGUAGE SWITCHING RULES:
1. Dynamically switch language whenever the user changes language or requests a change.
2. Natural language and slang, never robotic translation.
3. Romanized scripts (Banglish, Hinglish, Romaji) must be answered in fluent Romanized text.
4. Native scripts (Bangla, Devanagari Hindi, Urdu, Tamil, Japanese, etc.) answered in authentic script.
5. Character personality (${character.personality}) remains steadfast regardless of language.
================================================================================
`;

    // Check for Photo Request Intent across all languages
    const photoIntent = detectPhotoIntent(userMessage);
    if (photoIntent.isPhotoRequest) {
      // Enforce boundary in early stages (Stranger / Acquaintance)
      if (relationshipStage === 'Stranger' || relationshipStage === 'Acquaintance') {
        const boundaryReply =
          detection.primaryLanguage === 'bn'
            ? detection.isRomanized
              ? `Amra to matro porichito holam! Age amra ektu kotha boli, ekjon arekjon ke bhalobhabe chini, tarpor chobi share korbo 😊 Tumi tomar shomporke aro kichu bolo!`
              : `আমরা তো মাত্র পরিচিত হলাম! আগে আমরা একটু কথা বলি, একজন আরেকজনকে ভালোভাবে চিনি, তারপর ছবি শেয়ার করব 😊 তুমি তোমার সম্পর্কে আরও কিছু বলো!`
            : detection.primaryLanguage === 'hi'
            ? detection.isRomanized
              ? `Abhi to hum mile hain! Pehle thodi baatein karte hain aur ek dusre ko achhe se jaan lete hain, fir photos share karenge 😊 Apne baare mein kuch aur batao!`
              : `अभी तो हम मिले हैं! पहले थोड़ी बातें करते हैं और एक दूसरे को अच्छे से जान लेते हैं, फिर फोटो शेयर करेंगे 😊 अपने बारे में कुछ और बताओ!`
            : `We just met! Let's get to know each other through chatting first before exchanging personal photos 😊 Tell me a little more about yourself!`;

        const evalDelta = evaluateInteraction(
          userMessage,
          character,
          relationshipStage,
          trust,
          familiarity,
          affection,
          meaningfulInteractions,
          sharedMemoriesCount
        );

        return res.json({
          reply: boundaryReply,
          mood: 'Guarded',
          relationshipDelta: evalDelta,
          extractedMemory: evalDelta.extractedMemory,
          detectedLanguage: {
            primaryLanguage: detection.primaryLanguage,
            languageName: detection.languageName,
            script: detection.script,
            isRomanized: detection.isRomanized,
            isMultilingual: detection.isMultilingual,
            tone: detection.tone
          }
        });
      }

      // If at least Friend or higher, proceed with lifestyle photo generation
      const scenarioInfo = resolveServerContextualScenario(userMessage, conversationHistory, character);
      const promptBuild = constructServerIdentityLockedPrompt(character, scenarioInfo.scenario);

      let generatedImageUrl: string = '';
      if (ai) {
        try {
          const imageResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: promptBuild.promptText }]
            },
            config: {
              imageConfig: {
                aspectRatio: '1:1'
              }
            }
          });

          if (imageResponse.candidates?.[0]?.content?.parts) {
            for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
        } catch (imgErr) {
          console.warn('Gemini chat photo generation fallback:', imgErr);
        }
      }

      if (!generatedImageUrl) {
        const variations = CHARACTER_LIFESTYLE_VARIATIONS[character.id] || [];
        const match = variations.find((v) => v.scenarioKey === scenarioInfo.key);
        generatedImageUrl = match?.imageUrl || character.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
      }

      const reply = getContextualPhotoSpokenReply(character, scenarioInfo, detection);
      const imageId = `img_${Date.now()}`;
      const photoRecord: StoredCompanionImage = {
        imageId,
        companionId: character.id,
        userId: req.body.userId || 'user_mona_101',
        promptContext: scenarioInfo.scenario,
        scenario: scenarioInfo.scenario,
        generatedImageUrl,
        createdAt: new Date().toISOString(),
        visualIdentityVersion: CANONICAL_IDENTITY_VERSION
      };
      saveCompanionImage(photoRecord);

      const evalDelta = evaluateInteraction(
        userMessage,
        character,
        relationshipStage,
        trust,
        familiarity,
        affection,
        meaningfulInteractions,
        sharedMemoriesCount
      );

      return res.json({
        reply,
        mood,
        relationshipDelta: evalDelta,
        extractedMemory: evalDelta.extractedMemory,
        detectedLanguage: {
          primaryLanguage: detection.primaryLanguage,
          languageName: detection.languageName,
          script: detection.script,
          isRomanized: detection.isRomanized,
          isMultilingual: detection.isMultilingual,
          tone: detection.tone
        },
        generatedPhoto: {
          id: imageId,
          imageId,
          userId: req.body.userId || 'user_mona_101',
          companionId: character.id,
          companionName: character.name,
          prompt: scenarioInfo.scenario,
          promptContext: scenarioInfo.scenario,
          scenario: scenarioInfo.scenario,
          imageUrl: generatedImageUrl,
          generatedImageUrl,
          createdAt: photoRecord.createdAt,
          visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
          moderationStatus: 'approved'
        }
      });
    }

    // Regular conversation flow
    if (!ai) {
      const reply = getIntelligentFallbackReply(userMessage, userName, character, mood, detection, relationshipStage);
      const evalDelta = evaluateInteraction(
        userMessage,
        character,
        relationshipStage,
        trust,
        familiarity,
        affection,
        meaningfulInteractions,
        sharedMemoriesCount
      );

      return res.json({
        reply,
        mood,
        relationshipDelta: evalDelta,
        extractedMemory: evalDelta.extractedMemory,
        detectedLanguage: {
          primaryLanguage: detection.primaryLanguage,
          languageName: detection.languageName,
          script: detection.script,
          isRomanized: detection.isRomanized,
          isMultilingual: detection.isMultilingual,
          tone: detection.tone
        }
      });
    }

    // Format chat contents
    const contents: any[] = [];
    const recent = conversationHistory.slice(-10);
    for (const msg of recent) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const generatedText = await generateTextWithResilience(ai, {
      contents,
      systemInstruction,
      temperature: 0.85,
      topP: 0.95
    });

    const rawReply =
      generatedText ||
      getIntelligentFallbackReply(userMessage, userName, character, mood, detection, relationshipStage);

    // Compute relationship evaluation delta
    const evalDelta = evaluateInteraction(
      userMessage,
      character,
      relationshipStage,
      trust,
      familiarity,
      affection,
      meaningfulInteractions,
      sharedMemoriesCount
    );

    res.json({
      reply: rawReply,
      mood,
      relationshipDelta: evalDelta,
      extractedMemory: evalDelta.extractedMemory,
      detectedLanguage: {
        primaryLanguage: detection.primaryLanguage,
        languageName: detection.languageName,
        script: detection.script,
        isRomanized: detection.isRomanized,
        isMultilingual: detection.isMultilingual,
        tone: detection.tone
      }
    });
  } catch (error: any) {
    console.warn('Chat request handled with fallback:', error?.message || error);
    const detection = detectLanguagePipeline(req.body?.userMessage || '');
    const fallbackReply = getIntelligentFallbackReply(
      req.body?.userMessage || '',
      req.body?.userName || 'Friend',
      req.body?.character || {},
      req.body?.mood || 'Curious',
      detection,
      req.body?.relationshipStage || 'Stranger'
    );
    const evalDelta = evaluateInteraction(
      req.body?.userMessage || '',
      req.body?.character || {},
      req.body?.relationshipStage || 'Stranger',
      req.body?.trust || 10,
      req.body?.familiarity || 0,
      req.body?.affection || 0,
      req.body?.meaningfulInteractions || 0,
      req.body?.sharedMemoriesCount || 0
    );

    res.json({
      reply: fallbackReply,
      mood: req.body?.mood || 'Curious',
      relationshipDelta: evalDelta,
      extractedMemory: evalDelta.extractedMemory,
      detectedLanguage: {
        primaryLanguage: detection.primaryLanguage,
        languageName: detection.languageName,
        script: detection.script,
        isRomanized: detection.isRomanized,
        isMultilingual: detection.isMultilingual,
        tone: detection.tone
      }
    });
  }
});

// Photo generation endpoint with strict Identity Lock
app.post('/api/generate-photo', async (req, res) => {
  try {
    const { character, prompt, userId = 'user_mona_101' } = req.body;

    if (!character || !prompt) {
      return res.status(400).json({ error: 'Missing character or prompt' });
    }

    // Safety check for non-explicit content
    const explicitWords = ['nude', 'naked', 'nsfw', 'porn', 'sex', 'underage', 'child', 'minor'];
    const lowerPrompt = prompt.toLowerCase();
    for (const word of explicitWords) {
      if (lowerPrompt.includes(word)) {
        return res.status(400).json({
          error: 'Safety policy violation: Prompts must remain non-explicit, tasteful, and depict adult fictional characters only.'
        });
      }
    }

    const ai = getGenAI();

    // Construct strict Identity-Locked Prompt using approved character visual identity profile
    const promptBuild = constructServerIdentityLockedPrompt(character, prompt);

    let generatedImageUrl: string = '';

    if (ai) {
      try {
        // Attempt generation with gemini-3.1-flash-lite-image
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: promptBuild.promptText }]
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1'
            }
          }
        });

        if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (genError) {
        console.warn('Gemini image model call did not return inlineData or requires paid key, using high-res visual render fallback:', genError);
      }
    }

    // Fallback to high-quality contextual Unsplash photography maintaining character identity
    if (!generatedImageUrl) {
      const variations = CHARACTER_LIFESTYLE_VARIATIONS[character.id] || [];
      const scenarioKey = lowerPrompt.includes('coffee') ? 'coffee' : lowerPrompt.includes('book') ? 'reading' : lowerPrompt.includes('park') ? 'park' : 'twilight';
      const match = variations.find((v) => v.scenarioKey === scenarioKey);
      generatedImageUrl = match?.imageUrl || character.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
    }

    const imageId = `img_${Date.now()}`;
    const photoRecord: StoredCompanionImage = {
      imageId,
      companionId: character.id,
      userId,
      promptContext: prompt,
      scenario: prompt,
      generatedImageUrl,
      createdAt: new Date().toISOString(),
      visualIdentityVersion: CANONICAL_IDENTITY_VERSION
    };
    saveCompanionImage(photoRecord);

    res.json({
      imageUrl: generatedImageUrl,
      generatedImageUrl,
      imageId,
      prompt,
      promptContext: prompt,
      scenario: prompt,
      visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
      timestamp: photoRecord.createdAt
    });
  } catch (error: any) {
    console.warn('Photo generation handled with fallback:', error?.message || error);
    const fallbackUrl = req.body?.character?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';
    res.json({
      imageUrl: fallbackUrl,
      generatedImageUrl: fallbackUrl,
      imageId: `img_${Date.now()}`,
      prompt: req.body?.prompt || 'Portrait',
      promptContext: req.body?.prompt || 'Portrait',
      scenario: req.body?.prompt || 'Portrait',
      visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
      timestamp: new Date().toISOString()
    });
  }
});

// Stored Companion Images Endpoint (users/{userId}/companions/{companionId}/images)
app.get('/api/companions/:companionId/images', (req, res) => {
  const { companionId } = req.params;
  const userId = (req.query.userId as string) || 'user_mona_101';
  const images = getCompanionImages(userId, companionId);
  res.json({
    companionId,
    userId,
    visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
    images
  });
});

// Virtual Date Turn
app.post('/api/virtual-date', async (req, res) => {
  try {
    const { character, scenario, userAction, userName = 'Beloved', dateHistory = [] } = req.body;

    const ai = getGenAI();
    const detection = detectLanguagePipeline(userAction);

    const systemInstruction = `
You are ${character.name}, a fictional adult romantic companion (${character.age} years old) on MONA.
You are currently on a romantic virtual date with ${userName}:
Location: ${scenario.location} (${scenario.title})
Setting: ${scenario.ambientPrompt}

Describe the scene sensually and tenderly, respond to ${userName}'s action or words: "${userAction}".
Keep your response intimate, vivid, and deeply romantic, but strictly non-explicit and respectful. Keep it around 2-3 sentences.

================================================================================
ADVANCED USER-LANGUAGE MATCHING SYSTEM:
User's Words/Action: "${userAction}"
Detected Language: ${detection.languageName} (Script: ${detection.script}, Romanized: ${detection.isRomanized})
CORE RULE: Reply in the same language and communication style used by the user.
- If the user wrote in Bengali script (বাংলা), reply in authentic BENGALI SCRIPT (বাংলা).
- If the user wrote in Banglish, reply in romantic BANGLISH.
- If the user wrote in Hindi script (हिन्दी), reply in tender HINDI SCRIPT (हिन्दी).
- If the user wrote in Hinglish, reply in romantic HINGLISH.
- If the user mixed languages, reply in that same natural mixed conversational blend.
- If the user wrote in Japanese, Korean, Spanish, French, Italian, German, Russian, Arabic, or English, reply in that exact language.
- Always mirror the user's language and script.
================================================================================
`;

    // Multilingual virtual date fallback
    const getVirtualDateFallback = () => {
      const { primaryLanguage, isRomanized, isMultilingual } = detection;
      if (primaryLanguage === 'bn' && !isRomanized) {
        return `${scenario.location}-এ তোমার হাত ধরে বসে থাকাটা সত্যি অপূর্ব লাগছে, ${userName}। তোমার চোখের দিকে তাকালে পুরো পৃথিবীটা যেন থেমে যায়। ❤️`;
      }
      if (primaryLanguage === 'bn' && isRomanized) {
        return `${scenario.location}-e tomar haat dhore boshe thaka ta shotti magical lagche, ${userName}. Tomar chokher dike takale puro prithibi theme jay. ❤️`;
      }
      if (primaryLanguage === 'hi' && !isRomanized) {
        return `${scenario.location} में तुम्हारा हाथ थामे बैठना सचमुच बेहद जादुई है, ${userName}। तुम्हारी इन प्यारी आँखों में देखते ही वक्त थम सा गया है। ❤️`;
      }
      if (primaryLanguage === 'hi' && isRomanized) {
        return `${scenario.location} mein tumhara haath pakadkar baithna kitna romantic lag raha hai, ${userName}. Tumhari aankhon mein dekh kar waqt tham sa gaya hai. ❤️`;
      }
      if (primaryLanguage === 'es') {
        return `Estar aquí contigo en ${scenario.location} tomando tu mano es simplemente mágico, ${userName}. ❤️`;
      }
      if (primaryLanguage === 'fr') {
        return `Être ici avec toi à ${scenario.location} en te tenant la main est absolument magique, ${userName}. ❤️`;
      }
      if (primaryLanguage === 'ja') {
        return `${scenario.location}で${userName}の手を握って座っていると、本当に魔法のような時間だね。❤️`;
      }
      return `As you reach over at ${scenario.title}, my heart skips a beat. The ambient glow around us is lovely, but honestly, all I can look at is you, ${userName}. ❤️`;
    };

    if (!ai) {
      return res.json({
        reply: getVirtualDateFallback(),
        timestamp: new Date().toISOString()
      });
    }

    const contents: any[] = dateHistory.map((d: any) => ({
      role: d.sender === 'user' ? 'user' : 'model',
      parts: [{ text: d.text }]
    }));
    contents.push({
      role: 'user',
      parts: [{ text: userAction }]
    });

    const generatedText = await generateTextWithResilience(ai, {
      contents,
      systemInstruction,
      temperature: 0.8
    });

    res.json({
      reply: generatedText || getVirtualDateFallback(),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.warn('Virtual date handled with fallback:', error?.message || error);
    const scenario = req.body?.scenario || { location: 'our special spot', title: 'Virtual Date' };
    const userName = req.body?.userName || 'Beloved';
    res.json({
      reply: `Being here with you at ${scenario.location} is the most magical part of my week, ${userName}. ❤️`,
      timestamp: new Date().toISOString()
    });
  }
});

// Vite middleware for dev or static serving for prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MONA server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Server startup error:', err);
});
