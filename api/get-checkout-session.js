import { supabase } from '../src/api/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID required' })
    }

    // Fetch purchase details
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select(`
        *,
        beats (
          title,
          artist,
          cover_art_url
        )
      `)
      .eq('stripe_session_id', session_id)
      .eq('status', 'completed')

    if (error) throw error

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ error: 'No completed purchases found for this session' })
    }

    res.status(200).json({
      success: true,
      purchases: purchases
    })

  } catch (error) {
    console.error('Failed to fetch checkout session:', error)
    res.status(500).json({ 
      error: 'Failed to fetch session details',
      details: error.message 
    })
  }
}
