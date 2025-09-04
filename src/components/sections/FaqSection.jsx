import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: "Are these beats really free to use?",
    answer: "Yes! You can download a tagged version of any beat for free. This is perfect for writing lyrics, practicing, or for non-commercial/non-profit use. To upload your song to Spotify, Apple Music, or monetize on YouTube, you must purchase a license."
  },
  {
    question: "Can I use the free downloads for my commercial song?",
    answer: "No, the free downloads are for non-commercial use only. To release your song commercially on streaming platforms, you need to purchase at least a 'Lease' license. This grants you the legal rights for distribution and monetization."
  },
  {
    question: "What does 'royalty-free' mean?",
    answer: "Royalty-free means that after you purchase a license, you do not have to pay us any future royalties or percentages from the earnings of your song. You pay a one-time fee for the license and keep 100% of your earnings."
  },
  {
    question: "What happens after I buy a beat?",
    answer: "You'll immediately receive download links for the high-quality, untagged audio files (WAV format) and your license agreement PDF. You can also access all your purchases from your profile page anytime."
  }
];

export default function FaqSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-b border-[var(--border)]">
            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline text-[var(--text-primary)]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[var(--text-secondary)] text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}