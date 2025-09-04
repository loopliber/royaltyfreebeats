import Stripe from 'stripe'
import { supabase } from '../src/api/supabaseClient.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object

        // Update purchase status to completed
        const { error: updateError } = await supabase
          .from('purchases')
          .update({ 
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Failed to update purchase status:', updateError)
          throw updateError
        }

        // Generate license PDFs for completed purchases
        const { data: purchases, error: fetchError } = await supabase
          .from('purchases')
          .select('*, beats(*)')
          .eq('stripe_session_id', session.id)

        if (fetchError) throw fetchError

        // TODO: Generate and store license PDFs
        // This would typically involve calling a PDF generation service
        // and storing the resulting PDF URLs in the purchases table

        console.log(`Payment completed for session ${session.id}`)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object

        // Update purchase status to failed
        const { error: failError } = await supabase
          .from('purchases')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', failedPayment.id)

        if (failError) {
          console.error('Failed to update failed payment status:', failError)
          throw failError
        }

        console.log(`Payment failed for intent ${failedPayment.id}`)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.status(200).json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}
