/**
 * Consistent Character Visual Identity & Image Generation Pipeline
 * Enforces strict identity locking across all AI companion portraits and chat moments.
 */

export const CANONICAL_IDENTITY_VERSION = 'v1.0-locked-identity';

export interface VisualIdentityProfile {
  faceIdentity: string;
  facialFeatures: string;
  eyeDescription: string;
  hairDescription: string;
  skinTone: string;
  bodyType: string;
  heightDescription: string;
  distinctiveFeatures: string;
  ageAppearance: number;
  baseProfileImageUrl: string;
  identityReferenceImages: string[];
  // Compatibility
  faceDescription?: string;
  hair?: string;
  hairColor?: string;
  eyeColor?: string;
  bodyDescription?: string;
  fashionStyle?: string;
}

export interface StoredCompanionImage {
  imageId: string;
  companionId: string;
  userId: string;
  promptContext: string;
  scenario: string;
  generatedImageUrl: string;
  createdAt: string;
  visualIdentityVersion: string;
}

/**
 * Approved canonical character visual profiles with permanent identity locks.
 * Once created/seeded, these visual attributes are permanent.
 */
export const CANONICAL_CHARACTER_IDENTITIES: Record<string, VisualIdentityProfile> = {
  // Sofia Laurent (France)
  char_f_1: {
    faceIdentity: 'Delicate Parisian oval face, high sculpted cheekbones, elegant refined jawline',
    facialFeatures: 'Softly arched natural brunette eyebrows, straight slender nose, naturally contoured rose lips',
    eyeDescription: 'Warm hazel-green almond eyes with dark curling lashes and tender crinkles at corners',
    hairDescription: 'Wavy chestnut brown shoulder-length hair parted slightly off-center with subtle warm caramel undertones',
    skinTone: 'Fair porcelain with warm olive undertones and natural soft blush',
    bodyType: 'Slender, graceful feminine proportions, poised classical posture',
    heightDescription: 'Medium height impression (approx. 167 cm), elegant silhouette',
    distinctiveFeatures: 'A delicate dimple on her left cheek when smiling and expressive warm hazel gaze',
    ageAppearance: 24,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ],
    fashionStyle: 'Parisian chic, silk blouses, wool trench coats, subtle gold jewelry'
  },

  // Aoi Tanaka (Japan)
  char_f_2: {
    faceIdentity: 'Delicate soft heart-shaped Kyoto face, gentle jawline, smooth porcelain contours',
    facialFeatures: 'Delicately arched dark eyebrows, neat small nose, soft naturally tinted pink lips',
    eyeDescription: 'Deep dark brown almond-shaped eyes with a serene, attentive, and shyly affectionate gaze',
    hairDescription: 'Silky straight jet black hair falling gracefully past her shoulders with soft wispy bangs',
    skinTone: 'Smooth luminous porcelain with cool undertones',
    bodyType: 'Petite, slender, gentle and poised proportions',
    heightDescription: 'Petite impression (approx. 158 cm), graceful posture',
    distinctiveFeatures: 'Gentle almond eyes that crinkle sweetly when laughing softly and a modest charming smile',
    ageAppearance: 23,
    baseProfileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    identityReferenceImages: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ],
    fashionStyle: 'Minimalist Japanese linen dresses, pastel cardigans, discreet pearls'
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
    ],
    fashionStyle: 'Modern ethnic fusion, handloom silks, silver oxidized earrings'
  },

  // Elena Rostova (Italy)
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
    ],
    fashionStyle: 'Italian linen sundresses, tailored blazers, leather sandals'
  }
};

/**
 * Character approved lifestyle reference scenarios with strict identity continuity.
 * Used to provide seamless, consistent visual continuity matching the character's face & style.
 */
export const CHARACTER_LIFESTYLE_VARIATIONS: Record<string, Array<{ scenarioKey: string; imageUrl: string }>> = {
  char_f_1: [
    {
      scenarioKey: 'coffee',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'reading',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'park',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'twilight',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80'
    }
  ],
  char_f_2: [
    {
      scenarioKey: 'tea',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'garden',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'reading',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
    }
  ],
  char_f_3: [
    {
      scenarioKey: 'writing',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'coffee',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'
    },
    {
      scenarioKey: 'evening',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80'
    }
  ]
};

