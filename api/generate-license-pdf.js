import PDFDocument from 'pdfkit'
import { supabase } from '../src/api/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { purchaseId } = req.body

    // Fetch purchase details
    const { data: purchase, error } = await supabase
      .from('purchases')
      .select(`
        *,
        beats (
          title,
          artist,
          bpm,
          key,
          genre
        ),
        user_profiles (
          full_name,
          email
        )
      `)
      .eq('id', purchaseId)
      .eq('status', 'completed')
      .single()

    if (error) throw error

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' })
    }

    // Generate PDF
    const doc = new PDFDocument()
    let buffers = []
    
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers)
      
      // Upload PDF to storage
      const fileName = `license-${purchase.id}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('licenses')
        .upload(fileName, pdfData, {
          contentType: 'application/pdf'
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('licenses')
        .getPublicUrl(fileName)

      // Update purchase with license PDF URL
      await supabase
        .from('purchases')
        .update({ license_pdf_url: publicUrl })
        .eq('id', purchaseId)

      res.status(200).json({
        success: true,
        licenseUrl: publicUrl
      })
    })

    // PDF content
    doc.fontSize(20).text('BEAT LICENSE AGREEMENT', { align: 'center' })
    doc.moveDown()
    
    doc.fontSize(14).text(`License Type: ${purchase.license_type.toUpperCase()}`)
    doc.text(`Beat Title: ${purchase.beats.title}`)
    doc.text(`Artist: ${purchase.beats.artist}`)
    doc.text(`BPM: ${purchase.beats.bpm}`)
    doc.text(`Key: ${purchase.beats.key}`)
    doc.text(`Genre: ${purchase.beats.genre}`)
    doc.moveDown()
    
    doc.text(`Licensee: ${purchase.user_profiles.full_name}`)
    doc.text(`Email: ${purchase.user_profiles.email}`)
    doc.text(`Purchase Date: ${new Date(purchase.created_at).toLocaleDateString()}`)
    doc.text(`License ID: ${purchase.id}`)
    doc.moveDown()

    // License terms based on type
    const licenseTerms = {
      basic: [
        '• Non-exclusive rights to use the beat',
        '• Up to 2,000 units distributed',
        '• Audio streaming allowed',
        '• Producer credit required',
        '• No resale or transfer of license'
      ],
      premium: [
        '• Non-exclusive rights to use the beat',
        '• Up to 10,000 units distributed',
        '• Audio/video streaming allowed',
        '• Producer credit required',
        '• Performance rights included',
        '• No resale or transfer of license'
      ],
      exclusive: [
        '• Exclusive rights to use the beat',
        '• Unlimited distribution',
        '• Full ownership transfer',
        '• No producer credit required',
        '• Full performance rights',
        '• Resale rights included'
      ]
    }

    doc.text('LICENSE TERMS:', { underline: true })
    licenseTerms[purchase.license_type].forEach(term => {
      doc.text(term)
    })

    doc.end()

  } catch (error) {
    console.error('PDF generation failed:', error)
    res.status(500).json({ 
      error: 'Failed to generate license PDF',
      details: error.message 
    })
  }
}
