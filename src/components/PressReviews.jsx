import React from 'react';
import { Quote, Star, Award } from 'lucide-react';

export default function PressReviews() {
  const reviews = [
    {
      publication: "Gourmand World Cookbook Awards",
      quote: "Winner of Best Culinary Book — Özlem's Turkish Table is a timeless masterpiece of Turkish culture, passion, and traditional gastronomy.",
      rating: 5,
      book: "Özlem's Turkish Table"
    },
    {
      publication: "Surrey Life Magazine",
      quote: "GB Publishing brings remarkable indie voices into the light. Richly illustrated and produced with genuine craftsman quality.",
      rating: 5,
      book: "Publisher Showcase"
    },
    {
      publication: "The Literary Review &TLS",
      quote: "Captivating memoirs and fine art picture books that stand apart in an era of mass-market commercial publishing.",
      rating: 5,
      book: "Indie Catalogue"
    }
  ];

  return (
    <section className="py-16 bg-[#1D2A44] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full mb-3">
            <Award className="w-4 h-4 text-amber-400" /> Critical Acclaim & Praise
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-50">
            What Critics & Readers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-7 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#D4A359] opacity-80" />
                <p className="font-serif italic text-base text-slate-200 leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-end">
                <div>
                  <span className="font-sans font-bold text-sm text-amber-300 block">{rev.publication}</span>
                  <span className="text-xs text-slate-400">Featured in {rev.book}</span>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
