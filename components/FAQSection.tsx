'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Which Pokémon are in the first LEGO wave?',
    answer:
      'The launch lineup includes Pikachu, Eevee, the Kanto Starters (Charizard, Blastoise, Venusaur), and an interactive Poké Ball.',
  },
  {
    question: 'What is the Lego Pokémon Treasure Hunt?',
    answer:
      'It is a contest where fans can win exclusive sets by finding hidden golden bricks in sets. Stay tuned to BrickMon for clues.',
  },
  {
    question: 'When does the Lego Pokémon Kanto set release?',
    answer:
      'The release date is rumored for mid-2026, though official confirmation from Lego and The Pokémon Company is still pending. We\'ll update this tracker as soon as official dates are announced.',
  },
  {
    question: 'How much will the Lego Pikachu cost?',
    answer:
      'Retail price is expected to be $99.99 for the life-size Pikachu set, based on similar Lego buildable figure releases. Prices may vary by retailer and region.',
  },
  {
    question: 'Is BrickMon affiliated with Lego?',
    answer:
      'No, we are a free community tracker and are not affiliated with Lego, The Pokémon Company, or any retailers. BrickMon is an independent service helping fans track stock and avoid scalper prices.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate JSON-LD structured data for FAQ
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="border-t border-slate-800 bg-slate-900/30 px-4 py-16 sm:px-6 lg:px-8">
      {/* JSON-LD Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 transition-all hover:border-slate-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h3 className="pr-8 text-lg font-semibold text-white">{faq.question}</h3>
                <span className="flex-shrink-0 text-2xl text-slate-400 transition-transform">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="border-t border-slate-800 px-6 pb-6 pt-4">
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
