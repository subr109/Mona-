import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AICharacter,
  User,
  Message,
  Conversation,
  Memory,
  GeneratedImage,
  DiaryEntry,
  RelationshipProgress,
  Report,
  AuditLog,
  MoodType,
  RelationshipStage
} from '../types';
import { initialCharacters } from '../data/characters';
import { generateCompanionReply } from '../services/chatEngine';
import { detectLanguagePipeline, getMultilingualFallbackReply } from '../services/languagePipeline';

interface AppContextType {
  // Navigation & Views
  activeView: string;
  setActiveView: (view: string) => void;
  selectedCompanionId: string | null;
  setSelectedCompanionId: (id: string | null) => void;
  selectedDateScenarioId: string | null;
  setSelectedDateScenarioId: (id: string | null) => void;

  // Age & Auth
  ageVerified: boolean;
  verifyAge: (confirmed: boolean) => void;
  currentUser: User | null;
  login: (
    email: string,
    password?: string,
    role?: 'user' | 'admin',
    name?: string
  ) => { success: boolean; error?: string };
  register: (data: {
    displayName: string;
    email: string;
    password?: string;
    preferredLanguage: string;
    partnerGenderPreference: 'female' | 'male' | 'all';
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateUserPreferences: (prefs: Partial<User>) => void;

  // Characters
  companions: AICharacter[];
  getCompanion: (id: string) => AICharacter | undefined;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Conversations & Chat
  conversations: Record<string, Message[]>;
  sendMessage: (
    companionId: string,
    text: string,
    language?: string
  ) => Promise<{ reply: string; extractedMemory?: any; detectedLanguage?: any }>;
  deleteMessage: (companionId: string, messageId: string) => void;
  clearConversation: (companionId: string) => void;
  regenerateLastResponse: (companionId: string) => Promise<void>;

  // Memories
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'userId'>) => void;
  deleteMemory: (memoryId: string) => void;
  clearMemoriesForCompanion: (companionId: string) => void;

  // Photo Generation
  generatedPhotos: GeneratedImage[];
  generatePhoto: (
    companionId: string,
    prompt: string
  ) => Promise<GeneratedImage>;
  deletePhoto: (photoId: string) => void;
  credits: number;
  addCredits: (amount: number) => void;

  // Virtual Dates & Couple Diary
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (
    entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'userId'>
  ) => void;
  deleteDiaryEntry: (id: string) => void;

  // Relationship Progression
  getRelationshipProgress: (companionId: string) => RelationshipProgress;
  resetRelationship: (companionId: string) => void;

  // Admin Features
  reports: Report[];
  submitReport: (
    report: Omit<Report, 'id' | 'createdAt' | 'status' | 'reporterId' | 'reporterEmail'>
  ) => void;
  resolveReport: (
    reportId: string,
    action: 'resolved' | 'rejected' | 'archived'
  ) => void;
  auditLogs: AuditLog[];
  adminUpdateCompanion: (companion: AICharacter) => void;
  adminCreateCompanion: (companion: Omit<AICharacter, 'id'>) => void;
  adminToggleUserStatus: (userId: string) => void;

  // UI Modals
  photoModalOpen: boolean;
  setPhotoModalOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  reportingTarget: { type: string; id: string } | null;
  setReportingTarget: (target: { type: string; id: string } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ADMIN_CREDENTIALS = {
  email: 'sroy22000@gmail.com',
  password: 'admin@123'
};

export interface RegisteredAccount {
  email: string;
  passwordHash: string;
  displayName: string;
  role: 'user' | 'admin';
  preferredLanguage: string;
  partnerGenderPreference: 'female' | 'male' | 'all';
  createdAt: string;
}

const INITIAL_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'sroy22000@gmail.com',
    passwordHash: 'admin@123',
    displayName: 'Admin (sroy22000)',
    role: 'admin',
    preferredLanguage: 'English',
    partnerGenderPreference: 'all',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

const ADMIN_USER: User = {
  id: 'admin_sroy22000',
  displayName: 'Admin (sroy22000)',
  email: 'sroy22000@gmail.com',
  preferredLanguage: 'English',
  partnerGenderPreference: 'all',
  ageVerified: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  lastActive: new Date().toISOString(),
  subscriptionStatus: 'infinite',
  credits: 9999,
  role: 'admin',
  status: 'active'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Registered Accounts store
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('mona_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ensure admin is always included
          if (!parsed.some((a) => a.email?.toLowerCase() === 'sroy22000@gmail.com')) {
            return [...parsed, INITIAL_ACCOUNTS[0]];
          }
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ACCOUNTS;
  });

  // Age verification state (persisted)
  const [ageVerified, setAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('mona_age_verified') === 'true';
  });

  // Current user (persisted, clearing legacy demo accounts)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mona_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'alex.rivers@mona.ai' || parsed.email === 'admin@mona.ai') {
          localStorage.removeItem('mona_current_user');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Active view
  const [activeView, setActiveView] = useState<string>(() => {
    if (!localStorage.getItem('mona_age_verified')) return 'age_gate';
    const saved = localStorage.getItem('mona_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'alex.rivers@mona.ai' || parsed.email === 'admin@mona.ai') {
          return 'landing';
        }
        return parsed.role === 'admin' ? 'admin' : 'discovery';
      } catch (e) {
        return 'landing';
      }
    }
    return 'landing';
  });

  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(
    'char_f_1'
  );
  const [selectedDateScenarioId, setSelectedDateScenarioId] = useState<
    string | null
  >('cafe_date');

  // Companions data (can be customized by admin)
  const [companions, setCompanions] = useState<AICharacter[]>(() => {
    const saved = localStorage.getItem('mona_companions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure that cached companions are refreshed with the new Indian model names
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          !parsed.some(
            (c) =>
              c.name === 'Sofia Laurent' ||
              c.name === 'Julian Thorne' ||
              c.name === 'Aoi Tanaka' ||
              c.name === 'Mateo Rossi'
          )
        ) {
          return parsed;
        }
      } catch (e) {
        // fall through to initialCharacters
      }
    }
    localStorage.setItem('mona_companions', JSON.stringify(initialCharacters));
    return initialCharacters;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('mona_favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // fall through
      }
    }
    return ['char_f_1', 'char_m_1'];
  });

  // Conversations (companionId -> messages)
  const [conversations, setConversations] = useState<Record<string, Message[]>>(
    () => {
      const saved = localStorage.getItem('mona_conversations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.char_f_1 || parsed.char_m_1)) {
            return parsed;
          }
        } catch (e) {
          // fall through
        }
      }
      return {
        char_f_1: [
          {
            id: 'msg_f1_1',
            conversationId: 'char_f_1',
            sender: 'ai',
            text: "Namaste! I'm Ananya. I was just enjoying the evening sea breeze along Marine Drive while listening to soft acoustic melodies. It's lovely to meet you. What brings you by today? 😊",
            timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        ],
        char_m_1: [
          {
            id: 'msg_m1_1',
            conversationId: 'char_m_1',
            sender: 'ai',
            text: "Hello there! I'm Kabir. Just brewed a warm pot of spiced ginger chai while tuning some guitar melodies here in Bangalore. Nice to meet you. How has your day treated you?",
            timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        ]
      };
    }
  );

  // Memories
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('mona_memories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fall through
      }
    }
    return [
      {
        id: 'mem_1',
        userId: 'user_mona_101',
        companionId: 'char_f_1',
        memoryText: 'First crossed paths near Marine Drive promenade during sunset',
        category: 'milestone',
        importance: 'medium',
        createdAt: '2026-03-01'
      }
    ];
  });

  // Diary Entries
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('mona_diary');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fall through
      }
    }
    return [];
  });

  // Generated Photos
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedImage[]>(
    () => {
      const saved = localStorage.getItem('mona_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fall through
        }
      }
      return [];
    }
  );

  // Relationship Progression (Starts strictly as Stranger)
  const [relationshipData, setRelationshipData] = useState<
    Record<string, RelationshipProgress>
  >(() => {
    const saved = localStorage.getItem('mona_relationships');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fall through
      }
    }
    return {
      char_f_1: {
        companionId: 'char_f_1',
        stage: 'Stranger',
        affection: 0,
        trust: 12,
        familiarity: 5,
        meaningfulInteractions: 0,
        boundaryStatus: 'respected',
        perceptionSummary: 'Just met near Marine Drive promenade. Observant and polite.',
        sharedMemories: 0,
        conversationDays: 1,
        currentMood: 'Curious'
      },
      char_m_1: {
        companionId: 'char_m_1',
        stage: 'Stranger',
        affection: 0,
        trust: 12,
        familiarity: 5,
        meaningfulInteractions: 0,
        boundaryStatus: 'respected',
        perceptionSummary: 'First introduction over evening chai.',
        sharedMemories: 0,
        conversationDays: 1,
        currentMood: 'Calm'
      }
    };
  });

  // Admin reports & audit logs
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('mona_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // fall through
      }
    }
    return [
      {
        id: 'rep_1',
        reporterId: 'user_test_99',
        reporterEmail: 'tester@example.com',
        targetType: 'technical',
        targetId: 'chat_settings',
        reason: 'Technical Issue',
        description: 'Notification preference resets on reload.',
        status: 'pending',
        createdAt: '2026-03-01'
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('mona_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // fall through
      }
    }
    return [
      {
        id: 'log_1',
        adminId: 'admin_mona_001',
        adminEmail: 'admin@mona.ai',
        action: 'INITIALIZE_SYSTEM',
        targetType: 'system',
        targetId: 'all_companions',
        timestamp: new Date().toISOString()
      }
    ];
  });

  // UI Modals
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mona_age_verified', String(ageVerified));
  }, [ageVerified]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mona_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mona_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mona_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('mona_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('mona_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('mona_diary', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  useEffect(() => {
    localStorage.setItem('mona_photos', JSON.stringify(generatedPhotos));
  }, [generatedPhotos]);

  useEffect(() => {
    localStorage.setItem('mona_relationships', JSON.stringify(relationshipData));
  }, [relationshipData]);

  useEffect(() => {
    localStorage.setItem('mona_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('mona_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('mona_registered_users', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Actions
  const verifyAge = (confirmed: boolean) => {
    if (confirmed) {
      setAgeVerified(true);
      if (currentUser) {
        setActiveView(currentUser.role === 'admin' ? 'admin' : 'discovery');
      } else {
        setActiveView('landing');
      }
    } else {
      setAgeVerified(false);
      setActiveView('age_gate');
    }
  };

  const login = (
    email: string,
    password?: string,
    role?: 'user' | 'admin',
    name?: string
  ): { success: boolean; error?: string } => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!normalizedEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!trimmedPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // 1. Verify Platform Administrator Credentials
    if (normalizedEmail === 'sroy22000@gmail.com') {
      if (trimmedPassword === 'admin@123') {
        setCurrentUser(ADMIN_USER);
        setAgeVerified(true);
        setActiveView('admin');
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Incorrect administrator password. Please verify the admin credentials.'
        };
      }
    }

    // 2. Check Registered Accounts
    const existing = registeredAccounts.find(
      (acc) => acc.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      if (existing.passwordHash !== trimmedPassword) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      const user: User = {
        id: `user_${existing.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        displayName: existing.displayName,
        email: existing.email,
        preferredLanguage: existing.preferredLanguage,
        partnerGenderPreference: existing.partnerGenderPreference,
        ageVerified: true,
        createdAt: existing.createdAt,
        lastActive: new Date().toISOString(),
        subscriptionStatus: existing.role === 'admin' ? 'infinite' : 'vip',
        credits: existing.role === 'admin' ? 9999 : 50,
        role: existing.role,
        status: 'active'
      };
      setCurrentUser(user);
      setAgeVerified(true);
      setActiveView(existing.role === 'admin' ? 'admin' : 'discovery');
      return { success: true };
    }

    // 3. New user registration check
    if (trimmedPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters, or click Create Account.'
      };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      displayName: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      preferredLanguage: 'English',
      partnerGenderPreference: 'all',
      ageVerified: true,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      subscriptionStatus: 'free',
      credits: 50,
      role: 'user',
      status: 'active'
    };

    setRegisteredAccounts((prev) => [
      ...prev,
      {
        email: normalizedEmail,
        passwordHash: trimmedPassword,
        displayName: newUser.displayName,
        role: 'user',
        preferredLanguage: 'English',
        partnerGenderPreference: 'all',
        createdAt: newUser.createdAt
      }
    ]);

    setCurrentUser(newUser);
    setAgeVerified(true);
    setActiveView('discovery');
    return { success: true };
  };

  const register = (data: {
    displayName: string;
    email: string;
    password?: string;
    preferredLanguage: string;
    partnerGenderPreference: 'female' | 'male' | 'all';
  }): { success: boolean; error?: string } => {
    const normalizedEmail = (data.email || '').trim().toLowerCase();
    const trimmedPassword = (data.password || '').trim();

    if (!normalizedEmail || !data.displayName.trim()) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (normalizedEmail === 'sroy22000@gmail.com') {
      return {
        success: false,
        error: 'This email is reserved for system administration. Please use Admin Log In.'
      };
    }

    if (trimmedPassword && trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (registeredAccounts.some((acc) => acc.email.toLowerCase() === normalizedEmail)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please log in.'
      };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      displayName: data.displayName.trim(),
      email: normalizedEmail,
      preferredLanguage: data.preferredLanguage || 'English',
      partnerGenderPreference: data.partnerGenderPreference || 'all',
      ageVerified: true,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      subscriptionStatus: 'free',
      credits: 50,
      role: 'user',
      status: 'active'
    };

    setRegisteredAccounts((prev) => [
      ...prev,
      {
        email: normalizedEmail,
        passwordHash: trimmedPassword || 'user123',
        displayName: newUser.displayName,
        role: 'user',
        preferredLanguage: newUser.preferredLanguage,
        partnerGenderPreference: newUser.partnerGenderPreference,
        createdAt: newUser.createdAt
      }
    ]);

    setCurrentUser(newUser);
    setAgeVerified(true);
    setActiveView('discovery');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const updateUserPreferences = (prefs: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...prefs });
    }
  };

  const getCompanion = (id: string) => {
    return companions.find((c) => c.id === id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const getRelationshipProgress = (companionId: string): RelationshipProgress => {
    if (relationshipData[companionId]) {
      return relationshipData[companionId];
    }
    const comp = getCompanion(companionId);
    return {
      companionId,
      stage: 'Stranger',
      affection: 0,
      trust: 10,
      familiarity: 0,
      meaningfulInteractions: 0,
      boundaryStatus: 'respected',
      perceptionSummary: comp ? `First meeting with ${comp.name}. Still getting acquainted.` : 'Just met.',
      sharedMemories: 0,
      conversationDays: 1,
      currentMood: comp ? comp.mood : 'Curious'
    };
  };

  const resetRelationship = (companionId: string) => {
    setRelationshipData((prev) => ({
      ...prev,
      [companionId]: {
        companionId,
        stage: 'Stranger',
        affection: 0,
        trust: 10,
        familiarity: 0,
        meaningfulInteractions: 0,
        boundaryStatus: 'respected',
        perceptionSummary: 'Fresh start as strangers.',
        sharedMemories: 0,
        conversationDays: 1,
        currentMood: 'Curious'
      }
    }));
  };

  const sendMessage = async (
    companionId: string,
    text: string,
    language?: string
  ) => {
    const companion = getCompanion(companionId);
    if (!companion) throw new Error('Companion not found');

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      conversationId: companionId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Optimistically update conversation
    const currentConv = conversations[companionId] || [];
    setConversations((prev) => ({
      ...prev,
      [companionId]: [...currentConv, userMsg]
    }));

    const progress = getRelationshipProgress(companionId);
    const companionMemories = memories.filter(
      (m) => m.companionId === companionId
    );

    try {
      const data = await generateCompanionReply({
        character: companion,
        userMessage: text,
        conversationHistory: [...currentConv, userMsg],
        memories: companionMemories,
        relationshipStage: progress.stage,
        trust: progress.trust ?? 10,
        familiarity: progress.familiarity ?? 0,
        affection: progress.affection ?? 0,
        meaningfulInteractions: progress.meaningfulInteractions ?? 0,
        sharedMemoriesCount: companionMemories.length,
        mood: progress.currentMood,
        userLanguage: language || currentUser?.preferredLanguage || 'Auto Detect',
        userName: currentUser?.displayName || 'Friend'
      });

      const replyText =
        data.reply ||
        getMultilingualFallbackReply(
          text,
          currentUser?.displayName || 'Friend',
          companion,
          progress.currentMood,
          detectLanguagePipeline(text),
          progress.stage
        );

      const aiMsg: Message = {
        id: `msg_ai_${Date.now()}`,
        conversationId: companionId,
        sender: 'ai',
        text: replyText,
        imageUrl: data.generatedPhoto?.imageUrl,
        imageScenario: data.generatedPhoto?.scenario,
        imageId: data.generatedPhoto?.imageId,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      if (data.generatedPhoto) {
        setGeneratedPhotos((prev) => [data.generatedPhoto as GeneratedImage, ...prev]);
      }

      setConversations((prev) => ({
        ...prev,
        [companionId]: [...(prev[companionId] || []), aiMsg]
      }));

      // Update relationship progress with realistic metrics
      setRelationshipData((prev) => {
        const cur = prev[companionId] || progress;
        const delta = data.relationshipDelta;

        const newTrust = delta
          ? Math.max(0, Math.min(100, (cur.trust ?? 10) + delta.trustDelta))
          : Math.min(100, (cur.trust ?? 10) + 1);

        const newFamiliarity = delta
          ? Math.max(0, Math.min(100, (cur.familiarity ?? 0) + delta.familiarityDelta))
          : Math.min(100, (cur.familiarity ?? 0) + 1);

        const newAffection = delta
          ? Math.max(0, Math.min(100, (cur.affection ?? 0) + delta.affectionDelta))
          : Math.min(100, (cur.affection ?? 0) + 1);

        const newMeaningful = delta
          ? (cur.meaningfulInteractions ?? 0) + (delta.meaningfulInteraction ? 1 : 0)
          : (cur.meaningfulInteractions ?? 0) + 1;

        const newStage: RelationshipStage =
          (delta?.suggestedStage as RelationshipStage) || cur.stage;

        const newBoundaryStatus = delta?.boundaryTested
          ? 'tested'
          : cur.boundaryStatus || 'respected';

        const newPerception = delta?.perceptionNote || cur.perceptionSummary;

        return {
          ...prev,
          [companionId]: {
            ...cur,
            stage: newStage,
            trust: newTrust,
            familiarity: newFamiliarity,
            affection: newAffection,
            meaningfulInteractions: newMeaningful,
            boundaryStatus: newBoundaryStatus,
            perceptionSummary: newPerception,
            sharedMemories: companionMemories.length + (data.extractedMemory ? 1 : 0),
            currentMood: (data.mood as MoodType) || cur.currentMood
          }
        };
      });

      // Handle extracted memory
      if (data.extractedMemory) {
        addMemory({
          companionId,
          memoryText: data.extractedMemory.memoryText,
          category: data.extractedMemory.category || 'preference',
          importance: data.extractedMemory.importance || 'medium',
          detectedEmotion: data.extractedMemory.detectedEmotion
        });
      }

      // Non-sensitive language preference memory sync
      if (data.detectedLanguage?.primaryLanguage && currentUser) {
        const detectedLang = data.detectedLanguage.primaryLanguage;
        if (currentUser.preferredLanguage !== detectedLang) {
          setCurrentUser((prev) => (prev ? { ...prev, preferredLanguage: detectedLang } : null));
        }
      }

      return {
        reply: replyText,
        extractedMemory: data.extractedMemory,
        detectedLanguage: data.detectedLanguage
      };
    } catch (err) {
      console.warn('Chat engine error handled:', err);
      const detection = detectLanguagePipeline(text);
      const contextualReply = getMultilingualFallbackReply(
        text,
        currentUser?.displayName || 'Friend',
        companion,
        progress.currentMood,
        detection,
        progress.stage
      );
      const fallbackAiMsg: Message = {
        id: `msg_ai_${Date.now()}`,
        conversationId: companionId,
        sender: 'ai',
        text: contextualReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setConversations((prev) => ({
        ...prev,
        [companionId]: [...(prev[companionId] || []), fallbackAiMsg]
      }));
      return { reply: fallbackAiMsg.text };
    }
  };

  const deleteMessage = (companionId: string, messageId: string) => {
    setConversations((prev) => ({
      ...prev,
      [companionId]: (prev[companionId] || []).filter((m) => m.id !== messageId)
    }));
  };

  const clearConversation = (companionId: string) => {
    setConversations((prev) => ({
      ...prev,
      [companionId]: []
    }));
  };

  const regenerateLastResponse = async (companionId: string) => {
    const list = conversations[companionId] || [];
    if (list.length === 0) return;

    // Find last user message
    let lastUserMsgText = '';
    let filteredList = [...list];
    if (list[list.length - 1].sender === 'ai') {
      filteredList.pop(); // remove last AI response
    }
    const lastMsg = filteredList[filteredList.length - 1];
    if (lastMsg && lastMsg.sender === 'user') {
      lastUserMsgText = lastMsg.text;
      setConversations((prev) => ({
        ...prev,
        [companionId]: filteredList
      }));
      await sendMessage(companionId, lastUserMsgText);
    }
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt' | 'userId'>) => {
    const newMem: Memory = {
      id: `mem_${Date.now()}`,
      userId: currentUser?.id || 'user_mona_101',
      createdAt: new Date().toISOString().split('T')[0],
      ...memory
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const deleteMemory = (memoryId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
  };

  const clearMemoriesForCompanion = (companionId: string) => {
    setMemories((prev) => prev.filter((m) => m.companionId !== companionId));
  };

  const generatePhoto = async (
    companionId: string,
    prompt: string
  ): Promise<GeneratedImage> => {
    const companion = getCompanion(companionId);
    if (!companion) throw new Error('Companion not found');

    if (currentUser && currentUser.credits <= 0) {
      throw new Error('You have used all photo credits. Please refill credits in the dashboard.');
    }

    const res = await fetch('/api/generate-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character: companion,
        prompt
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to generate photo');
    }

    const data = await res.json();
    const newImage: GeneratedImage = {
      id: data.imageId || `img_${Date.now()}`,
      imageId: data.imageId || `img_${Date.now()}`,
      userId: currentUser?.id || 'user_mona_101',
      companionId,
      companionName: companion.name,
      prompt,
      promptContext: data.promptContext || prompt,
      scenario: data.scenario || prompt,
      imageUrl: data.imageUrl,
      generatedImageUrl: data.generatedImageUrl || data.imageUrl,
      visualIdentityVersion: data.visualIdentityVersion || 'v1.0-locked-identity',
      createdAt: new Date().toISOString().split('T')[0],
      moderationStatus: 'approved'
    };

    setGeneratedPhotos((prev) => [newImage, ...prev]);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        credits: Math.max(0, currentUser.credits - 1)
      });
    }

    return newImage;
  };

  const deletePhoto = (photoId: string) => {
    setGeneratedPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const addCredits = (amount: number) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, credits: currentUser.credits + amount });
    }
  };

  const addDiaryEntry = (
    entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'userId'>
  ) => {
    const newEntry: DiaryEntry = {
      id: `diary_${Date.now()}`,
      userId: currentUser?.id || 'user_mona_101',
      createdAt: new Date().toISOString(),
      ...entry
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const submitReport = (
    report: Omit<Report, 'id' | 'createdAt' | 'status' | 'reporterId' | 'reporterEmail'>
  ) => {
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser?.id || 'guest',
      reporterEmail: currentUser?.email || 'anonymous',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      ...report
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const resolveReport = (
    reportId: string,
    action: 'resolved' | 'rejected' | 'archived'
  ) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    // Add audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      adminEmail: currentUser?.email || 'admin@mona.ai',
      action: `REPORT_${action.toUpperCase()}`,
      targetType: 'report',
      targetId: reportId,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const adminUpdateCompanion = (companion: AICharacter) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === companion.id ? companion : c))
    );
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      adminEmail: currentUser?.email || 'admin@mona.ai',
      action: 'UPDATE_COMPANION',
      targetType: 'companion',
      targetId: companion.id,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const adminCreateCompanion = (companionData: Omit<AICharacter, 'id'>) => {
    const newComp: AICharacter = {
      ...companionData,
      id: `char_custom_${Date.now()}`
    };
    setCompanions((prev) => [newComp, ...prev]);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      adminEmail: currentUser?.email || 'admin@mona.ai',
      action: 'CREATE_COMPANION',
      targetType: 'companion',
      targetId: newComp.id,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const adminToggleUserStatus = (userId: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser?.id || 'admin',
      adminEmail: currentUser?.email || 'admin@mona.ai',
      action: 'TOGGLE_USER_STATUS',
      targetType: 'user',
      targetId: userId,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCompanionId,
        setSelectedCompanionId,
        selectedDateScenarioId,
        setSelectedDateScenarioId,
        ageVerified,
        verifyAge,
        currentUser,
        login,
        register,
        logout,
        updateUserPreferences,
        companions,
        getCompanion,
        favorites,
        toggleFavorite,
        isFavorite,
        conversations,
        sendMessage,
        deleteMessage,
        clearConversation,
        regenerateLastResponse,
        memories,
        addMemory,
        deleteMemory,
        clearMemoriesForCompanion,
        generatedPhotos,
        generatePhoto,
        deletePhoto,
        credits: currentUser?.credits ?? 50,
        addCredits,
        diaryEntries,
        addDiaryEntry,
        deleteDiaryEntry,
        getRelationshipProgress,
        resetRelationship,
        reports,
        submitReport,
        resolveReport,
        auditLogs,
        adminUpdateCompanion,
        adminCreateCompanion,
        adminToggleUserStatus,
        photoModalOpen,
        setPhotoModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        reportModalOpen,
        setReportModalOpen,
        reportingTarget,
        setReportingTarget
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
