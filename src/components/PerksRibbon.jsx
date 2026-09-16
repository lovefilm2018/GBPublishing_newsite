import React from 'react';
import { Feather, Truck, HeartHandshake, BookOpen, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

export default function PerksRibbon() {
  const pillars = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#7A1F1A]" />,
      title: "Support Local Publishers",
      desc: "Sustain an independent UK publishing house dedicated to championing unique voices, fine art literature, and extraordinary stories."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#2D7D46]" />,
      title: "Direct Author Royalties",
      desc: "Unlike corporate retailers who take up to 60% in distributor margins, buying direct ensures fair, meaningful earnings flow straight to authors."
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#1C2B40]" />,
      title: "Fund Local Author Events",
      desc: "Direct sales help sponsor book signings, school visits, culinary talks, literary festivals, and charitable causes across the UK."
    },
    {
      icon: <Feather className="w-6 h-6 text-[#D4A359]" />,
      title: "Many Books Signed by Authors",
      desc: "Many titles in our catalogue are available hand-signed by the author — look for the signed badge on our featured editions."
    }
  ];

  return (
    <section id="why-buy-direct" className="bg-[#F8F5F0] border-y border-[#E5E0DA] py-12">
      <div id="perks" className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/70 border border-red-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#7A1F1A]" />
            <span>The Independent Advantage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Why Purchase Direct from GB Publishing?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
            When you purchase directly from an indie press, every book you buy creates a meaningful difference for local literature, authors, and communities.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="flex flex-col p-6 rounded-2xl bg-white border border-[#E5E0DA]/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit mb-4 group-hover:scale-105 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg mb-1.5">
                {pillar.title}
              </h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance Footer Banner */}
        <div className="mt-8 pt-6 border-t border-[#E5E0DA]/70 flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#1C2B40]" /> Free UK tracked delivery on orders £25+
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Secure Direct Checkout
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Feather className="w-4 h-4 text-[#D4A359]" /> Dispatched directly from publisher warehouse
          </span>
        </div>

      </div>
    </section>
  );
}