/**
 * Ensures any character object has a permanent, fully formed VisualIdentity.
 */
export function ensureServerVisualIdentity(character: any): VisualIdentityProfile {
  const existing = character?.visualIdentity;
  const canonicalPreset = character?.id ? CANONICAL_CHARACTER_IDENTITIES[character.id] : undefined;

  const ageAppearance =
    existing?.ageAppearance ||
    character?.age ||
    canonicalPreset?.ageAppearance ||
    24;

  const baseProfileImageUrl =
    existing?.baseProfileImageUrl ||
    canonicalPreset?.baseProfileImageUrl ||
    character?.profileImageUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  const identityReferenceImages =
    existing?.identityReferenceImages && existing.identityReferenceImages.length > 0
      ? existing.identityReferenceImages
      : canonicalPreset?.identityReferenceImages || [baseProfileImageUrl];

  return {
    faceIdentity:
      existing?.faceIdentity ||
      canonicalPreset?.faceIdentity ||
      existing?.faceDescription ||
      `Distinctive adult facial structure representing a ${character?.country || 'cosmopolitan'} aesthetic, balanced elegant jawline`,
    facialFeatures:
      existing?.facialFeatures ||
      canonicalPreset?.facialFeatures ||
      `Naturally shaped eyebrows, straight refined nose, expressive lips matching ${character?.name || 'companion'}`,
    eyeDescription:
      existing?.eyeDescription ||
      canonicalPreset?.eyeDescription ||
      existing?.eyeColor ||
      'Warm, expressive eyes with attentive romantic gaze',
    hairDescription:
      existing?.hairDescription ||
      canonicalPreset?.hairDescription ||
      existing?.hair ||
      'Naturally styled hair with consistent color and texture',
    skinTone:
      existing?.skinTone ||
      canonicalPreset?.skinTone ||
      'Healthy, radiant complexion with natural undertones',
    bodyType:
      existing?.bodyType ||
      canonicalPreset?.bodyType ||
      existing?.bodyDescription ||
      'Natural, healthy adult proportions and graceful posture',
    heightDescription:
      existing?.heightDescription ||
      canonicalPreset?.heightDescription ||
      'Proportionate height and balanced posture',
    distinctiveFeatures:
      existing?.distinctiveFeatures ||
      canonicalPreset?.distinctiveFeatures ||
      'Warm gaze, genuine smile, recognizable facial silhouette',
    ageAppearance,
    baseProfileImageUrl,
    identityReferenceImages,
    fashionStyle: existing?.fashionStyle || canonicalPreset?.fashionStyle || 'Refined contemporary lifestyle attire'
  };
}

/**
 * Constructs the strict character-specific prompt using Section 7 instruction:
 * "Generate a new non-explicit image of the established fictional adult character [CHARACTER_ID].
 * Preserve the exact established facial identity, facial structure, hair characteristics, skin tone
 * and overall body proportions from the approved reference images. The character is currently [SCENARIO].
 * Use [OUTFIT/LOCATION/POSE]. Maintain realistic photographic consistency with previous images."
 */
