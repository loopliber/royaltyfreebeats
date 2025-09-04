import { base44 } from './base44Client';

// Real beat data from Base44 export
const realBeats = [
  {
    id: '689c43f43b600e30882e966f',
    title: 'Basil',
    artist: 'RoyaltyFreeBeats',
    genre: 'hip-hop',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/7d98ecf06_basil_80bpmajcookin.mp3',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/7345f95ba_a0e2a6577650e8ed03a7e724558b5811.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T07:51:16.294000'
  },
  {
    id: '689c7355c72b9ad5e2ca28ae',
    title: 'Lost',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/1d54b139b_FREESZAxGuitarTypeBeat_Lost_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/f0c9b68df_94c341aa1e9f7446285c0bac9d996e98.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:13:25.952000'
  },
  {
    id: '689c7335d1e36fffe952441e',
    title: 'Glow',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/378e5238b_FREESZAxGuitarTypeBeat_Glow_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/6d18cde83_158b4a367c5c4c981ced9e2ef24e99c7.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:12:53.819000'
  },
  {
    id: '689c7388d1e36fffe9524710',
    title: 'Rush',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/76d88d745_FREESZAxGuitarTypeBeat_Rush_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/3f3e011bb_68e0e5dfdc3d9241c6426aed2e038ce6.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:14:16.021000'
  },
  {
    id: '689c739f94e39d0c0d0f6fb2',
    title: 'Stay',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/acf95e544_FREESZAxGuitarTypeBeat_Stay_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/8b63bd4b5_6f0fa1e6cb0284f79d72a033ba324d64.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:14:39.090000'
  },
  {
    id: '689c73b9edd61a976d374d46',
    title: 'Velvet',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/337e8189c_FREESZAxGuitarTypeBeat_Velvet_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/9385ff231_5a046df20823a470302757b02231138e.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:15:05.791000'
  },
  {
    id: '689c73dffc3ad6abe473ef88',
    title: 'You + Me',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/ebce23f1d_FREESZAxGuitarTypeBeat_YouMe_2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/61c98ca6b_3fe418adb59f5795b9659ba0a36ea19c.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:15:43.049000'
  },
  {
    id: '689c73f4a2e536daaa0f0909',
    title: 'Only You (With Hook)',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/6c7fcc458__OnlyYou_WithHook-RBTypeBeat2025.wav',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/dd930cf8b_3c93b8421a30e1206cde8088eab4f350.jpg',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:16:04.975000'
  },
  {
    id: '689c76d0c72b9ad5e2ca41d8',
    title: 'Honey',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/3cb2174f1_FREESZAxGuitarTypeBeat_Honey_2025.wav',
    cover_art_url: 'https://images.unsplash.com/photo-1674471910468-b2d8e864d64c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTA0fE5xUDNZdnFBLXZnfHxlbnwwfHx8fHw%3D',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:28:16.419000'
  },
  {
    id: '689c76e0ca6f41700983dab1',
    title: 'Drip',
    artist: 'RoyaltyFreeBeats',
    genre: 'rnb',
    bpm: 120,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/4ee54c34d_FREESZAxGuitarTypeBeat_Drip_2025.wav',
    cover_art_url: 'https://images.unsplash.com/photo-1637274501452-1f8571c6a33a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTA2fE5xUDNZdnFBLXZnfHxlbnwwfHx8fHw%3D',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-13T11:28:32.733000'
  },
  {
    id: '689db302448c80d7a62c06be',
    title: 'BUTTERFLY',
    artist: 'RoyaltyFreeBeats',
    genre: 'hip-hop',
    bpm: 96,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/f298cea77_BUTTERFLY_96BPMSPACE.mp3',
    cover_art_url: 'https://images.unsplash.com/photo-1619472032094-eadb7ec01655?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8ODJ8TnFQM1l2cUEtdmd8fGVufDB8fHx8fA%3D%3D',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-14T09:57:22.088000'
  },
  {
    id: '689db3053383accbb67d18fe',
    title: 'EAST',
    artist: 'RoyaltyFreeBeats',
    genre: 'hip-hop',
    bpm: 100,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/023aa4270_east100BPMAJCOOKIN_Master.mp3',
    cover_art_url: 'https://images.unsplash.com/photo-1624220588531-2e1bcebd5c4f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8ODV8TnFQM1l2cUEtdmd8fGVufDB8fHx8fA%3D%3D',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-14T09:57:25.629000'
  },
  {
    id: '689db9b255ab972d6d4668af',
    title: 'jumpman',
    artist: 'RoyaltyFreeBeats',
    genre: 'trap',
    bpm: 140,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/51497d320_jumpman_140ajcookin.mp3',
    cover_art_url: 'https://images.unsplash.com/photo-1750969393822-36e48a31895f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxVNmpaNHBfLUdUTXx8ZW58MHx8fHx8',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-08-14T10:25:54.240000'
  },
  {
    id: '68b88dfc624ca773070fab1e',
    title: 'Vegas',
    artist: 'RoyaltyFreeBeats',
    genre: 'trap',
    bpm: 142,
    key: '',
    duration: '',
    audio_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/public/689a551f981ee080a572838a/cdfb46f28_Vegas_142BPMroyaltyfreebeatsio.mp3',
    cover_art_url: 'https://base44.app/api/apps/689a551f981ee080a572838a/files/public/689a551f981ee080a572838a/8fa5bacb6_ajcookin_3d_cartoon_of_a_happy_black_man_with_dreads_and_diam_306b2c2e-565b-489a-8217-43082e4ac7a6_0.png',
    tags: [],
    lease_price: 20,
    unlimited_price: 150,
    exclusive_price: 500,
    is_exclusive_sold: false,
    download_count: 0,
    created_date: '2025-09-03T18:50:36.640000'
  }
];

