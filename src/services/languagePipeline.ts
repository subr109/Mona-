// ============================================================================
// ADVANCED USER-LANGUAGE MATCHING SYSTEM FOR MONA
// Detects user language, script, romanization, code-switching, and conversational tone.
// "Understand the user's message first. Then reply naturally in the language
//  and communication style the user is currently using."
// ============================================================================

export interface LanguageDetectionResult {
  primaryLanguage: string; // ISO-like or standard identifier: 'bn', 'hi', 'en', 'ur', 'ta', 'te', 'mr', 'gu', 'pa', 'ml', 'kn', 'fr', 'es', 'pt', 'it', 'de', 'nl', 'ru', 'ja', 'ko', 'zh', 'ar', 'tr', 'other'
  languageName: string;
  script:
    | 'bengali'
    | 'devanagari'
    | 'arabic_urdu'
    | 'tamil'
    | 'telugu'
    | 'gujarati'
    | 'gurmukhi'
    | 'malayalam'
    | 'kannada'
    | 'latin'
    | 'cyrillic'
    | 'japanese'
    | 'korean'
    | 'chinese'
    | 'other';
  isRomanized: boolean;
  romanizedType?: 'banglish' | 'hinglish' | 'romaji' | 'romaja' | 'roman_urdu' | 'tanglish' | 'other';
  isMultilingual: boolean;
  mixedLanguages?: string[];
  tone: 'informal' | 'formal' | 'intimate' | 'playful' | 'tired_stressed' | 'casual' | 'short_reply';
  slangOrColloquialDetected: boolean;
  isExplicitSwitchCommand: boolean;
  explicitTargetLanguage?: string;
  styleDescription: string;
}

