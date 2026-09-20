import { AICharacter, Gender } from '../types';
import { femaleCharacters } from './femaleCharacters';
import { maleCharacters } from './maleCharacters';
import { ensureVisualIdentity } from '../services/visualIdentityService';

export const initialCharacters: AICharacter[] = [
  ...femaleCharacters,
  ...maleCharacters
].map((c) => ({
  ...c,
  visualIdentity: ensureVisualIdentity(c)
}));

export const TOTAL_COMPANIONS_COUNT = initialCharacters.length;
export const FEMALE_COMPANIONS_COUNT = femaleCharacters.length;
export const MALE_COMPANIONS_COUNT = maleCharacters.length;

export function getCharacterById(id: string, customCharacters?: AICharacter[]): AICharacter | undefined {
  const pool = customCharacters || initialCharacters;
  return pool.find((c) => c.id === id);
}

export function filterCharacters(
  characters: AICharacter[],
  options: {
    gender?: 'all' | Gender;
    country?: string;
    language?: string;
    personality?: string;
    search?: string;
    sortBy?: 'popular' | 'newest' | 'name';
  }
): AICharacter[] {
  let result = [...characters];

  if (options.gender && options.gender !== 'all') {
    result = result.filter((c) => c.gender === options.gender);
  }

  if (options.country && options.country !== 'all') {
    result = result.filter((c) => c.country.toLowerCase() === options.country!.toLowerCase());
  }

  if (options.language && options.language !== 'all') {
    result = result.filter((c) =>
      c.languages.some((l) => l.toLowerCase() === options.language!.toLowerCase())
    );
  }

  if (options.personality && options.personality !== 'all') {
    result = result.filter((c) =>
      c.personalityTraits.some(
        (t) => t.toLowerCase() === options.personality!.toLowerCase()
      )
    );
  }

  if (options.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.biography.toLowerCase().includes(q) ||
        c.personality.toLowerCase().includes(q) ||
        c.languages.some((l) => l.toLowerCase().includes(q))
    );
  }

  if (options.sortBy === 'popular') {
    result.sort((a, b) => b.popularityScore - a.popularityScore);
  } else if (options.sortBy === 'newest') {
    result.reverse();
  } else if (options.sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

export const availableCountries = Array.from(
  new Set(initialCharacters.map((c) => c.country))
).sort();

export const availableLanguages = [
  'English',
  'French',
  'Japanese',
  'Korean',
  'Hindi',
  'Bengali',
  'Spanish',
  'Italian',
  'German',
  'Portuguese',
  'Swedish',
  'Arabic',
  'Chinese'
];

export const availablePersonalities = [
  'Romantic',
  'Intelligent',
  'Playful',
  'Caring',
  'Calm',
  'Confident',
  'Adventurous',
  'Shy',
  'Musical',
  'Bookish',
  'Artistic'
];
