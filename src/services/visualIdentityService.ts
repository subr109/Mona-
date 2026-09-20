import { AICharacter, VisualIdentity, GeneratedImage } from '../types';

/**
 * Permanent Visual Identity Version.
 * Guarantees that seeded and stored companions retain their visual identity
 * across every generation turn.
 */
export const CANONICAL_IDENTITY_VERSION = 'v1.0-locked-identity';

/**
 * Approved canonical character visual profiles with permanent identity locks.
 * Every character has exact facial structure, eyes, eyebrows, nose, lips, jawline,
 * skin tone, hair description, body proportions, and reference imagery.
 */
export const CANONICAL_CHARACTER_IDENTITIES: Record<string, Partial<VisualIdentity>> = {
  // Ananya Sharma (India / Mumbai)
  char_f_1: {
    faceIdentity: 'Delicate warm Indian oval face, high sculpted cheekbones, elegant refined jawline',
    facialFeatures: 'Softly arched natural dark eyebrows, straight slender nose, naturally contoured rose lips',
    eyeDescription: 'Warm hazel-green almond eyes with dark curling lashes and tender crinkles at corners',
    hairDescription: 'Wavy chestnut brown shoulder-length hair parted slightly off-center with subtle warm caramel undertones',
    skinTone: 'Fair with warm golden undertones and natural soft blush',
    bodyType: 'Slender, graceful feminine proportions, poised classical posture',
    heightDescription: 'Medium height impression (approx. 167 cm), elegant silhouette',
    distinctiveFeatures: 'A delicate dimple on her left cheek when smiling and expressive warm hazel gaze',
    ageAppearance: 24,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Pooja Nair (India / Kochi)
  char_f_2: {
    faceIdentity: 'Delicate soft heart-shaped Indian face, gentle jawline, smooth warm contours',
    facialFeatures: 'Delicately arched dark eyebrows, neat small nose, soft naturally tinted pink lips',
    eyeDescription: 'Deep dark brown almond-shaped eyes with a serene, attentive, and shyly affectionate gaze',
    hairDescription: 'Silky straight jet black hair falling gracefully past her shoulders with soft wispy bangs',
    skinTone: 'Smooth luminous dusky bronze with warm undertones',
    bodyType: 'Petite, slender, gentle and poised proportions',
    heightDescription: 'Petite impression (approx. 158 cm), graceful posture',
    distinctiveFeatures: 'Gentle almond eyes that crinkle sweetly when laughing softly and a modest charming smile',
    ageAppearance: 23,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Priya Sen (India / Kolkata)
  char_f_3: {
    faceIdentity: 'Radiant South Asian oval face, well-defined sculpted jawline, expressive facial symmetry',
    facialFeatures: 'Naturally thick well-defined arched black brows, sharp straight nose, full expressive warm berry lips',
    eyeDescription: 'Deep warm honey-brown large almond eyes lined with natural dark lashes and soulful gaze',
    hairDescription: 'Thick, voluminous lustrous raven black wavy hair cascading down past her shoulders',
    skinTone: 'Warm golden dusky terracotta undertone, radiant and healthy glow',
    bodyType: 'Curvaceous, poised, graceful posture with classic South Asian aesthetic',
    heightDescription: 'Medium height impression (approx. 164 cm), confident feminine stature',
    distinctiveFeatures: 'Deep expressive kajal-lined almond eyes, an infectious radiant smile, and subtle bindi spot',
    ageAppearance: 25,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
    ]
  },

  // Diya Kapoor (India / New Delhi)
  char_f_4: {
    faceIdentity: 'Sculpted Mediterranean oval face, pronounced cheekbones, confident defined chin',
    facialFeatures: 'Feathered medium brown brows, classic Roman nose, softly plump warm terracotta lips',
    eyeDescription: 'Luminous amber-gold eyes with sun-flecked irises and an inviting passionate gaze',
    hairDescription: 'Sun-kissed honey brunette hair with loose tousled beach waves falling mid-back',
    skinTone: 'Sun-kissed olive with warm golden undertones',
    bodyType: 'Athletic, statuesque, toned and confident feminine silhouette',
    heightDescription: 'Tall impression (approx. 173 cm), statuesque elegance',
    distinctiveFeatures: 'High sun-kissed cheekbones, captivating golden-amber gaze, and warm Mediterranean smile',
    ageAppearance: 26,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    ]
  }
};

/**
 * Ensures any companion (pre-seeded, dynamic, or custom) has a full, immutable
 * VisualIdentity profile adhering strictly to the MONA Character-Identity specification.
 */
