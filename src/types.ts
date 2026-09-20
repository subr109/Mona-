export type Gender = 'female' | 'male';

export type MoodType =
  | 'Happy'
  | 'Excited'
  | 'Calm'
  | 'Playful'
  | 'Romantic'
  | 'Curious'
  | 'Sleepy'
  | 'Thoughtful';

export type RelationshipStage =
  | 'Stranger'
  | 'Acquaintance'
  | 'Friend'
  | 'Close Friend'
  | 'Deep Relationship'
  | 'Romantic Relationship';

export interface VisualIdentity {
  faceIdentity?: string;
  facialFeatures?: string;
  eyeDescription?: string;
  hairDescription?: string;
  skinTone: string;
  bodyType?: string;
  heightDescription?: string;
  distinctiveFeatures: string;
  ageAppearance?: number;
  baseProfileImageUrl?: string;
  identityReferenceImages?: string[];
  // Backwards-compatible convenience aliases
  faceDescription?: string;
  hair?: string;
  hairColor?: string;
  eyeColor?: string;
  approximateAge?: number;
  bodyDescription?: string;
  fashionStyle?: string;
}

export interface CanonicalVisualIdentity extends VisualIdentity {
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
}

export interface AICharacter {
  id: string;
  name: string;
  age: number; // strictly 18+
  gender: Gender;
  country: string;
  city: string;
  flag: string;
  languages: string[];
  primaryLanguage: string;
  biography: string;
  quote: string;
  personality: string;
  personalityTraits: string[];
  interests: string[];
  communicationStyle: string;
  relationshipStyle: string;
  backstory: string;
  profileImageUrl: string;
  thumbnailUrl: string;
  visualIdentity: VisualIdentity;
  systemPrompt: string;
  active: boolean;
  mood: MoodType;
  popularityScore: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  preferredLanguage: string;
  partnerGenderPreference: 'female' | 'male' | 'all';
  ageVerified: boolean;
  dateOfBirth?: string;
  createdAt: string;
  lastActive: string;
  subscriptionStatus: 'free' | 'vip' | 'infinite';
  credits: number;
  role: 'user' | 'admin';
  status: 'active' | 'disabled';
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  moderationStatus?: 'safe' | 'flagged';
  voiceAudioUrl?: string;
  imageUrl?: string;
  imageScenario?: string;
  imageId?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  companionId: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  companionId: string;
  memoryText: string;
  category: 'preference' | 'hobby' | 'joke' | 'emotional_context' | 'shared_moment' | 'milestone' | 'background';
  importance: 'high' | 'medium' | 'low';
  createdAt: string;
  detectedEmotion?: string;
}

export interface GeneratedImage {
  id: string;
  imageId: string;
  userId: string;
  companionId: string;
  companionName: string;
  prompt: string;
  promptContext: string;
  scenario: string;
  imageUrl: string;
  generatedImageUrl?: string;
  createdAt: string;
  visualIdentityVersion: string;
  moderationStatus: 'approved' | 'pending';
}

export interface DiaryEntry {
  id: string;
  userId: string;
  companionId: string;
  companionName: string;
  companionAvatar: string;
  title: string;
  summary: string;
  imageUrl?: string;
  date: string;
  createdAt: string;
}

export interface RelationshipProgress {
  companionId: string;
  stage: RelationshipStage;
  affection: number; // 0 - 100 (emotional warmth, liking, affection)
  trust: number; // 0 - 100 (earned through respect, active listening & consistency)
  familiarity: number; // 0 - 100 (earned through shared facts, time, preferences)
  meaningfulInteractions: number; // substantive conversation count
  sharedMemories: number;
  conversationDays: number;
  currentMood: MoodType;
  perceptionSummary?: string;
  boundaryStatus?: 'respected' | 'tested' | 'firm';
}

export interface Report {
  id: string;
  reporterId: string;
  reporterEmail: string;
  targetType: 'ai_response' | 'generated_image' | 'companion' | 'technical';
  targetId: string;
  reason:
    | 'Unsafe Content'
    | 'Harassment'
    | 'Inappropriate Image'
    | 'Impersonation'
    | 'Technical Issue'
    | 'Other';
  description: string;
  status: 'pending' | 'resolved' | 'rejected' | 'archived';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
}

export interface VirtualDateScenario {
  id: string;
  title: string;
  location: string;
  iconName: string;
  description: string;
  ambientPrompt: string;
  bgImageUrl: string;
  romanticActions: string[];
}