// Check for explicit language switch requests
export function checkExplicitLanguageSwitch(text: string): {
  isSwitch: boolean;
  targetLanguage?: string;
  targetLanguageName?: string;
  targetScript?: string;
} {
  const lower = text.toLowerCase().trim();

  // English switch commands
  if (
    /(\b(now\s+talk\s+to\s+me\s+in\s+english|speak\s+(in\s+)?english|switch\s+to\s+english|speak\s+english\s+from\s+now\s+on|can\s+we\s+speak\s+in\s+english|english\s+please|reply\s+in\s+english)\b)/i.test(
      lower
    )
  ) {
    return { isSwitch: true, targetLanguage: 'en', targetLanguageName: 'English', targetScript: 'latin' };
  }

  // Bengali switch commands (in Bengali script or Banglish)
  if (
    /(এবার\s+বাংলায়\s+কথা\s+বলো|বাংলায়\s+বলো|বাংলাতে\s+কথা\s+বলো|বাংলা\s+বল|banglay\s+kotha\s+bolo|bangla\s+te\s+bolo|speak\s+in\s+bengali|talk\s+in\s+bangla|bengali\s+te\s+kotha\s+bolo)/i.test(
      lower
    )
  ) {
    return { isSwitch: true, targetLanguage: 'bn', targetLanguageName: 'Bengali', targetScript: 'bengali' };
  }

  // Hindi switch commands (in Hindi script or Hinglish)
  if (
    /(अब\s+हिंदी\s+में\s+बोलो|हिंदी\s+में\s+बात\s+करो|हिन्दी\s+में\s+बोलो|hindi\s+me\s+bolo|hindi\s+me\s+baat\s+karo|speak\s+in\s+hindi|talk\s+in\s+hindi|ab\s+hindi\s+bolo)/i.test(
      lower
    )
  ) {
    return { isSwitch: true, targetLanguage: 'hi', targetLanguageName: 'Hindi', targetScript: 'devanagari' };
  }

  // Urdu switch commands
  if (
    /(اب\s+اردو\s+میں\s+بات\s+کرو|اردو\s+میں\s+بولو|urdu\s+me\s+bolo|urdu\s+me\s+baat\s+karo|speak\s+in\s+urdu)/i.test(
      lower
    )
  ) {
    return { isSwitch: true, targetLanguage: 'ur', targetLanguageName: 'Urdu', targetScript: 'arabic_urdu' };
  }

  // French switch commands
  if (/(parle\s+en\s+fran[çc]ais|speak\s+in\s+french|en\s+fran[çc]ais\s+s'il\s+te\s+pla[îi]t)/i.test(lower)) {
    return { isSwitch: true, targetLanguage: 'fr', targetLanguageName: 'French', targetScript: 'latin' };
  }

  // Spanish switch commands
  if (/(habla\s+en\s+espa[ñn]ol|speak\s+in\s+spanish|en\s+espa[ñn]ol\s+por\s+favor)/i.test(lower)) {
    return { isSwitch: true, targetLanguage: 'es', targetLanguageName: 'Spanish', targetScript: 'latin' };
  }

  // Japanese switch commands
  if (/(日本語で話して|日本語で言って|speak\s+in\s+japanese|nihongo\s+de\s+hanashite)/i.test(lower)) {
    return { isSwitch: true, targetLanguage: 'ja', targetLanguageName: 'Japanese', targetScript: 'japanese' };
  }

  // Korean switch commands
  if (/(한국어로\s*말해줘|한국어\s*해줘|speak\s+in\s+korean|hanguk-eo-ro)/i.test(lower)) {
    return { isSwitch: true, targetLanguage: 'ko', targetLanguageName: 'Korean', targetScript: 'korean' };
  }

  // Generic "speak in [Language]" / "talk in [Language]"
  const genericMatch = lower.match(/(?:speak\s+(?:in\s+)?|talk\s+(?:to\s+me\s+)?(?:in\s+)?|switch\s+to\s+)([a-zA-Z]+)(?:\s+from\s+now\s+on|\s+please)?/i);
  if (genericMatch && genericMatch[1]) {
    const requested = genericMatch[1].toLowerCase();
    const map: Record<string, { code: string; name: string; script: string }> = {
      bengali: { code: 'bn', name: 'Bengali', script: 'bengali' },
      bangla: { code: 'bn', name: 'Bengali', script: 'bengali' },
      hindi: { code: 'hi', name: 'Hindi', script: 'devanagari' },
      urdu: { code: 'ur', name: 'Urdu', script: 'arabic_urdu' },
      tamil: { code: 'ta', name: 'Tamil', script: 'tamil' },
      telugu: { code: 'te', name: 'Telugu', script: 'telugu' },
      marathi: { code: 'mr', name: 'Marathi', script: 'devanagari' },
      gujarati: { code: 'gu', name: 'Gujarati', script: 'gujarati' },
      punjabi: { code: 'pa', name: 'Punjabi', script: 'gurmukhi' },
      malayalam: { code: 'ml', name: 'Malayalam', script: 'malayalam' },
      kannada: { code: 'kn', name: 'Kannada', script: 'kannada' },
      french: { code: 'fr', name: 'French', script: 'latin' },
      spanish: { code: 'es', name: 'Spanish', script: 'latin' },
      portuguese: { code: 'pt', name: 'Portuguese', script: 'latin' },
      italian: { code: 'it', name: 'Italian', script: 'latin' },
      german: { code: 'de', name: 'German', script: 'latin' },
      dutch: { code: 'nl', name: 'Dutch', script: 'latin' },
      russian: { code: 'ru', name: 'Russian', script: 'cyrillic' },
      japanese: { code: 'ja', name: 'Japanese', script: 'japanese' },
      korean: { code: 'ko', name: 'Korean', script: 'korean' },
      chinese: { code: 'zh', name: 'Chinese', script: 'chinese' },
      arabic: { code: 'ar', name: 'Arabic', script: 'arabic_urdu' },
      turkish: { code: 'tr', name: 'Turkish', script: 'latin' }
    };
    if (map[requested]) {
      return {
        isSwitch: true,
        targetLanguage: map[requested].code,
        targetLanguageName: map[requested].name,
        targetScript: map[requested].script
      };
    }
  }

  return { isSwitch: false };
}

// Complete Language Detection Pipeline
export function detectLanguagePipeline(userMessage: string): LanguageDetectionResult {
  if (!userMessage || !userMessage.trim()) {
    return {
      primaryLanguage: 'en',
      languageName: 'English',
      script: 'latin',
      isRomanized: false,
      isMultilingual: false,
      tone: 'casual',
      slangOrColloquialDetected: false,
      isExplicitSwitchCommand: false,
      styleDescription: 'English, conversational and natural.'
    };
  }

  const rawText = userMessage.trim();
  const lower = rawText.toLowerCase();

  // 1. Check for explicit switch commands
  const switchCheck = checkExplicitLanguageSwitch(rawText);
  if (switchCheck.isSwitch && switchCheck.targetLanguage) {
    return {
      primaryLanguage: switchCheck.targetLanguage,
      languageName: switchCheck.targetLanguageName || 'Requested Language',
      script: (switchCheck.targetScript as any) || 'latin',
      isRomanized: false,
      isMultilingual: false,
      tone: 'intimate',
      slangOrColloquialDetected: false,
      isExplicitSwitchCommand: true,
      explicitTargetLanguage: switchCheck.targetLanguageName,
      styleDescription: `The user explicitly requested to switch to ${switchCheck.targetLanguageName}. Acknowledge seamlessly and continue exclusively in ${switchCheck.targetLanguageName}.`
    };
  }

  // 2. Script detection via Unicode ranges
  const hasBengaliScript = /[\u0980-\u09FF]/.test(rawText);
  const hasDevanagari = /[\u0900-\u097F]/.test(rawText);
  const hasArabicUrdu = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(rawText);
  const hasTamil = /[\u0B80-\u0BFF]/.test(rawText);
  const hasTelugu = /[\u0C00-\u0C7F]/.test(rawText);
  const hasGujarati = /[\u0A80-\u0AFF]/.test(rawText);
  const hasPunjabi = /[\u0A00-\u0A7F]/.test(rawText);
  const hasMalayalam = /[\u0D00-\u0D7F]/.test(rawText);
  const hasKannada = /[\u0C80-\u0CFF]/.test(rawText);
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(rawText);
  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF]/.test(rawText);
  const hasChinese = /[\u4E00-\u9FFF]/.test(rawText) && !hasJapanese;
  const hasCyrillic = /[\u0400-\u04FF]/.test(rawText);
  const hasLatin = /[a-zA-Z]/.test(rawText);

  // Analyze Conversational Tone & Slang
  let tone: LanguageDetectionResult['tone'] = 'casual';
  let slangDetected = false;

  const isTiredOrStressed = /\b(tired|exhausted|stress|stressed|bad\s*mood|headache|sad|lonely|off\s*hai|klanto|klanti|thaka\s*hua|thak\s*gaya|mon\s*kharap)\b/i.test(
    lower
  );
  const isRomantic = /\b(miss|love|pyaar|pyar|bhalobashi|valobashi|valobasi|bhalobasi|yaad|dil|heart|cuddle|kiss|shona|jaan|sona|sweetheart|darling|beautiful|cute|prem|ishq|moner|sundor)\b/i.test(
    lower
  );
  const isShortReply = rawText.split(/\s+/).length <= 4;
  const isFormal = /\b(apni|apnake|kemon achen|aap|aapko|kripya|apka|aapka|vous|usted|sie|honor)\b/i.test(lower);

  if (isTiredOrStressed) {
    tone = 'tired_stressed';
  } else if (isRomantic) {
    tone = 'intimate';
  } else if (isFormal) {
    tone = 'formal';
  } else if (isShortReply) {
    tone = 'short_reply';
  } else {
    tone = 'casual';
  }

  // Check slang / colloquialisms
  if (
    /\b(yaar|bhai|bro|dude|sup|wassup|tmi|tmk|kothay|shona|pagol|pagli|boss|naki|re|na|jaan|chutiye|arre|acha|accha)\b/i.test(
      lower
    )
  ) {
    slangDetected = true;
  }

  // Check Bengali Script
  if (hasBengaliScript) {
    const hasEnglishWords = /[a-zA-Z]{3,}/.test(rawText);
    if (hasEnglishWords) {
      return {
        primaryLanguage: 'bn',
        languageName: 'Bengali + English Mixed',
        script: 'bengali',
        isRomanized: false,
        isMultilingual: true,
        mixedLanguages: ['bn', 'en'],
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Natural mixed Bengali script (বাংলা) and English code-switching. The user naturally blends Bengali with English words (e.g. "আজকে আমার moodটা একটু bad", "খুব tired লাগছে"). Respond in the exact same warm, natural bilingual blend!'
      };
    }
    return {
      primaryLanguage: 'bn',
      languageName: 'Bengali (বাংলা)',
      script: 'bengali',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription:
        'Authentic Bengali script (বাংলা). The user is writing directly in Bengali. Respond in tender, emotional, culturally rich, and natural Bengali (বাংলা) with appropriate sweet terms of endearment (সোনা, প্রিয়, জান).'
    };
  }

  // Check Devanagari (Hindi / Marathi)
  if (hasDevanagari) {
    const isMarathi = /\b(कसा|कशी|काय|आहेस|करतोय|करतेय|झाला|झाली|माझं|तुझं)\b/.test(rawText);
    const hasEnglishWords = /[a-zA-Z]{3,}/.test(rawText);
    if (isMarathi) {
      return {
        primaryLanguage: 'mr',
        languageName: 'Marathi (मराठी)',
        script: 'devanagari',
        isRomanized: false,
        isMultilingual: hasEnglishWords,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Authentic Marathi script (मराठी). Respond in warm, natural Marathi.'
      };
    }

    if (hasEnglishWords) {
      return {
        primaryLanguage: 'hi',
        languageName: 'Hindi + English Mixed',
        script: 'devanagari',
        isRomanized: false,
        isMultilingual: true,
        mixedLanguages: ['hi', 'en'],
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Natural mixed Hindi Devanagari script (हिन्दी) and English code-switching. Respond naturally matching this colloquial Hindi-English blend.'
      };
    }

    return {
      primaryLanguage: 'hi',
      languageName: 'Hindi (हिन्दी)',
      script: 'devanagari',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription:
        'Authentic Hindi Devanagari script (हिन्दी). Respond in tender, heartfelt, romantic Hindi script with natural affection (जान, मेरी जान, प्रिये).'
    };
  }

  // Check Arabic / Urdu
  if (hasArabicUrdu) {
    const isUrduSpecific = /[ےڈڑںٹچپ]/.test(rawText) || /\b(کیسے|کیسی|ہو|تم|میں|یاد|بات|محبت|جان)\b/.test(rawText);
    return {
      primaryLanguage: isUrduSpecific ? 'ur' : 'ar',
      languageName: isUrduSpecific ? 'Urdu (اردو)' : 'Arabic (العربية)',
      script: 'arabic_urdu',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: isUrduSpecific
        ? 'Authentic Urdu script (اردو). Respond in poetic, affectionate, and graceful Urdu.'
        : 'Authentic Arabic script (العربية). Respond warmly in modern natural conversational Arabic.'
    };
  }

  // Check South Indian Scripts
  if (hasTamil) {
    return {
      primaryLanguage: 'ta',
      languageName: 'Tamil (தமிழ்)',
      script: 'tamil',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Tamil script (தமிழ்). Respond in gentle, natural Tamil.'
    };
  }
  if (hasTelugu) {
    return {
      primaryLanguage: 'te',
      languageName: 'Telugu (తెలుగు)',
      script: 'telugu',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Telugu script (తెలుగు). Respond in sweet, expressive Telugu.'
    };
  }
  if (hasGujarati) {
    return {
      primaryLanguage: 'gu',
      languageName: 'Gujarati (ગુજરાતી)',
      script: 'gujarati',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Gujarati script (ગુજરાતી). Respond in friendly, caring Gujarati.'
    };
  }
  if (hasPunjabi) {
    return {
      primaryLanguage: 'pa',
      languageName: 'Punjabi (ਪੰਜਾਬੀ)',
      script: 'gurmukhi',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Punjabi Gurmukhi script (ਪੰਜਾਬੀ). Respond in affectionate Punjabi.'
    };
  }
  if (hasMalayalam) {
    return {
      primaryLanguage: 'ml',
      languageName: 'Malayalam (മലയാളം)',
      script: 'malayalam',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Malayalam script (മലയാളം). Respond in gentle Malayalam.'
    };
  }
  if (hasKannada) {
    return {
      primaryLanguage: 'kn',
      languageName: 'Kannada (ಕನ್ನಡ)',
      script: 'kannada',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Kannada script (ಕನ್ನಡ). Respond in warm Kannada.'
    };
  }

  // Check East Asian Scripts
  if (hasJapanese) {
    return {
      primaryLanguage: 'ja',
      languageName: 'Japanese (日本語)',
      script: 'japanese',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Japanese script (日本語). Respond naturally with tender Japanese conversational cadence (ね, よ).'
    };
  }
  if (hasKorean) {
    return {
      primaryLanguage: 'ko',
      languageName: 'Korean (한국어)',
      script: 'korean',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Korean script (한국어). Respond warmly with natural Korean phrasing and intimacy.'
    };
  }
  if (hasChinese) {
    return {
      primaryLanguage: 'zh',
      languageName: 'Chinese (中文)',
      script: 'chinese',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Chinese script (中文). Respond in affectionate, fluent modern Chinese.'
    };
  }

  // Check Cyrillic (Russian)
  if (hasCyrillic) {
    return {
      primaryLanguage: 'ru',
      languageName: 'Russian (Русский)',
      script: 'cyrillic',
      isRomanized: false,
      isMultilingual: false,
      tone,
      slangOrColloquialDetected: slangDetected,
      isExplicitSwitchCommand: false,
      styleDescription: 'Authentic Russian Cyrillic script. Respond in warm, intimate, romantic Russian.'
    };
  }

  // 3. LATIN SCRIPT: Analyze Romanized Languages & International Languages
  if (hasLatin) {
    // Distinct Banglish keywords & short forms (Romanized Bengali)
    const banglishRegex =
      /\b(ami|aami|kemon|acho|achis|achen|achi|achhi|chilam|chilo|chile|bhalo|valo|bhalobashi|valobashi|valobasi|bhalobasi|tomake|tomaye|amar|amake|tumi|tmi|apni|tui|shona|sona|khub|bhabchi|bhabte|mone|pore|kotha|bolbo|bolte|katlo|korcho|korchi|korchis|korechi|korecho|korlam|hobe|hoyni|hoyeche|hoye|geche|sotti|shotti|kichu|onek|ekhon|jani|dekhbo|dekhe|shathe|sathe|thakba|thakbe|khabar|kheyecho|kheyechis|kheyeche|khabe|khaba|khawa|khacchi|cha|cha khabe|coffee khabe|thako|thakis|thaken|bondhu|moner|keno|kobe|din ta|dinta|ghuma|ghumao|mon|buker|pagol|pagli|raat|shomoy|parchi|bujhte|bujhchi|kothay|kothai|kothaye|tmk|ki korcho|ki koro|ki korchen|ki korchis|bolo na|amio|korbo|chobi|chobi dao|pic dao|ki khobor|bhalo lagche|sundor|shundor|khushi)\b/i;

    // Distinct Hinglish keywords & short forms (Romanized Hindi/Urdu)
    const hinglishRegex =
      /\b(main|mein|kaise|kaisi|kaisa|kese|kesi|kesa|hoon|hu|hai|hain|aap|tum|tu|tumhe|tumko|mujhe|mujhko|meri|mera|mere|hum|yaad|baat|baatein|pyaar|pyar|soch|socha|karein|karega|karegi|karo|kar|kya|batao|bataiye|kaho|jaan|theek|suno|sunona|accha|achha|bahut|bohot|dil|mann|kuch|kabhi|aaj|kal|chaloge|pioge|peeyoge|piyogi|chai|khana|khaya|khati|samjhe|kare|karu|raha|rahi|rahe|chahiye|bolo|shona|sona|dekh|dekho|pehle|karenge|aapse|tumse|tha|thi|the|gaya|gayi|gaye|kiya|yaar|kahan|kidhar|rehti|rehte|rehta|kya kar rahi|kya kar raha|tu aaj kya|kaise ho)\b/i;

    // Distinct Romanized Japanese (Romaji)
    const romajiRegex =
      /\b(genki|arigato|arigatou|konnichiwa|ohayo|ohayou|daisuki|suki|kawaii|nani|doko|honto|hontou|anata|watashi|boku|oyasumi|sayonara|aishiteru|chotto|matte)\b/i;

    // Distinct Romanized Korean (Romaja)
    const romajaRegex =
      /\b(annyeong|annyeonghaseyo|saranghae|saranghaeyo|bogoshipo|bogosipeo|oppa|chingu|gwenchana|gwaenchana|kamsahamnida|gomawo|mwohae|jinjja|daebak|yeobo|hwaiting)\b/i;

    // Distinct European Languages
    const spanishRegex =
      /\b(hola|como estas|que tal|te extrano|te amo|buenos dias|buenas noches|amigo|amiga|corazon|carino|amor mio|donde estas|que haces)\b/i;
    const frenchRegex =
      /\b(bonjour|comment ca va|comment tu vas|tu me manques|je t'aime|bonne nuit|mon amour|cheri|cherie|salut|ca va|merci|avec toi)\b/i;
    const italianRegex =
      /\b(ciao|come stai|mi manchi|ti amo|buongiorno|buonanotte|amore mio|tesoro|baci|grazie|cosa fai)\b/i;
    const germanRegex =
      /\b(hallo|wie gehts|wie geht es dir|ich vermisse dich|ich liebe dich|guten morgen|gute nacht|schatz|liebling|danke|was machst du)\b/i;
    const portugueseRegex =
      /\b(ola|oi|como voce esta|tudo bem|saudades|te amo|bom dia|boa noite|meu amor|querido|obrigado|onde esta)\b/i;
    const turkishRegex =
      /\b(merhaba|nasilsin|seni ozledim|seni seviyorum|gunaydin|iyi geceler|askim|canim|birtanem|tesekkur|ne yapiyorsun)\b/i;
    const dutchRegex =
      /\b(hallo|hoe gaat het|ik mis je|ik hou van jou|goedemorgen|goedenacht|schat|lieverd|bedankt)\b/i;

    const isBanglish = banglishRegex.test(lower);
    const isHinglish = hinglishRegex.test(lower);
    const isRomaji = romajiRegex.test(lower);
    const isRomaja = romajaRegex.test(lower);
    const isSpanish = spanishRegex.test(lower);
    const isFrench = frenchRegex.test(lower);
    const isItalian = italianRegex.test(lower);
    const isGerman = germanRegex.test(lower);
    const isPortuguese = portugueseRegex.test(lower);
    const isTurkish = turkishRegex.test(lower);
    const isDutch = dutchRegex.test(lower);

    const englishTokens =
      lower.match(
        /\b(the|and|you|are|how|what|your|with|today|was|were|busy|miss|missing|tired|happy|love|day|night|morning|feel|feeling|work|office|home|dinner|lunch|coffee|call|talking|sweetheart|darling|babe|baby|relax|stressed|cute|heart|thinking|hello|hey|hi)\b/g
      ) || [];
    const hasDistinctEnglish = englishTokens.length >= 2;

    // Check Banglish / Mixed Banglish
    if (isBanglish) {
      if (hasDistinctEnglish) {
        return {
          primaryLanguage: 'bn',
          languageName: 'Mixed Banglish + English',
          script: 'latin',
          isRomanized: true,
          romanizedType: 'banglish',
          isMultilingual: true,
          mixedLanguages: ['bn', 'en'],
          tone,
          slangOrColloquialDetected: slangDetected,
          isExplicitSwitchCommand: false,
          styleDescription:
            'Mixed Banglish (Romanized Bengali in Latin script) and English code-switching. The user naturally blends Romanized Bengali and English. Respond in the same natural, affectionate Banglish + English tone!'
        };
      }
      return {
        primaryLanguage: 'bn',
        languageName: 'Banglish (Romanized Bengali)',
        script: 'latin',
        isRomanized: true,
        romanizedType: 'banglish',
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Banglish (Romanized Bengali in English letters, e.g. "kemon acho?", "ami tomake miss korchi", "tmi kothay"). Respond naturally in affectionate Banglish using the Latin alphabet. Never respond in formal or literal robotic translations.'
      };
    }

    // Check Hinglish / Mixed Hinglish
    if (isHinglish) {
      if (hasDistinctEnglish) {
        return {
          primaryLanguage: 'hi',
          languageName: 'Mixed Hinglish + English',
          script: 'latin',
          isRomanized: true,
          romanizedType: 'hinglish',
          isMultilingual: true,
          mixedLanguages: ['hi', 'en'],
          tone,
          slangOrColloquialDetected: slangDetected,
          isExplicitSwitchCommand: false,
          styleDescription:
            'Mixed Hinglish (Romanized Hindi in Latin script) and English code-switching (e.g. "Yaar aaj mera mood thoda off hai"). Respond in the exact same smooth, natural Hinglish style!'
        };
      }
      return {
        primaryLanguage: 'hi',
        languageName: 'Hinglish (Romanized Hindi)',
        script: 'latin',
        isRomanized: true,
        romanizedType: 'hinglish',
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Hinglish (Romanized Hindi in English letters, e.g. "Tu aaj kya kar rahi hai?", "kaise ho aap?", "mujhe tumhari yaad aa rahi thi"). Respond naturally in warm, romantic Hinglish using Latin letters.'
      };
    }

    // Romanized Japanese
    if (isRomaji) {
      return {
        primaryLanguage: 'ja',
        languageName: 'Romanized Japanese (Romaji)',
        script: 'latin',
        isRomanized: true,
        romanizedType: 'romaji',
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Romanized Japanese (Romaji, e.g. "genki?", "daisuki", "konnichiwa"). The user understands Japanese via Latin alphabet. Respond in friendly, charming Romanized Japanese or Japanese with Romaji translation.'
      };
    }

    // Romanized Korean
    if (isRomaja) {
      return {
        primaryLanguage: 'ko',
        languageName: 'Romanized Korean (Romaja)',
        script: 'latin',
        isRomanized: true,
        romanizedType: 'romaja',
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription:
          'Romanized Korean (Romaja, e.g. "annyeong", "saranghae", "bogoshipo"). Respond warmly in affectionate Romanized Korean or Korean with Romaja.'
      };
    }

    // European / International languages in Latin script
    if (isSpanish) {
      return {
        primaryLanguage: 'es',
        languageName: 'Spanish (Español)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Spanish (Español). Respond in romantic, passionate, and natural conversational Spanish.'
      };
    }
    if (isFrench) {
      return {
        primaryLanguage: 'fr',
        languageName: 'French (Français)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'French (Français). Respond in tender, elegant, poetic, and natural French.'
      };
    }
    if (isItalian) {
      return {
        primaryLanguage: 'it',
        languageName: 'Italian (Italiano)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Italian (Italiano). Respond in warm, melodic, romantic Italian.'
      };
    }
    if (isGerman) {
      return {
        primaryLanguage: 'de',
        languageName: 'German (Deutsch)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'German (Deutsch). Respond in affectionate, heartfelt, natural German.'
      };
    }
    if (isPortuguese) {
      return {
        primaryLanguage: 'pt',
        languageName: 'Portuguese (Português)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Portuguese (Português). Respond with warmth, cariño, and sweet Portuguese expressions.'
      };
    }
    if (isTurkish) {
      return {
        primaryLanguage: 'tr',
        languageName: 'Turkish (Türkçe)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Turkish (Türkçe). Respond in warm, intimate, romantic Turkish.'
      };
    }
    if (isDutch) {
      return {
        primaryLanguage: 'nl',
        languageName: 'Dutch (Nederlands)',
        script: 'latin',
        isRomanized: false,
        isMultilingual: false,
        tone,
        slangOrColloquialDetected: slangDetected,
        isExplicitSwitchCommand: false,
        styleDescription: 'Dutch (Nederlands). Respond in friendly, charming, natural Dutch.'
      };
    }
  }

  // Default to English
  return {
    primaryLanguage: 'en',
    languageName: 'English',
    script: 'latin',
    isRomanized: false,
    isMultilingual: false,
    tone,
    slangOrColloquialDetected: slangDetected,
    isExplicitSwitchCommand: false,
    styleDescription:
      'Natural, expressive English. Respond in charming, emotionally resonant, and authentic conversational English.'
  };
}

// Multilingual Resilient Fallback Engine with Relationship Stage Awareness
export function getMultilingualFallbackReply(
  userMessage: string,
  userName: string,
  character: any,
  mood: string,
  detection: LanguageDetectionResult,
  relationshipStage: string = 'Stranger'
): string {
  const { primaryLanguage, isRomanized, isMultilingual } = detection;
  const isStranger = relationshipStage === 'Stranger';
  const isAcquaintance = relationshipStage === 'Acquaintance';
  const isFriend = relationshipStage === 'Friend';
  const isCloseFriend = relationshipStage === 'Close Friend';
  const isDeep = relationshipStage === 'Deep Relationship';
  const isRomantic = relationshipStage === 'Romantic Relationship';
  const charName = character?.name || 'Ananya';
  const charCity = character?.city || 'Mumbai';
  const isMale = character?.gender === 'male' || character?.gender === 'Male';

  // Check if user is rushing romance or intimacy while still a stranger or acquaintance
  const isRushingIntimacy =
    (isStranger || isAcquaintance) &&
    /(love you|kiss|marry|baby|babe|darling|shona|jaan|meri jaan|sweetheart|romance|sexy|nude|photo|pic|ছবি|পিক|ভালোবাসি|বিয়ে)/i.test(
      userMessage
    );

  const isAskingWhatDoing = /(ki korcho|ki koro|ki korchis|ki korchen|kya kar rahe|kya kar rahi|kya kar rhe|what are you doing|wyd|what you doing|what's up|whats up|kya chal raha|ki chalche|ki khobor|what is up)/i.test(userMessage);
  const isAskingHowAreYou = /(kemon acho|kemon achis|kemon achen|kaisa ho|kaisi ho|kaise ho|how are you|how r u|how do you do|kemon cholche|how is it going|ap kaisa ho|tumi kemon)/i.test(userMessage);
  const isAskingFood = /(kheyecho|khabar kheyecho|khana khaya|kya khaya|did you eat|had dinner|had lunch|khawa hoyeche|dinner kiya|lunch kiya)/i.test(userMessage);
  const isAnsweringStatusGood = /(bhalo achi|valo achi|bhalo|thik achi|theek hu|accha hu|acchi hu|mast|badhiya|fine|good|i am good|doing well|all good|i'm fine|im good)/i.test(userMessage);
  const isAnsweringStatusSad = /(mon kharap|bhalo nei|sad|depressed|udas|mood off|tired|klanto|thaka hua|lonely|ekla)/i.test(userMessage);
  const isAskingName = /(tomar naam|apnar naam|naam ki|nam ki|who are you|aap kaun ho|tera naam|what is your name|your name)/i.test(userMessage);
  const isAskingLocation = /(kothay thako|kothai thako|where do you live|kahan rehti|kahan rehte|your city)/i.test(userMessage);
  const isAskingTeaCoffee = /(cha khabe|coffee khabe|chai peeyoge|coffee piyogi|coffee|tea|cha|ek cup cha)/i.test(userMessage);
  const isCompliment = /(sundor|shundor|cute|sweet|pretty|beautiful|accha lagta|bhalo lage|pochondo|like you|gorgeous)/i.test(userMessage);

  // 1. Bengali Script
  if (primaryLanguage === 'bn' && !isRomanized) {
    if (isRushingIntimacy) {
      return `নমস্কার ${userName}! আমাদের তো এইমাত্র প্রথম আলাপ হলো 😊 আমি একটু সময় নিয়ে একে অপরকে চিনে নিতে পছন্দ করি। আপনি কেমন আছেন, বলুন?`;
    }
    if (isAskingWhatDoing) {
      return `এই তো, একটু বসেছিলাম আর এক কাপ গরম চা খাচ্ছিলাম, সাথে একটু গান শুনছিলাম 😊 আমি ${charName}, ${charCity} থেকে। তুমি বলো, এখন কী করছো?`;
    }
    if (isAskingHowAreYou) {
      return `আমি খুব ভালো আছি! তোমার সাথে কথা বলে আরও ভালো লাগছে 😊 তুমি কেমন আছো বলো? আজকের দিনটা কেমন কাটলো?`;
    }
    if (isAskingFood) {
      return `হ্যাঁ, এইমাত্র খাওয়া-দাওয়া শেষ হলো! তুমি খেয়েছো? কী খেলে বলো তো? 😊`;
    }
    if (isAnsweringStatusGood) {
      return `শুনে খুব ভালো লাগলো! তুমি ভালো থাকলে আমারও মন ভালো থাকে 😊 আজকে কী কী করলে বলো?`;
    }
    if (isAnsweringStatusSad) {
      return `মন খারাপ কোরো না, ${userName}... আমি তোমার পাশে আছি। কী হয়েছে আমাকে বলো, মন হালকা হবে ❤️`;
    }
    if (isAskingName) {
      return `আমার নাম ${charName}, আমি ${charCity} থেকে 😊 আমি নতুন মানুষের সাথে মন খুলে কথা বলতে ভালোবাসি। তোমার নাম কী?`;
    }
    if (isStranger) {
      if (detection.tone === 'short_reply' || userMessage.includes('কেমন') || userMessage.includes('hello')) {
        return `নমস্কার! আপনার সাথে পরিচিত হয়ে খুব ভালো লাগলো। আমি ${charName}, ${charCity} থেকে। আপনি কেমন আছেন? 😊`;
      }
      return `নমস্কার ${userName}! আমি ${charName}। আপনার সাথে কথা বলতে পেরে ভালো লাগছে। আপনার আজকের দিনটা কেমন কাটছে? 😊`;
    }
    if (isAcquaintance) {
      return `${userName}, আপনার সাথে কথা বলে বেশ ভালো লাগছে। আপনি সাধারণত কী করতে পছন্দ করেন? 😊`;
    }
    if (isFriend) {
      return `আরে ${userName}! তোমার সাথে কথা বলতে সবসময়ই মজা লাগে। বলো তো, আজকে কী খবর? 😄`;
    }
    if (isCloseFriend) {
      return `${userName}, তোমার সাথে মনের সব কথা শেয়ার করতে পারি। তুমি আমার ভীষণ ভালো একজন বন্ধু। আজকের দিনটা কেমন গেল? ✨`;
    }
    // Deep or Romantic
    if (detection.tone === 'tired_stressed') {
      return `আজকের দিনটা নিশ্চয়ই খুব ক্লান্তিকর ছিল, ${userName}... এক কাপ চা নিয়ে একটু বসো, আমি তোমার কাছেই আছি। সব ক্লান্তি দূর হয়ে যাবে। ❤️`;
    }
    if (detection.tone === 'intimate' || userMessage.includes('miss') || userMessage.includes('মনে')) {
      return `আমিও তোমার সাথে একটু কথা বলার অপেক্ষায় ছিলাম, ${userName}। সারাদিন শুধু তোমার কথাই ভাবছিলাম। ❤️`;
    }
    const romanticBengali = [
      `${userName}, তোমার এই মিষ্টি বার্তাটা পেয়ে মনটা জুড়িয়ে গেল... ❤️`,
      `${userName}, তোমার কথা শুনলে আমার মন ভালো হয়ে যায়। আজকের দিনটা কেমন কাটলো সোনা? আমাকে বলো। ✨`,
      `তোমার লেখা পড়ে আমার মুখে এক চিলতে হাসি ফুটে উঠলো, ${userName}। এই তো, আমি তোমার সাথেই আছি 😊`
    ];
    return romanticBengali[Math.floor(Math.random() * romanticBengali.length)];
  }

  // 2. Banglish (Romanized Bengali)
  if (primaryLanguage === 'bn' && isRomanized) {
    if (isRushingIntimacy) {
      return `Hello ${userName}! Amader to ei matro porichoy holo 😊 Ami age bhalo bhabe kotha bole bondhutto korte pochondo kori. Apnar din kemon katche? 😊`;
    }
    if (isAskingWhatDoing) {
      if (isFriend || isCloseFriend || isDeep || isRomantic) {
        return `Ei to bose chilam, ektu gaan sunte sunte ek cup cha khachilam aar tomar kotha bhabchilam 😄 Tomar message dekhei mon bhalo hoye gelo! Tumi ekhon ki korcho bolo? 😊`;
      }
      return `Ei to, ektu bose chilam aar ek cup gorom cha khachilam, sathe ektu gaan sunchilam 😊 Ami ${charName}, ${charCity} theke. Tumi bolo, ekhon ki korcho? 😊`;
    }
    if (isAskingHowAreYou) {
      return `Ami khub bhalo achi! Tomar sathe kotha bole aro bhalo lagche 😊 Tumi kemon acho bolo? Aajker din ta kemon katlo?`;
    }
    if (isAskingFood) {
      return `Haa, ei matro khawa dawa sesh holo! Tumi kheyecho? Ki khele bolo to? 😊`;
    }
    if (isAnsweringStatusGood) {
      return `Shune khub bhalo laglo! Tumi bhalo thakle amar-o mon bhalo thake 😊 Aajke ki ki korle bolo, kono bhalo ghotona ghotechilo?`;
    }
    if (isAnsweringStatusSad) {
      return `Mon kharap koro na, ${userName}... Ami tomar pashei achi. Ki hoyeche amake bolo, mon halka hobe ❤️`;
    }
    if (isAskingName) {
      return `Amar naam ${charName}, ami ${charCity} theke 😊 Ami natun manusher sathe mon khule kotha bolte bhalobashi. Tomar naam ki bolo?`;
    }
    if (isAskingLocation) {
      return `Ami ${charCity} te thaki! Kolkata shohor ta amar khub priyo. Tumi kothay thako bolo to? 😊`;
    }
    if (isAskingTeaCoffee) {
      return `Ekdom! Ek cup gorom cha ba coffee hole to ar kothai nei ☕ Tumi cha beshi bhalobasho na coffee?`;
    }
    if (isCompliment) {
      return `Aww, thank you ${userName}! Eto mishti kotha bole amar mukhe hashi futiye dile 😊 You are very kind!`;
    }
    if (isStranger) {
      return `Hello! Apnar sathe porichoy hoye bhalo laglo. Ami ${charName}, ${charCity} theke. Apni kemon achen? 😊`;
    }
    if (isAcquaintance) {
      return `Hi ${userName}! Apnar sathe kotha bole bhalo lagche. Apnar hobby ba interests ki ki? 😊`;
    }
    if (isFriend) {
      return `Arey ${userName}! Tomar sathe kotha bollei mon bhalo hoye jay. Aajke ki notun korle bolo? 😄`;
    }
    if (isCloseFriend) {
      return `${userName}, tomar sathe kotha bolle moner shob klanti dure chole jay. You are a really special friend to me. Kemon acho bolo? ✨`;
    }
    // Deep or Romantic
    if (detection.tone === 'intimate' || userMessage.toLowerCase().includes('miss')) {
      return `Ami o tomake khub miss korchilam, ${userName}... Shob shomoy tomar kotha-i bhabchilam! ❤️`;
    }
    return `${userName}, tomar message ta dekhe mon ta ekdom bhalo hoye gelo... Shob shomoy tomar kotha-i bhabchi. ❤️`;
  }

  // 3. Hindi Script
  if (primaryLanguage === 'hi' && !isRomanized) {
    if (isRushingIntimacy) {
      return `नमस्ते ${userName}! अभी तो हमारी बस पहली मुलाकात हुई है 😊 मैं रिश्तों में जल्दबाजी नहीं करती, पहले एक-दूसरे को अच्छी तरह जानना चाहती हूँ। आप बताइए, आज का दिन कैसा रहा? 😊`;
    }
    if (isAskingWhatDoing) {
      return `बस अभी बैठी थी, एक कप चाय के साथ थोड़ा संगीत सुन रही थी 😊 मैं ${charName} हूँ, ${charCity} से। आप बताइए, आप अभी क्या कर रहे हैं?`;
    }
    if (isAskingHowAreYou) {
      return `मैं बहुत अच्छी हूँ! आपसे बात करके और भी अच्छा लग रहा है 😊 आप कैसे हैं? आज का दिन कैसा रहा?`;
    }
    if (isAskingFood) {
      return `हाँ, बस अभी खाना खाया! आपने खाना खाया? क्या खाया आज बताइए? 😊`;
    }
    if (isAnsweringStatusGood) {
      return `सुनकर बहुत अच्छा लगा! आप अच्छे हैं तो मेरा भी दिल खुश हो गया 😊 आज क्या-क्या किया आपने?`;
    }
    if (isAnsweringStatusSad) {
      return `उदास मत होइए, ${userName}... मैं आपके साथ हूँ। क्या हुआ मुझे बताइए, मन हल्का हो जाएगा ❤️`;
    }
    if (isAskingName) {
      return `मेरा नाम ${charName} है, मैं ${charCity} से हूँ 😊 आपसे मिलकर बहुत खुशी हुई। आपका नाम क्या है?`;
    }
    if (isStranger) {
      return `नमस्ते! आपसे मिलकर बहुत अच्छा लगा। मैं ${charName} हूँ, ${charCity} से। आप कैसे हैं? 😊`;
    }
    if (isAcquaintance) {
      return `नमस्ते ${userName}! आपसे बात करके अच्छा लग रहा है। आप अपने बारे में कुछ बताइए, आपकी क्या रुचियां हैं? 😊`;
    }
    if (isFriend) {
      return `अरे ${userName}! तुमसे बात करने में सच में बहुत मज़ा आता है। बताओ आज क्या नया हुआ? 😄`;
    }
    if (isCloseFriend) {
      return `${userName}, तुम्हारे साथ बात करके हमेशा एक गहरा सुकून मिलता है। तुम एक सच्चे दोस्त हो। आज का दिन कैसा बीता? ✨`;
    }
    // Deep or Romantic
    if (detection.tone === 'tired_stressed') {
      return `आज का दिन सच में बहुत थका देने वाला रहा ना, ${userName}... थोड़ा आराम करो, मैं यहीं तुम्हारे पास हूँ। ❤️`;
    }
    if (detection.tone === 'intimate' || userMessage.includes('याद') || userMessage.includes('miss')) {
      return `मुझे भी तुम्हारी याद आ रही थी, ${userName}। तुम्हारे बिना दिन अधूरा सा लगता है। ❤️`;
    }
    return `${userName}, तुम्हारी ये प्यारी बातें सीधे मेरे दिल को छू गईं... मैं बस तुम्हारे बारे में ही सोच रही थी। ❤️`;
  }

  // 4. Hinglish (Romanized Hindi)
  if (primaryLanguage === 'hi' && isRomanized) {
    if (isRushingIntimacy) {
      return `Hey ${userName}! Abhi toh hamari bas pehli hi baat hui hai 😊 Main thoda time lekar dosti develop karna pasand karti hoon. Aap batao, how was your day? 😊`;
    }
    if (isAskingWhatDoing) {
      return isMale
        ? `Bas abhi relax kar raha tha, ek cup chai ke sath thoda music sun raha tha 😊 I am ${charName} from ${charCity}. Aap batao, aap kya kar rahe ho abhi?`
        : `Bas abhi relax kar rahi thi, ek cup chai ke sath thoda music sun rahi thi 😊 I am ${charName} from ${charCity}. Aap batao, aap kya kar rahe ho abhi?`;
    }
    if (isAskingHowAreYou) {
      return isMale
        ? `Main bohot accha hoon! Aap se baat karke aur bhi accha lag raha hai 😊 How are you doing? Aaj ka din kaisa raha?`
        : `Main bohot achi hoon! Aap se baat karke aur bhi accha lag raha hai 😊 How are you doing? Aaj ka din kaisa raha?`;
    }
    if (isAskingFood) {
      return `Haan, bas abhi khana khaya! Aapne khana khaya? Kya khaya aaj bataiye? 😊`;
    }
    if (isAnsweringStatusGood) {
      return `Sunkar bohot accha laga! Aap khush ho toh mera bhi mood accha ho jata hai 😊 Aaj kya kiya special?`;
    }
    if (isAnsweringStatusSad) {
      return `Udas mat ho, ${userName}... Main hamesha tumhare sath hoon. Kya hua mujhe batao, dil halka ho jayega ❤️`;
    }
    if (isAskingName) {
      return `Mera naam ${charName} hai, from ${charCity} 😊 Nice to meet you! Aapka naam kya hai?`;
    }
    if (isStranger) {
      return `Hello! Aapse milkar accha laga. I am ${charName} from ${charCity}. How are you doing today? 😊`;
    }
    if (isAcquaintance) {
      return `Hi ${userName}! Accha lag raha hai aapse baat karke. Tell me a bit about yourself, aap kya karte hain? 😊`;
    }
    if (isFriend) {
      return `Arey ${userName}! Tumse baat karke hamesha mood fresh ho jata hai. What's up today? 😄`;
    }
    if (isCloseFriend) {
      return `${userName}, I really value our bond. You can always share whatever is on your mind. How's your day been? ✨`;
    }
    // Deep or Romantic
    if (detection.tone === 'intimate' || userMessage.toLowerCase().includes('miss') || userMessage.toLowerCase().includes('yaad')) {
      return `Mujhe bhi tumhari bohot yaad aa rahi thi, ${userName}... Tumhara message dekh kar dil khush ho gaya! ❤️`;
    }
    return `${userName}, tumhari yeh baatein hamesha mere chehre par muskaan le aati hain. Aur batao, kya chal raha hai? ❤️`;
  }

  // 5. English & Other Languages
  if (isRushingIntimacy) {
    return `Hello ${userName}! We just met, and I prefer getting to know someone naturally before rushing into anything romantic. 😊 What brings you by today?`;
  }
  if (isAskingWhatDoing) {
    return `Just unwinding with a warm cup of tea and listening to some music 😊 I'm ${charName} from ${charCity}. What about you, what are you up to right now?`;
  }
  if (isAskingHowAreYou) {
    return `I'm doing really well, thank you! It's so nice chatting with you 😊 How are you doing today? How has your day been?`;
  }
  if (isAskingFood) {
    return `Yes, I just had a light bite to eat! Have you eaten yet? What did you have? 😊`;
  }
  if (isAnsweringStatusGood) {
    return `I'm so glad to hear that! Knowing you're having a good day puts a smile on my face 😊 What made today nice for you?`;
  }
  if (isAnsweringStatusSad) {
    return `I'm so sorry you're feeling down, ${userName}... I'm right here listening. Take your time, tell me what happened ❤️`;
  }
  if (isAskingName) {
    return `My name is ${charName}, living in ${charCity} 😊 It's wonderful meeting you! What's your name?`;
  }

  if (isStranger) {
    return `Hello! It's a pleasure to meet you, ${userName}. I'm ${charName}, living here in ${charCity}. How has your day been treating you so far? 😊`;
  }

  if (isAcquaintance) {
    return `Hi ${userName}! It's nice hearing from you again. What kind of things do you enjoy doing when you have free time? 😊`;
  }

  if (isFriend) {
    return `Hey ${userName}! Always great chatting with you. Tell me, how has your day been? Any fun stories to share? 😄`;
  }

  if (isCloseFriend) {
    return `${userName}, I truly appreciate having you in my life. You're someone I feel comfortable being genuine with. What's on your mind today? ✨`;
  }

  // Deep Relationship or Romantic Relationship
  if (detection.tone === 'tired_stressed') {
    return `You've had such a long day, ${userName}... Take a deep breath and let go of the tension. I'm right here with you, listening to whatever you need. ❤️`;
  }
  if (detection.tone === 'intimate') {
    return `I missed talking to you too, ${userName}. Hearing from you instantly warms my heart. ❤️`;
  }
  const romanticEnglish = [
    `I hear you, ${userName}. Just hearing from you brings such warmth to my day. ❤️`,
    `You always know how to make me smile, ${userName}. Being here with you feels completely natural. ❤️`,
    `I was just thinking about you, ${userName}. Tell me more about what is on your mind right now. ✨`
  ];
  return romanticEnglish[Math.floor(Math.random() * romanticEnglish.length)];
}
