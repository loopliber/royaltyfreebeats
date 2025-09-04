import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: (email, password, metadata = {}) => 
    supabase.auth.signUp({ email, password, options: { data: metadata } }),
  
  signIn: (email, password) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => 
    supabase.auth.signOut(),
  
  getUser: () => 
    supabase.auth.getUser(),
  
  getSession: () => 
    supabase.auth.getSession(),
  
  onAuthStateChange: (callback) => 
    supabase.auth.onAuthStateChange(callback)
}

// Database helpers
export const db = {
  // Beats
  beats: {
    getAll: (filters = {}) => {
      let query = supabase.from('beats').select('*').eq('is_active', true)
      
      if (filters.genre) query = query.eq('genre', filters.genre)
      if (filters.bpm) query = query.eq('bpm', filters.bpm)
      if (filters.key) query = query.eq('key', filters.key)
      
      return query.order('created_at', { ascending: false })
    },
    
    getById: (id) => 
      supabase.from('beats').select('*').eq('id', id).single(),
    
    create: (beat) => 
      supabase.from('beats').insert([beat]).select().single(),
    
    update: (id, updates) => 
      supabase.from('beats').update(updates).eq('id', id).select().single(),
    
    delete: (id) => 
      supabase.from('beats').delete().eq('id', id)
  },

  // Purchases
  purchases: {
    getByUser: (userId) => 
      supabase.from('purchases')
        .select('*, beats(*)')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false }),
    
    create: (purchase) => 
      supabase.from('purchases').insert([purchase]).select().single(),
    
    updateStatus: (id, status, updates = {}) => 
      supabase.from('purchases').update({ status, ...updates }).eq('id', id)
  },

  // Beat Likes
  beatLikes: {
    getByUser: (userId) => 
      supabase.from('beat_likes').select('beat_id').eq('user_id', userId),
    
    toggle: async (userId, beatId) => {
      const { data: existing } = await supabase.from('beat_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('beat_id', beatId)
        .single()
      
      if (existing) {
        return supabase.from('beat_likes').delete()
          .eq('user_id', userId)
          .eq('beat_id', beatId)
      } else {
        return supabase.from('beat_likes').insert([{ user_id: userId, beat_id: beatId }])
      }
    }
  },

  // Leads
  leads: {
    create: (lead) => 
      supabase.from('leads').insert([lead]).select().single()
  },

  // Blog Posts
  blogPosts: {
    getPublished: () => 
      supabase.from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false }),
    
    getBySlug: (slug) => 
      supabase.from('blog_posts').select('*').eq('slug', slug).single()
  },

  // User Profiles
  userProfiles: {
    getById: (id) => 
      supabase.from('user_profiles').select('*').eq('id', id).single(),
    
    update: (id, updates) => 
      supabase.from('user_profiles').update(updates).eq('id', id).select().single()
  }
}

// File storage helpers
export const storage = {
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return { data, publicUrl }
  },
  
  deleteFile: (bucket, path) => 
    supabase.storage.from(bucket).remove([path]),
  
  getPublicUrl: (bucket, path) => 
    supabase.storage.from(bucket).getPublicUrl(path)
}
