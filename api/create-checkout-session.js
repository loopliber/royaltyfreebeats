import Stripe from 'stripe'
import { supabase } from '../src/api/supabaseClient.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { beatIds, licenseTypes, userId } = req.body

    // Fetch beat details
    const { data: beats, error: beatsError } = await supabase
      .from('beats')
      .select('*')
      .in('id', beatIds)

    if (beatsError) throw beatsError

    // Calculate total amount and create line items
    const lineItems = beats.map((beat, index) => {
      const licenseType = licenseTypes[index]
      let price = beat.price

      // Adjust price based on license type
      switch (licenseType) {
        case 'premium':
          price = beat.price * 3
          break
        case 'exclusive':
          price = beat.price * 10
          break
        default:
          price = beat.price
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${beat.title} - ${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)} License`,
            description: `Beat by ${beat.artist}`,
            images: beat.cover_art_url ? [beat.cover_art_url] : [],
            metadata: {
              beat_id: beat.id,
              license_type: licenseType
            }
          },
          unit_amount: Math.round(price * 100) // Convert to cents
        },
        quantity: 1
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:5173'}/cart`,
      metadata: {
        user_id: userId,
        beat_ids: JSON.stringify(beatIds),
        license_types: JSON.stringify(licenseTypes)
      },
      customer_email: req.body.email
    })

    // Store purchase records in pending state
    const purchases = beats.map((beat, index) => ({
      user_id: userId,
      beat_id: beat.id,
      license_type: licenseTypes[index],
      amount: lineItems[index].price_data.unit_amount / 100,
      stripe_session_id: session.id,
      status: 'pending'
    }))

    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert(purchases)

    if (purchaseError) throw purchaseError

    res.status(200).json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Checkout session creation failed:', error)
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    })
  }
}
