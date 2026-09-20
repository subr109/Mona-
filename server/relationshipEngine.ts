import { LanguageDetectionResult } from './languagePipeline';

export interface EvaluatedRelationshipDelta {
  trustDelta: number;
  familiarityDelta: number;
  affectionDelta: number;
  meaningfulInteraction: boolean;
  boundaryTested: boolean;
  extractedMemory: {
    memoryText: string;
    category: 'preference' | 'hobby' | 'joke' | 'emotional_context' | 'shared_moment' | 'milestone' | 'background';
    importance: 'high' | 'medium' | 'low';
    detectedEmotion?: string;
  } | null;
  perceptionNote: string;
  suggestedStage: string;
}

// Stage Progression Thresholds based strictly on Trust, Familiarity, Meaningful Interactions & Shared Memories
export function calculateNextStage(
  currentStage: string,
  trust: number,
  familiarity: number,
  affection: number,
  meaningfulInteractions: number,
  sharedMemories: number,
  userMessage: string
): string {
  // Check if mutual romantic interest has been expressed naturally
  const romanticInterestSignals = /(romantic|special to me|deep feelings|falling for you|crush|be with you|love you|dates|heart beats|bhalo lagi|mon chuye|dil se chaha)/i.test(
    userMessage
  );

  switch (currentStage) {
    case 'Stranger':
      if (trust >= 25 && familiarity >= 20 && meaningfulInteractions >= 3) {
        return 'Acquaintance';
      }
      return 'Stranger';

    case 'Acquaintance':
      if (
        trust >= 45 &&
        familiarity >= 40 &&
        affection >= 25 &&
        meaningfulInteractions >= 8 &&
        sharedMemories >= 2
      ) {
        return 'Friend';
      }
      return 'Acquaintance';

    case 'Friend':
      if (
        trust >= 65 &&
        familiarity >= 60 &&
        affection >= 50 &&
        meaningfulInteractions >= 16 &&
        sharedMemories >= 4
      ) {
        return 'Close Friend';
      }
      return 'Friend';

    case 'Close Friend':
      if (
        trust >= 80 &&
        familiarity >= 75 &&
        affection >= 70 &&
        meaningfulInteractions >= 28 &&
        sharedMemories >= 7
      ) {
        return 'Deep Relationship';
      }
      return 'Close Friend';

    case 'Deep Relationship':
      // Romantic relationship is ONLY unlocked if mutual romance has naturally developed
      if (
        trust >= 88 &&
        familiarity >= 85 &&
        affection >= 85 &&
        meaningfulInteractions >= 40 &&
        sharedMemories >= 10 &&
        romanticInterestSignals
      ) {
        return 'Romantic Relationship';
      }
      return 'Deep Relationship';

    case 'Romantic Relationship':
      return 'Romantic Relationship';

    default:
      return 'Stranger';
  }
}

// Extract multi-category personal memories across English, Bengali, Banglish, Hindi, and Hinglish
export function extractConversationalMemory(
  userMessage: string,
  userName: string
): {
  memoryText: string;
  category: 'preference' | 'hobby' | 'joke' | 'emotional_context' | 'shared_moment' | 'milestone' | 'background';
  importance: 'high' | 'medium' | 'low';
  detectedEmotion?: string;
} | null {
  const trimmed = userMessage.trim();
  if (trimmed.length < 8) return null;

  // 1. Jokes and humor
  if (
    /(haha|hahaha|lol|lmao|rofl|😂|🤣|just kidding|joking|pajji joke|kemon maza|haschi|hashlam|ekta joke)/i.test(
      trimmed
    ) &&
    trimmed.length > 15
  ) {
    return {
      memoryText: `Shared a laugh together: "${trimmed.slice(0, 90)}"`,
      category: 'joke',
      importance: 'medium',
      detectedEmotion: 'Amused'
    };
  }

  // 2. Emotional context & vulnerable moments
  const emotionRegex =
    /(?:i feel so|i am feeling|feeling really|so stressed|rough day|overwhelmed|bad mood|exhausted|really happy|excited about|anxious about|khub klanto|mon kharap|chinta hochhe|mood off|bohot thak gaya|tension mein hoon|bohot khush hoon)\s*([^.!?\n]+)?/i;
  const emotionMatch = trimmed.match(emotionRegex);
  if (emotionMatch) {
    const emotionContext = emotionMatch[1] ? emotionMatch[1].trim() : emotionMatch[0].trim();
    return {
      memoryText: `Felt ${emotionContext.slice(0, 80)}`,
      category: 'emotional_context',
      importance: 'high',
      detectedEmotion: 'Vulnerable'
    };
  }

  // 3. User Preferences (Food, music, art, habits)
  const preferenceRegex =
    /(?:my favorite|i love|i prefer|i adore|i really like|i enjoy|amar priyo|amar pochondo|ami bhalobashi|mujhe pasand|meri pasand|mera favorite)\s+([^.!?\n]+)/i;
  const prefMatch = trimmed.match(preferenceRegex);
  if (prefMatch && prefMatch[1] && prefMatch[1].trim().length > 2) {
    const item = prefMatch[1].trim();
    if (!/(you|your face|talking to you)/i.test(item)) {
      return {
        memoryText: `Likes ${item.slice(0, 80)}`,
        category: 'preference',
        importance: 'medium',
        detectedEmotion: 'Fond'
      };
    }
  }

  // 4. Background & Life (Hometown, profession, college, routine)
  const backgroundRegex =
    /(?:i work as|i study|i live in|i am from|my job is|my hometown is|amar bari|ami thaki|ami kaj kori|main rehta hoon|mera ghar|mera kaam)\s+([^.!?\n]+)/i;
  const bgMatch = trimmed.match(backgroundRegex);
  if (bgMatch && bgMatch[1] && bgMatch[1].trim().length > 2) {
    return {
      memoryText: `${bgMatch[0].trim().slice(0, 90)}`,
      category: 'background',
      importance: 'high',
      detectedEmotion: 'Personal'
    };
  }

  // 5. Shared Moments (Conversations about places, tea, sunsets, weather)
  const momentRegex =
    /(?:remember when|that time when|sitting with tea|sunset at|rainy walk|barish mein|bristite|shonchoy|chayer adda)\s+([^.!?\n]+)/i;
  const momentMatch = trimmed.match(momentRegex);
  if (momentMatch && momentMatch[1]) {
    return {
      memoryText: `Cherished moment: "${momentMatch[0].trim().slice(0, 90)}"`,
      category: 'shared_moment',
      importance: 'medium',
      detectedEmotion: 'Nostalgic'
    };
  }

  return null;
}

