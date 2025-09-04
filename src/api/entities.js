import { base44 } from './base44Client';

// Temporary mock entities for testing during migration
export const Beat = {
  find: () => Promise.resolve([]),
  findById: (id) => Promise.resolve(null),
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