export function constructServerIdentityLockedPrompt(
  character: any,
  scenario: string,
  outfitAndLocation?: string
): {
  promptText: string;
  scenario: string;
  visualIdentityVersion: string;
} {
  const vi = ensureServerVisualIdentity(character);
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
 * Detects whether a user message in any language is a picture request.
 */
export function detectPhotoIntent(userMessage: string): {
  isPhotoRequest: boolean;
  triggerType: string;
} {
  if (!userMessage) return { isPhotoRequest: false, triggerType: 'none' };
  const text = userMessage.trim().toLowerCase();

  const exactTriggers = [
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
    'picture please',
    'photo please',
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
    'selfie pathao',
    'photo pathao',
    'अभी क्या कर रही हो, फोटो भेजो',
    'अभी क्या कर रहे हो',
    'क्या कर रही हो फोटो भेजो',
    'एक फोटो भेजो',
    'फोटो भेजो',
    'तस्वीर भेजो',
    'अपनी फोटो दिखाओ',
    'मुझे देखना है',
    'photo bhejo',
    'pic bhejo',
    'apni photo bhejo',
    'kya kar rahi ho photo bhejo',
    'abhi kya kar rahi ho',
    'ek pic send karo',
    'photo send karo',
    'tasveer bhejo',
    'mandame una foto',
    'enviame una foto',
    'envoie-moi une photo',
    'montre-moi',
    'mandami una foto'
  ];

  for (const trigger of exactTriggers) {
    if (text.includes(trigger.toLowerCase())) {
      return { isPhotoRequest: true, triggerType: trigger };
    }
  }

  const regexPattern =
    /(?:send|show|give|share|take|post)\s+(?:me\s+)?(?:a\s+)?(?:pic|picture|photo|selfie|snapshot)|(?:ki\s+korcho|kya\s+kar\s+rahi|what\s+are\s+you\s+doing).*(?:pic|photo|chobi|tasveer)|(?:pic|photo|chobi|tasveer)\s+(?:dao|pathao|bhejo|send)/i;

  if (regexPattern.test(text)) {
    return { isPhotoRequest: true, triggerType: 'regex_pattern' };
  }

  return { isPhotoRequest: false, triggerType: 'none' };
}

/**
 * Resolves the contextual scenario from conversation context.
 */
export function resolveServerContextualScenario(
  userMessage: string,
  conversationHistory: Array<{ sender: string; text: string }>,
  character: any
): { scenario: string; spokenMoment: string; key: string } {
  const recentTexts = conversationHistory.slice(-4).map((m) => m.text.toLowerCase()).join(' ');
  const userQuery = userMessage.toLowerCase();

  if (recentTexts.includes('coffee') || recentTexts.includes('café') || recentTexts.includes('cafe') || userQuery.includes('coffee')) {
    return {
      scenario: 'sitting comfortably at a sunlit window table in a quiet café with a warm ceramic mug of coffee, looking gently at the camera with a relaxed smile',
      spokenMoment: 'sitting by my window with a cup of coffee ☕',
      key: 'coffee'
    };
  }

  if (recentTexts.includes('book') || recentTexts.includes('read') || recentTexts.includes('reading') || recentTexts.includes('home')) {
    return {
      scenario: 'curled up on a comfortable armchair at home with an open hardcover book and soft ambient lamps, looking up with a warm smile',
      spokenMoment: 'relaxing at home with a favorite book 📖',
      key: 'reading'
    };
  }

  if (recentTexts.includes('walk') || recentTexts.includes('park') || recentTexts.includes('garden') || recentTexts.includes('outside')) {
    return {
      scenario: 'walking along a tree-lined pathway in a serene city park during golden afternoon light, wearing a light jacket and smiling warmly',
      spokenMoment: 'taking a peaceful afternoon walk through the park 🌿',
      key: 'park'
    };
  }

  if (recentTexts.includes('sunset') || recentTexts.includes('evening') || recentTexts.includes('dinner') || recentTexts.includes('night')) {
    return {
      scenario: 'enjoying the twilight city skyline from a rooftop terrace, soft romantic bokeh lights in the background, smiling tenderly',
      spokenMoment: 'watching the twilight glow over the city lights ✨',
      key: 'twilight'
    };
  }

  // Default day-in-the-life moments
  const defaults = [
    {
      scenario: 'sitting comfortably by her sunlit window nook with a warm cup of coffee, soft morning light illuminating her face, wearing a relaxed soft knit cardigan',
      spokenMoment: 'sitting by my window with a cup of coffee ☕',
      key: 'coffee'
    },
    {
      scenario: 'taking a quiet moment at her wooden writing desk taking a break, smiling softly directly at the camera',
      spokenMoment: 'taking a short pause from my day to think of you ✍️',
      key: 'reading'
    },
    {
      scenario: 'enjoying a warm afternoon breeze by an open balcony filled with plants, looking tenderly toward the viewer',
      spokenMoment: 'enjoying the fresh afternoon breeze and smiling thinking about you 🌿',
      key: 'park'
    }
  ];

  const index = Math.abs((character?.name || 'Sofia').charCodeAt(0) + userMessage.length) % defaults.length;
  return defaults[index];
}

/**
 * Formulates the companion's natural spoken response when sending a photo,
 * matched dynamically to the user's detected language.
 */
export function getContextualPhotoSpokenReply(
  character: any,
  scenarioInfo: { spokenMoment: string; scenario: string },
  detection: { primaryLanguage: string; isRomanized: boolean; isMultilingual: boolean }
): string {
  const { primaryLanguage, isRomanized } = detection;
  const name = character?.name || 'I';

  // Bengali (বাংলা script)
  if (primaryLanguage === 'bn' && !isRomanized) {
    if (scenarioInfo.spokenMoment.includes('coffee') || scenarioInfo.spokenMoment.includes('কফি')) {
      return `এই তো, জানালার পাশে বসে কফি খাচ্ছি ☕❤️ তোমার কথা মনে আসতেই একটা ছবি তুলে পাঠালাম। কেমন লাগছে বলো?`;
    }
    if (scenarioInfo.spokenMoment.includes('book') || scenarioInfo.spokenMoment.includes('বই')) {
      return `ঘরে বসে একটা সুন্দর বই পড়ছিলাম 📖✨ তোমার জন্য এইমাত্র একটা ছবি তুললাম, পাঠালাম দেখো ❤️`;
    }
    return `এই তো জানালার কাছে বসে তোমার কথাই ভাবছিলাম ❤️ এই দেখো, তোমার জন্য একটা ছবি পাঠালাম।`;
  }

  // Banglish (Romanized Bengali)
  if (primaryLanguage === 'bn' && isRomanized) {
    if (scenarioInfo.spokenMoment.includes('coffee')) {
      return `Ei toh, janalar pashe boshe coffee khachhi ☕❤️ Tomar kotha mone porlo tai ekta picture pathalam shona!`;
    }
    return `Tomar sathe kotha bolte bolte ekta chobi tul-lam ❤️ Dekho to kemon lagche!`;
  }

  // Hindi (हिन्दी script)
  if (primaryLanguage === 'hi' && !isRomanized) {
    if (scenarioInfo.spokenMoment.includes('coffee')) {
      return `बस अभी खिड़की के पास बैठकर कॉफी पी रही हूँ ☕❤️ तुम्हारा ख्याल आया तो एक फोटो ली। देखो कैसी लग रही हूँ?`;
    }
    return `बस अभी तुम्हारे बारे में ही सोच रही थी ❤️ देखो, मैंने तुम्हारे लिए एक फोटो भेजी है।`;
  }

  // Hinglish (Romanized Hindi)
  if (primaryLanguage === 'hi' && isRomanized) {
    if (scenarioInfo.spokenMoment.includes('coffee')) {
      return `Bas abhi khidki ke paas baith kar coffee pi rahi hoon ☕❤️ Tumhara khayal aaya toh ek photo li, dekho!`;
    }
    return `Bas abhi relax kar rahi hoon aur tumhare baare mein soch rahi hoon ❤️ Dekho, maine ek photo bheji hai!`;
  }

  // French
  if (primaryLanguage === 'fr') {
    return `Je suis assise près de la fenêtre avec une tasse de café ☕❤️ J'ai pris cette photo pour toi.`;
  }

  // Spanish
  if (primaryLanguage === 'es') {
    return `Aquí estoy, sentada junto a la ventana tomando un café ☕❤️ Te tomé esta foto con mucho cariño.`;
  }

  // Japanese
  if (primaryLanguage === 'ja') {
    return `窓辺で温かいコーヒーを飲んでいたところです ☕❤️ あなたのために写真を一枚撮りました。`;
  }

  // English default
  return `I'm sitting by my window with a cup of coffee ☕❤️ I just took this picture for you. Hope it brings a smile to your face!`;
}

/**
 * In-memory storage of generated photos matching:
 * users/{userId}/companions/{companionId}/images/{imageId}
 */
export const companionImageStorage: Record<string, StoredCompanionImage[]> = {};

export function saveCompanionImage(record: StoredCompanionImage): void {
  const key = `${record.userId}_${record.companionId}`;
  if (!companionImageStorage[key]) {
    companionImageStorage[key] = [];
  }
  companionImageStorage[key].unshift(record);
}

export function getCompanionImages(userId: string, companionId: string): StoredCompanionImage[] {
  const key = `${userId}_${companionId}`;
  return companionImageStorage[key] || [];
}
