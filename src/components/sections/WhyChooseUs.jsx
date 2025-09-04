
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, MicVocal, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <Download className="w-8 h-8 text-[var(--primary)]" />,
    title: "Instant Free Downloads",
    description: "Get immediate access to tagged MP3 files for free. Perfect for writing or non-commercial projects."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />,
    title: "Commercial Use Licenses",
    description: "Our paid licenses are 100% royalty-free and cleared for use on Spotify, Apple Music, YouTube and more."
  },
  {
    icon: <MicVocal className="w-8 h-8 text-[var(--primary)]" />,
    title: "Professional Quality",
    description: "Every instrumental is professionally mixed and mastered, giving your track a radio-ready sound."
  },
  {
    icon: <Zap className="w-8 h-8 text-[var(--primary)]" />,
    title: "Updated Weekly",
    description: "We add new, high-quality beats and instrumentals every week to keep your sound fresh."
  }
];

export default function WhyChooseUs() {
  return (
    <div className="bg-white py-16 sm:py-24 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Why Choose Our Royalty Free Beats
          </h2>
          <p className="mt-4 text-lg leading-8 text-[var(--text-secondary)]">
            Everything you need to create your next hit song, completely hassle-free.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                    {feature.icon}
                </div>
              <h3 className="mt-5 text-lg font-medium leading-6 text-[var(--text-primary)]">{feature.title}</h3>
              <p className="mt-2 text-base text-[var(--text-secondary)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