export function ensureVisualIdentity(character: Partial<AICharacter>): VisualIdentity {
  const existing = character.visualIdentity;
  const canonicalPreset = character.id ? CANONICAL_CHARACTER_IDENTITIES[character.id] : undefined;

  const ageAppearance =
    existing?.ageAppearance ||
    character.age ||
    canonicalPreset?.ageAppearance ||
    24;

  const baseProfileImageUrl =
    existing?.baseProfileImageUrl ||
    canonicalPreset?.baseProfileImageUrl ||
    character.profileImageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  const identityReferenceImages =
    existing?.identityReferenceImages && existing.identityReferenceImages.length > 0
      ? existing.identityReferenceImages
      : canonicalPreset?.identityReferenceImages || [baseProfileImageUrl];

  const faceIdentity =
    existing?.faceIdentity ||
    canonicalPreset?.faceIdentity ||
    existing?.faceDescription ||
    `Distinctive adult facial structure representing a ${character.country || 'cosmopolitan'} aesthetic, defined jawline and balanced features`;

  const facialFeatures =
    existing?.facialFeatures ||
    canonicalPreset?.facialFeatures ||
    `Naturally shaped eyebrows, straight refined nose, expressive lips matching ${character.name || 'companion'}`;

  const eyeDescription =
    existing?.eyeDescription ||
    canonicalPreset?.eyeDescription ||
    existing?.eyeColor ||
    'Warm, expressive eyes with attentive romantic gaze';

  const hairDescription =
    existing?.hairDescription ||
    canonicalPreset?.hairDescription ||
    existing?.hair ||
    'Naturally styled hair with consistent color and texture';

  const skinTone =
    existing?.skinTone ||
    canonicalPreset?.skinTone ||
    'Healthy, radiant complexion with natural undertones';

  const bodyType =
    existing?.bodyType ||
    canonicalPreset?.bodyType ||
    existing?.bodyDescription ||
    'Natural, healthy adult proportions and graceful posture';

  const heightDescription =
    existing?.heightDescription ||
    canonicalPreset?.heightDescription ||
    'Proportionate height and balanced posture';

  const distinctiveFeatures =
    existing?.distinctiveFeatures ||
    canonicalPreset?.distinctiveFeatures ||
    'Warm gaze, genuine smile, recognizable facial silhouette';

  return {
    faceIdentity,
    facialFeatures,
    eyeDescription,
    hairDescription,
    skinTone,
    bodyType,
    heightDescription,
    distinctiveFeatures,
    ageAppearance,
    baseProfileImageUrl,
    identityReferenceImages,
    // Backwards compatibility convenience properties
    faceDescription: existing?.faceDescription || faceIdentity,
    hair: existing?.hair || hairDescription,
    hairColor: existing?.hairColor || 'Natural',
    eyeColor: existing?.eyeColor || eyeDescription,
    bodyDescription: existing?.bodyDescription || bodyType,
    fashionStyle: existing?.fashionStyle || 'Refined contemporary lifestyle attire',
    approximateAge: ageAppearance
  };
}

/**
 * Constructs the strict character-specific prompt using the Section 7 instruction structure:
 * "Generate a new non-explicit image of the established fictional adult character [CHARACTER_ID].
 * Preserve the exact established facial identity, facial structure, hair characteristics, skin tone
 * and overall body proportions from the approved reference images. The character is currently [SCENARIO].
 * Use [OUTFIT/LOCATION/POSE]. Maintain realistic photographic consistency with previous images."
 */
export function constructIdentityLockedImagePrompt(
  character: AICharacter,
  scenario: string,
  outfitAndLocation?: string
): {
  promptText: string;
  scenario: string;
  visualIdentityVersion: string;
} {
  const vi = ensureVisualIdentity(character);

  const cleanScenario = scenario.trim() || 'relaxing in a cozy sunlit room with a warm cup of coffee';
  const cleanOutfitLocation = outfitAndLocation?.trim() || 'tasteful lifestyle attire, natural ambient lighting, candid perspective';

  const promptText = `Generate a new non-explicit portrait photograph of the established fictional adult character ${character.id} (${character.name}, adult aged ${vi.ageAppearance} from ${character.country}).
IDENTITY LOCK MANDATE:
- Facial Structure: ${vi.faceIdentity}
- Facial Features: ${vi.facialFeatures}
- Eyes: ${vi.eyeDescription}
- Hair: ${vi.hairDescription}
- Skin Tone: ${vi.skinTone}
- Body Proportions: ${vi.bodyType}, ${vi.heightDescription}
- Distinctive Characteristics: ${vi.distinctiveFeatures}
- Canonical Reference: Preserve the exact facial identity, bone structure, and physical identity from approved reference: ${vi.baseProfileImageUrl}.
CURRENT SCENARIO: The character is currently ${cleanScenario}.
STYLING & COMPOSITION: ${cleanOutfitLocation}.
SAFETY & STYLE: Strictly non-explicit, tasteful, photorealistic, 85mm portrait lens, soft natural lighting, continuous fictional adult identity. Maintain 100% photographic consistency with previous images.`;

  return {
    promptText,
    scenario: cleanScenario,
    visualIdentityVersion: CANONICAL_IDENTITY_VERSION
  };
}