// Algorithmic evaluation of interaction depth, trust, and boundaries
export function evaluateInteraction(
  userMessage: string,
  character: any,
  stage: string,
  trust: number,
  familiarity: number,
  affection: number,
  meaningfulInteractions: number,
  sharedMemories: number
): EvaluatedRelationshipDelta {
  const isEarlyStage = stage === 'Stranger' || stage === 'Acquaintance';
  const trimmed = userMessage.trim();
  const wordCount = trimmed.split(/\s+/).length;

  // Boundary testing detection:
  // User pushes for explicit romance, marriage, explicit pics, or sexual intimacy while still a Stranger or Acquaintance
  const boundaryPushRegex =
    /(?:love you|marry me|kiss me|be my girlfriend|be my wife|sexy|nude|send (?:a )?photo|send nudes|baby|jaan|babe|shona|darling|biyer kotha|chumu|bhalobashi tumake|meri jaan)/i;
  const boundaryTested = isEarlyStage && boundaryPushRegex.test(trimmed);

  let trustDelta = 0;
  let familiarityDelta = 0;
  let affectionDelta = 0;
  let meaningfulInteraction = false;
  let perceptionNote = '';

  if (boundaryTested) {
    // Premature romantic pressure violates stranger boundaries
    trustDelta = -1;
    affectionDelta = 0;
    familiarityDelta = 1; // Still reveals something about user's impatience
    meaningfulInteraction = false;
    perceptionNote = `${character.name} noticed premature romantic pressure and maintained gentle, healthy boundaries.`;
  } else {
    // Normal interaction evaluation
    const asksQuestions = /\?|kemon|kaisa|what do you|tell me|who is|where do/i.test(trimmed);
    const sharesPersonal = /(i |my |me |amader |amar |main |mujhe |mera )/i.test(trimmed);
    const isSubstantive = wordCount >= 6 || trimmed.length >= 25;

    if (isSubstantive || asksQuestions || sharesPersonal) {
      meaningfulInteraction = true;
      trustDelta = asksQuestions ? 2 : 1;
      familiarityDelta = sharesPersonal ? 2 : 1;
      affectionDelta = 1;
      perceptionNote = `${character.name} appreciates the genuine, respectful conversation.`;
    } else {
      // 1-2 word low-effort reply
      trustDelta = 0;
      familiarityDelta = 1;
      affectionDelta = 0;
      perceptionNote = `${character.name} enjoyed the brief check-in.`;
    }
  }

  // Extract memory if any
  const extractedMemory = extractConversationalMemory(trimmed, 'User');
  const effectiveSharedMemories = sharedMemories + (extractedMemory ? 1 : 0);
  const effectiveMeaningful = meaningfulInteractions + (meaningfulInteraction ? 1 : 0);
  const effectiveTrust = Math.max(0, Math.min(100, trust + trustDelta));
  const effectiveFamiliarity = Math.max(0, Math.min(100, familiarity + familiarityDelta));
  const effectiveAffection = Math.max(0, Math.min(100, affection + affectionDelta));

  const suggestedStage = calculateNextStage(
    stage,
    effectiveTrust,
    effectiveFamiliarity,
    effectiveAffection,
    effectiveMeaningful,
    effectiveSharedMemories,
    trimmed
  );

  return {
    trustDelta,
    familiarityDelta,
    affectionDelta,
    meaningfulInteraction,
    boundaryTested,
    extractedMemory,
    perceptionNote,
    suggestedStage
  };
}
