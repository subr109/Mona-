import { VirtualDateScenario } from '../types';

export const virtualDateScenarios: VirtualDateScenario[] = [
  {
    id: 'cafe_date',
    title: 'Cozy Parisian Café',
    location: 'Café de Flore, Paris',
    iconName: 'Coffee',
    description: 'Sip artisan espresso under a striped awning while gentle rain taps against the glass and vintage jazz plays softly inside.',
    ambientPrompt: 'You are on a cozy café date in a warm Parisian bistro. The aroma of roasted coffee and fresh brioche fills the air. Gentle rain trickles down the window beside your intimate corner table. You look into your companion’s eyes with tenderness and affectionate warmth.',
    bgImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Gently brush fingers while reaching for your cup',
      'Share a bite of a warm chocolate croissant',
      'Whisper what you first noticed about them',
      'Look outside together at the rain and smile'
    ]
  },
  {
    id: 'dinner_date',
    title: 'Candlelit Rooftop Dinner',
    location: 'Skyline Terrace, Florence',
    iconName: 'Utensils',
    description: 'A private table under string lights overlooking the historic city skyline. Soft candlelight flickers across wine glasses.',
    ambientPrompt: 'You are having an enchanting candlelit rooftop dinner overlooking a breathtaking panoramic evening skyline. Soft acoustic strings float through the night air. The flickering candle illuminates their face and creates an unforgettable intimate atmosphere.',
    bgImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Propose an affectionate toast to being together',
      'Hold their hand across the white tablecloth',
      'Compliment how radiant they look tonight',
      'Ask them to make a secret wish together'
    ]
  },
  {
    id: 'beach_walk',
    title: 'Twilight Beach Walk',
    location: 'Amalfi Coast Shoreline',
    iconName: 'Waves',
    description: 'Barefoot on cooling sand as the sea laps gently at your feet. The horizon melts into shades of rose gold, lavender, and deep indigo.',
    ambientPrompt: 'You are strolling side-by-side along a tranquil seashore at twilight. The cool sea breeze carries the scent of salt and night flowers. Gentle waves whisper against the sand, and the fading sunset casts a dreamy glow around both of you.',
    bgImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Slip your fingers into theirs as you walk',
      'Stop to watch the last rays of sunset together',
      'Drape your jacket over their shoulders if they feel cool',
      'Trace a heart in the wet sand'
    ]
  },
  {
    id: 'movie_night',
    title: 'Cozy Film Night',
    location: 'Private Hearthside Lounge',
    iconName: 'Film',
    description: 'Warm cashmere blankets, flickering wood fireplace, and an old romantic classic playing on the screen while you sit side-by-side.',
    ambientPrompt: 'You are cuddled close in a soft lounge with a crackling fireplace warming the room. A vintage romantic film plays quietly, but your attention keeps wandering toward each other. The atmosphere is safe, warm, and deeply comforting.',
    bgImageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Pull the blanket closer over both of you',
      'Rest your shoulder against theirs',
      'Share a bowl of warm buttered popcorn',
      'Whisper an inside joke during a scene'
    ]
  },
  {
    id: 'travel',
    title: 'Midnight Gondola in Venice',
    location: 'Grand Canal, Venice',
    iconName: 'Compass',
    description: 'Drifting along ancient stone palazzos under a full moon, with lantern reflections shimmering on quiet emerald water.',
    ambientPrompt: 'You are drifting on a velvet-lined gondola through quiet Venetian canals under a starry sky. Water gently laps against ancient stone steps. Moonlight catches in your companion’s eyes, and time feels completely suspended.',
    bgImageUrl: 'https://images.unsplash.com/photo-1523906834658-6e2522d4282d?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Lean back together under the starry canopy',
      'Point out a secret rooftop balcony above',
      'Gently intertwine your fingers with theirs',
      'Ask what this city reminds them of'
    ]
  },
  {
    id: 'music_night',
    title: 'Late Night Jazz Club',
    location: 'Hidden Cellar, Greenwich Village',
    iconName: 'Music',
    description: 'Dim amber lamps, rich mahogany booths, and a sultry upright bass and saxophone setting a smooth, hypnotic romantic mood.',
    ambientPrompt: 'You are nestled into a plush corner booth of a subterranean jazz club. Soft brass harmonies and mellow piano chords surround you. You share an intimate conversation between song sets, leaning close so you can hear each other’s whispers.',
    bgImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Lean in close to whisper over the melody',
      'Order their favorite mocktail or drink',
      'Tap your feet to the rhythm together',
      'Tell them what song reminds you of them'
    ]
  },
  {
    id: 'cooking_together',
    title: 'Cooking Italian Dinner Together',
    location: 'Warm Tuscan Kitchen',
    iconName: 'ChefHat',
    description: 'Flour on your aprons, simmering fresh basil tomato sauce, laughter over making pasta from scratch, and a glass of Chianti.',
    ambientPrompt: 'You are cooking a homemade dinner together in a rustic kitchen. The stove smells of crushed garlic, fresh oregano, and ripe tomatoes. You laugh together as you roll out pasta dough, enjoying the playful domestic intimacy.',
    bgImageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Playfully dab a touch of flour on their nose',
      'Offer a wooden spoon to taste the warm sauce',
      'Put on a slow Italian song and sway by the counter',
      'Plate the meal together with pride'
    ]
  },
  {
    id: 'museum_visit',
    title: 'Quiet Art Gallery Walk',
    location: 'Musée d’Orsay, Paris',
    iconName: 'Palette',
    description: 'Whispering thoughts before grand Impressionist masterpieces, sharing quiet smiles in echoing marble corridors.',
    ambientPrompt: 'You are walking through a tranquil, sunlit museum gallery. Before magnificent works of art, you share quiet interpretations and discover how the other sees the world. Your hands brush naturally as you move between halls.',
    bgImageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Ask which painting represents how they feel today',
      'Walk closely side-by-side with matched steps',
      'Share a quiet secret in a hushed corridor',
      'Sit on a leather bench and just observe together'
    ]
  },
  {
    id: 'city_walk',
    title: 'Midnight City Lights Stroll',
    location: 'Tokyo Tower Viewpoint, Roppongi',
    iconName: 'MapPin',
    description: 'A neon-lit skyline glowing beneath crisp evening air. City lights sparkling like fallen constellations while you walk together.',
    ambientPrompt: 'You are walking together through a vibrant city illuminated by towering neon and amber streetlights. The cool evening air is refreshing, and the panoramic city view creates a breathtaking backdrop for intimate, heartfelt conversation.',
    bgImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    romanticActions: [
      'Stop by an overlook to admire the endless city lights',
      'Offer your warm gloves or hold their hand against the chill',
      'Share hot canned coffee or tea from a vending machine',
      'Confess how glad you are to be here with them'
    ]
  }
];