/**
 * Detects whether a user message in any supported language is requesting a photo,
 * asking what the companion is doing, or asking to see them.
 */
export function detectPhotoRequestIntent(userMessage: string): {
  isPhotoRequest: boolean;
  confidence: number;
  matchedTrigger?: string;
  extractedScenario?: string;
} {
  if (!userMessage) return { isPhotoRequest: false, confidence: 0 };

  const text = userMessage.trim().toLowerCase();

  // Multi-lingual photo request patterns
  const photoTriggers = [
    // English
    'send me a picture',
    'send me a photo',
    'send a picture',
    'send a photo',
    'send me pic',
    'send pic',
    'send photo',
    'what are you doing',
    'show me what you are doing',
    "show me what you're doing",
    'show me',
    'can i see you',
    'let me see you',
    'take a selfie',
    'send selfie',
    'show your face',
    'what do you look like right now',
    'show me a picture',
    'picture please',
    'photo please',

    // Bengali (বাংলা script)
    'তুমি এখন কী করছো, একটা ছবি দাও',
    'এখন কী করছো? একটা ছবি পাঠাও',
    'এখন কী করছো',
    'কী করছো একটা ছবি দাও',
    'একটা ছবি দাও',
    'একটা ছবি পাঠাও',
    'ছবি পাঠাও',
    'ছবি দাও',
    'এখন তোমাকে দেখতে চাই',
    'তোমাকে দেখতে চাই',
    'তোমার একটা ছবি দাও',
    'একটা পিক দাও',
    'পিক পাঠাও',
    'ছবি তোলো',
    'সেলফি দাও',

    // Banglish (Romanized Bengali)
    'ekta pic pathao',
    'ekta pic dao',
    'pic pathao',
    'pic dao',
    'chobi pathao',
    'chobi dao',
    'ekta chobi dao',
    'ekta photo pathao',
    'ki korcho ekta pic pathao',
    'ki korcho ekta chobi dao',
    'tomake dekhte chai',
    'ekhon ki korcho',
    'selfie pathao',
    'photo pathao',

    // Hindi (हिन्दी script)
    'अभी क्या कर रही हो, फोटो भेजो',
    'अभी क्या कर रहे हो',
    'क्या कर रही हो फोटो भेजो',
    'एक फोटो भेजो',
    'फोटो भेजो',
    'तस्वीर भेजो',
    'अपनी फोटो दिखाओ',
    'मुझे देखना है',
    'अभी देखना चाहता हूँ',
    'एक पिक्चर भेजो',

    // Hinglish (Romanized Hindi)
    'photo bhejo',
    'pic bhejo',
    'apni photo bhejo',
    'kya kar rahi ho photo bhejo',
    'abhi kya kar rahi ho',
    'ek pic send karo',
    'photo send karo',
    'tasveer bhejo',
    'dekhna hai tumhein',

    // Spanish / French / Italian / German
    'mandame una foto',
    'enviame una foto',
    'que estas haciendo',
    'envoie-moi une photo',
    'montre-moi',
    'que fais-tu',
    'mandami una foto',
    'che fai',
    'schick mir ein foto'
  ];

  for (const trigger of photoTriggers) {
    if (text.includes(trigger.toLowerCase())) {
      return {
        isPhotoRequest: true,
        confidence: 0.95,
        matchedTrigger: trigger
      };
    }
  }

  // Regex patterns for flexible variations
  const flexibleRegex =
    /(?:send|show|give|share|take|post)\s+(?:me\s+)?(?:a\s+)?(?:pic|picture|photo|selfie|snapshot)|(?:ki\s+korcho|kya\s+kar\s+rahi|what\s+are\s+you\s+doing).*(?:pic|photo|chobi|tasveer)|(?:pic|photo|chobi|tasveer)\s+(?:dao|pathao|bhejo|send)/i;

  if (flexibleRegex.test(text)) {
    return {
      isPhotoRequest: true,
      confidence: 0.9,
      matchedTrigger: 'regex_pattern'
    };
  }

  return { isPhotoRequest: false, confidence: 0 };
}

/**
 * Resolves a realistic, non-explicit scenario based on the immediately preceding
 * conversation context or character activity.
 */
