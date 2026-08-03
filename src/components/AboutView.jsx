import React from 'react';
import { BookOpen, Feather, ShieldCheck, Mail, Sparkles, Quote, Globe, Award } from 'lucide-react';

export default function AboutView() {
  const founderImage = "https://static.wixstatic.com/media/7c7af8_ed5c5ab58eb749838f02682382fc183c~mv2.jpg";

  return (
    <div className="py-16 bg-[#FAF8F4]">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Publisher Story Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/60 px-3.5 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-[#7A1F1A]" /> Independent UK Publisher Established 2013
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1612] leading-tight">
            Celebrating Authentic Literature & Indie Voices
          </h1>
          <p className="text-slate-600 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            GB Publishing is an independent UK publishing house dedicated to high-end literary craftsmanship, author-signed editions, and direct reader relationships across fiction, memoirs, culinary heritage, fine art, and children's picture books.
          </p>
        </div>

        {/* Founder & Managing Director Spotlight */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E2DDD6] shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 space-y-3 text-center">
            <div className="relative w-44 h-44 mx-auto rounded-2xl overflow-hidden border-2 border-[#C49A45] p-1.5 bg-amber-50 shadow-lg">
              <img 
                src={founderImage} 
                alt="George S Boughton — Founder & Managing Director" 
                className="w-full h-full object-cover object-top rounded-xl"
              />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1612]">George S Boughton</h3>
              <span className="text-xs font-bold text-[#7A1F1A] block uppercase tracking-wider mt-0.5">
                Founder & Managing Director
              </span>
              <span className="text-[11px] text-slate-500 font-sans block">BSc (Hons) MechE · Chartered Engineer</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4 text-slate-700 font-sans text-xs sm:text-sm leading-relaxed">
            <div className="inline-flex items-center gap-1 text-[#C49A45] font-serif italic text-base">
              <Quote className="w-5 h-5 opacity-80" />
              <span>"Books carry a distinct rhythm — when captured with care and published independently, they remain immortal."</span>
            </div>
            
            <p>
              Born to English parents in Eritrea and educated internationally in Rome, New York, and London, <strong>George S Boughton</strong> led an extensive expatriate career in international oilfield engineering (Shell and Creole Production Services), change management, and information technology before founding <strong>GB Publishing</strong> in the United Kingdom in 2013.
            </p>

            <p>
              His firsthand experiences working across remote areas and historical conflict zones served as the inspiration for his acclaimed memoirs and hard sci-fi works (<em>Black Gold - Black Scorpion</em>, <em>OutTack</em>, and <em>Dennis to Alice</em>), while instilling a core publishing philosophy: empowering indie authors with direct reader connections, transparent author royalties, and craftsman-quality production.
            </p>
          </div>
        </div>

        {/* Core Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD6] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-100/70 text-[#7A1F1A] rounded-xl flex items-center justify-center font-bold">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1612]">Author Direct First</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              We champion our authors with higher direct royalty margins and direct reader connections, bypassing traditional 3rd-party gatekeepers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD6] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-red-100/70 text-[#7A1F1A] rounded-xl flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1612]">Craftsmanship Quality</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Every book features hand-curated typography, bespoke cover designs, premium paper stocks, and optional hand-signed collector editions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2DDD6] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-100/70 text-[#2D7D46] rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1612]">Crisis & Charity Support</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Selected publications, including our emergency crisis appeal titles, donate up to 25% of proceeds directly to international relief funds.
            </p>
          </div>
        </div>

        {/* Submissions & Contact */}
        <div className="bg-white p-8 rounded-2xl border border-[#E2DDD6] shadow-sm space-y-4 text-center">
          <Mail className="w-10 h-10 text-[#7A1F1A] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#1A1612]">Author Submissions & Inquiries</h3>
          <p className="text-xs text-slate-600 font-sans max-w-lg mx-auto leading-relaxed">
            Are you an indie author or illustrator looking to publish? We welcome manuscript submissions for non-fiction memoirs, culinary heritage, children's picture books, fine art, and sci-fi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a 
              href="mailto:george@gbpublishing.org"
              className="bg-[#1C2B40] text-white px-6 py-2.5 rounded-xl font-sans font-bold text-xs hover:bg-[#263859] transition-colors"
            >
              Contact Editorial Team (george@gbpublishing.org)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