// Temporary mock entities for testing during migration
export const Beat = {
  find: (filters = {}) => {
    let beats = [...realBeats];
    
    // Apply genre filter
    if (filters.genre) {
      beats = beats.filter(beat => beat.genre === filters.genre);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      beats = beats.filter(beat => 
        beat.title.toLowerCase().includes(searchTerm) ||
        beat.artist.toLowerCase().includes(searchTerm) ||
        beat.genre.toLowerCase().includes(searchTerm)
      );
    }
    
    return Promise.resolve(beats);
  },
  list: (sortBy = '-created_date', limit = null) => {
    let beats = [...realBeats];
    
    // Sort beats by created_date (newest first by default)
    if (sortBy === '-created_date') {
      beats.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === 'created_date') {
      beats.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    }
    
    // Apply limit if specified
    if (limit && limit > 0) {
      beats = beats.slice(0, limit);
    }
    
    return Promise.resolve(beats);
  },
  findById: (id) => {
    const beat = realBeats.find(beat => beat.id === id);
    return Promise.resolve(beat || null);
  },
  create: (data) => Promise.resolve(data),
  update: (id, data) => Promise.resolve(data),
  delete: (id) => Promise.resolve(true)
};

export const Lead = {
  create: (data) => Promise.resolve(data),
  find: () => Promise.resolve([])
};

export const Purchase = {
  find: () => Promise.resolve([]),
  findById: (id) => Promise.resolve(null),
  create: (data) => Promise.resolve(data)
};

export const BeatLike = {
  find: () => Promise.resolve([]),
  create: (data) => Promise.resolve(data),
  delete: (id) => Promise.resolve(true)
};

export const BlogPost = {
  find: () => Promise.resolve([]),
  findById: (id) => Promise.resolve(null),
  create: (data) => Promise.resolve(data)
};

// auth sdk:
export const User = {
  getUser: () => Promise.resolve(null),
  signUp: (data) => Promise.resolve(data),
  signIn: (data) => Promise.resolve(data),
  signOut: () => Promise.resolve(true),
  onAuthStateChange: (callback) => {
    // Mock auth state
    setTimeout(() => callback(null, null), 100);
    return { unsubscribe: () => {} };
  }
};