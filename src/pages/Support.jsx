import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: "How do I download my beats after purchase?",
    answer: "After a successful purchase, you will be redirected to an order confirmation page with download links. You will also receive an email with the download links. Additionally, all your purchased beats can be found and downloaded from your Profile page."
  },
  {
    question: "What are the differences between licenses?",
    answer: "We offer three main licenses: Lease, Unlimited, and Exclusive. A 'Lease' is for smaller projects with streaming limits. 'Unlimited' removes those limits. 'Exclusive' gives you sole ownership of the beat, and we remove it from our store. You can see the full details by clicking the 'License' button on any beat."
  },
  {
    question: "Can I use these beats on YouTube, Spotify, and other platforms?",
    answer: "Yes! All our licenses (including free downloads for non-commercial use) allow you to use the beats on major platforms. For commercial releases and monetization, you must purchase at least a Lease license."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through our secure payment processor, Stripe. We ensure your payment information is safe and encrypted."
  }
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <LifeBuoy className="w-16 h-16 mx-auto mb-4 text-[var(--primary)]" />
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">Support Center</h1>
            <p className="text-lg text-[var(--text-secondary)] mt-4">
              We're here to help. Find answers to common questions or get in touch with us.
            </p>
          </div>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-[var(--text-secondary)]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                If you can't find the answer you're looking for, please don't hesitate to reach out.
                Help@royaltyfreebeats.io
              </CardDescription>
            </CardHeader>
            <CardContent>
                <a href="mailto:help@royaltyfreebeats.io">
                    <Button className="w-full sm:w-auto bg-[var(--primary)] hover:bg-blue-600">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                    </Button>
                </a>
                <p className="text-sm text-[var(--text-secondary)] mt-4">
                    Our support team typically responds within 24 hours.
                </p>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    </div>
  );
}