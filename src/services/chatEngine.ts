import {
  AICharacter,
  Message,
  RelationshipStage,
  Memory,
  MoodType,
  GeneratedImage
} from '../types';
import {
  detectLanguagePipeline,
  getMultilingualFallbackReply,
  LanguageDetectionResult
} from './languagePipeline';
import {
  evaluateInteraction,
  EvaluatedRelationshipDelta
} from './relationshipEngine';
import {
  detectPhotoIntent,
  resolveServerContextualScenario,
  getContextualPhotoSpokenReply
} from './characterVisualIdentity';

export interface GenerateReplyParams {
  character: AICharacter;
  userMessage: string;
  conversationHistory: Message[];
  memories: Memory[];
  relationshipStage: RelationshipStage;
  trust: number;
  familiarity: number;
  affection: number;
  meaningfulInteractions: number;
  sharedMemoriesCount?: number;
  mood: MoodType;
  userLanguage?: string;
  userName?: string;
}

export interface GenerateReplyResult {
  reply: string;
  mood?: MoodType;
  relationshipDelta?: EvaluatedRelationshipDelta;
  extractedMemory?: {
    memoryText: string;
    category: 'preference' | 'hobby' | 'joke' | 'emotional_context' | 'shared_moment' | 'milestone' | 'background';
    importance: 'high' | 'medium' | 'low';
    detectedEmotion?: string;
  } | null;
  detectedLanguage?: LanguageDetectionResult;
  generatedPhoto?: GeneratedImage | null;
}

/**
 * Universal Companion Chat Engine
 * Works seamlessly in both Full-Stack environments (Express + Gemini API)
 * and Static Environments (like GitHub Pages where /api/chat is not hosted).
 */
export async function generateCompanionReply(
  params: GenerateReplyParams
): Promise<GenerateReplyResult> {
  const {
    character,
    userMessage,
    conversationHistory,
    memories,
    relationshipStage,
    trust,
    familiarity,
    affection,
    meaningfulInteractions,
    sharedMemoriesCount = 0,
    mood,
    userLanguage,
    userName = 'Friend'
  } = params;

  // 1. Attempt server-side Gemini API call if backend is reachable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        character,
        userMessage,
        conversationHistory,
        memories,
        relationshipStage,
        trust,
        familiarity,
        affection,
        meaningfulInteractions,
        sharedMemoriesCount,
        mood,
        userLanguage: userLanguage || 'Auto Detect',
        userName
      })
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
          return data;
        }
      }
    }
  } catch (_networkOrStaticError) {
    // Graceful silent fallback to client-side companion engine (e.g. on GitHub Pages or offline)
  }

  // 2. Client-Side Multilingual Companion Intelligence Engine
  const detection = detectLanguagePipeline(userMessage);

  // Evaluate relationship dynamics and extract memories
  const relationshipDelta = evaluateInteraction(
    userMessage,
    character,
    relationshipStage,
    trust,
    familiarity,
    affection,
    meaningfulInteractions,
    sharedMemoriesCount
  );

  // Check for contextual photo sharing request
  const photoIntent = detectPhotoIntent(userMessage);
  let generatedPhoto: GeneratedImage | null = null;
  let companionReply = '';

  const canSharePhoto =
    relationshipStage !== 'Stranger' ||
    userMessage.toLowerCase().includes('coffee') ||
    userMessage.toLowerCase().includes('tea') ||
    userMessage.toLowerCase().includes('morning') ||
    userMessage.toLowerCase().includes('pic') ||
    userMessage.toLowerCase().includes('chobi');

  if (photoIntent.isPhotoRequest && canSharePhoto) {
    const scenarioData = resolveServerContextualScenario(userMessage, conversationHistory, character);
    generatedPhoto = {
      id: `img_${Date.now()}`,
      imageId: `photo_${character.id}_${Date.now()}`,
      companionId: character.id,
      companionName: character.name,
      userId: 'client_user',
      prompt: scenarioData.scenario,
      promptContext: scenarioData.scenario,
      scenario: scenarioData.key,
      imageUrl: character.profileImageUrl,
      generatedImageUrl: character.profileImageUrl,
      createdAt: new Date().toISOString(),
      visualIdentityVersion: 'v1.0-locked-identity',
      moderationStatus: 'approved'
    };

    const spokenIntro = getContextualPhotoSpokenReply(
      character,
      scenarioData,
      detection
    );
    companionReply = spokenIntro;
  } else {
    // Generate intelligent, character-aligned conversational dialogue
    companionReply = getMultilingualFallbackReply(
      userMessage,
      userName,
      character,
      mood,
      detection,
      relationshipStage
    );
  }

  // Derive dynamic companion mood
  const derivedMood: MoodType =
    detection.tone === 'playful'
      ? 'Playful'
      : detection.tone === 'informal'
      ? 'Happy'
      : (mood as MoodType) || 'Curious';

  return {
    reply: companionReply,
    mood: derivedMood,
    relationshipDelta,
    extractedMemory: relationshipDelta.extractedMemory,
    detectedLanguage: detection,
    generatedPhoto
  };
}