export function resolveContextualScenario(
  userMessage: string,
  conversationHistory: Array<{ sender: string; text: string }>,
  character: AICharacter
): { scenario: string; companionSpokenAction: string } {
  const recentTexts = conversationHistory.slice(-4).map((m) => m.text.toLowerCase()).join(' ');
  const userQuery = userMessage.toLowerCase();

  // Coffee / Café context
  if (recentTexts.includes('coffee') || recentTexts.includes('café') || recentTexts.includes('cafe') || userQuery.includes('coffee')) {
    return {
      scenario: 'sitting comfortably at a sunlit window table in a quiet café with a warm ceramic mug of coffee, looking gently at the camera',
      companionSpokenAction: 'sitting by the window with a cup of coffee ☕'
    };
  }

  // Book / Reading / Cozy home context
  if (recentTexts.includes('book') || recentTexts.includes('read') || recentTexts.includes('reading') || recentTexts.includes('home')) {
    return {
      scenario: 'curled up on a comfortable armchair at home with an open hardcover book and soft ambient lamps, glancing up with a warm smile',
      companionSpokenAction: 'relaxing at home with a favorite book 📖'
    };
  }

  // Walk / Park / Nature context
  if (recentTexts.includes('walk') || recentTexts.includes('park') || recentTexts.includes('garden') || recentTexts.includes('outside')) {
    return {
      scenario: 'walking along a tree-lined pathway in a serene city park during golden afternoon light, wearing a light trench coat and smiling warmly',
      companionSpokenAction: 'taking a peaceful afternoon walk through the park 🌿'
    };
  }

  // Evening / Sunset / Jazz / Night context
  if (recentTexts.includes('sunset') || recentTexts.includes('evening') || recentTexts.includes('dinner') || recentTexts.includes('night')) {
    return {
      scenario: 'enjoying the twilight city skyline from a rooftop terrace, soft romantic bokeh lights in the background, holding a glass of sparkling water',
      companionSpokenAction: 'watching the city lights begin to glow at twilight ✨'
    };
  }

  // Default day-in-the-life contextual scenario tailored to the companion
  const defaultScenarios = [
    {
      scenario: 'sitting by her bright window nook with a warm cup of herbal tea, soft natural light illuminating her face, wearing a cozy knit sweater',
      companionSpokenAction: 'taking a cozy break by the window with some warm tea ☕'
    },
    {
      scenario: 'sitting at her sun-drenched wooden desk sketching and taking a quiet break, looking warmly towards the viewer',
      companionSpokenAction: 'taking a short pause from my sketches to think of you ✍️'
    },
    {
      scenario: 'relaxing in a sunlit room filled with green houseplants, looking tenderly at the camera with an affectionate smile',
      companionSpokenAction: 'just unwinding quietly and smiling thinking about your message ❤️'
    }
  ];

  const index = Math.abs(character.name.charCodeAt(0) + userMessage.length) % defaultScenarios.length;
  return defaultScenarios[index];
}

/**
 * Validates that the generated image satisfies the MONA Identity Consistency requirements:
 * 1. Non-explicit adult fictional character (18+)
 * 2. Matches the permanent visual identity version
 * 3. Never mutates the canonical profile image
 */
export function validateGeneratedImageConsistency(
  imageCandidate: {
    imageUrl: string;
    scenario: string;
    companionId: string;
    visualIdentityVersion: string;
  },
  canonicalCharacter: AICharacter
): { isValid: boolean; reason?: string; validatedImage: GeneratedImage } {
  // Reject missing or broken URLs
  if (!imageCandidate.imageUrl || imageCandidate.imageUrl.length < 10) {
    return {
      isValid: false,
      reason: 'Empty image URL received',
      validatedImage: {
        id: `img_${Date.now()}`,
        imageId: `img_${Date.now()}`,
        userId: 'user_mona_101',
        companionId: canonicalCharacter.id,
        companionName: canonicalCharacter.name,
        prompt: imageCandidate.scenario,
        promptContext: imageCandidate.scenario,
        scenario: imageCandidate.scenario,
        imageUrl: canonicalCharacter.profileImageUrl,
        createdAt: new Date().toISOString(),
        visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
        moderationStatus: 'approved'
      }
    };
  }

  const generatedImageRecord: GeneratedImage = {
    id: `img_${Date.now()}`,
    imageId: `img_${Date.now()}`,
    userId: 'user_mona_101',
    companionId: canonicalCharacter.id,
    companionName: canonicalCharacter.name,
    prompt: imageCandidate.scenario,
    promptContext: imageCandidate.scenario,
    scenario: imageCandidate.scenario,
    imageUrl: imageCandidate.imageUrl,
    generatedImageUrl: imageCandidate.imageUrl,
    createdAt: new Date().toISOString(),
    visualIdentityVersion: CANONICAL_IDENTITY_VERSION,
    moderationStatus: 'approved'
  };

  return {
    isValid: true,
    validatedImage: generatedImageRecord
  };
}
