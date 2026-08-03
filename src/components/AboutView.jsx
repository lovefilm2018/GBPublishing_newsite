import React from 'react';
import { BookOpen, Feather, ShieldCheck, Mail, Sparkles, Quote, Heart, Award, CheckCircle2 } from 'lucide-react';
import gbImage from '../assets/GBImage.avif';
import SocialLinks from './SocialLinks';

export default function AboutView() {
  const charityPledges = [
    {
      title: "Özlem's Turkish Table",
      author: "Özlem Warren",
      charity: "Turkey Mozaik Foundation (Earthquake Relief)",
      detail: "Over £9,000 ($11,000) in total sales donated directly to earthquake relief operations in Turkey.",
      badge: "Gourmand Award Winner"
    },
    {
      title: "Erin and the Mouse",
      author: "Clare Latham",
      charity: "SpecialEffect",
      detail: "100% of proceeds donated to assist physically disabled children, inspired by real-life Erin.",
      badge: "Children's Charity"
    },
    {
      title: "You are Noah! Series",
      author: "Hein Prinsloo Curson",
      charity: "The Noah's Ark Foundation",
      detail: "Proceeds support global wildlife conservation and saving endangered species from extinction.",
      badge: "Wildlife Conservation"
    },
    {
      title: "Dennis to Alice",
      author: "George S Boughton",
      charity: "The Noah's Ark Foundation",
      detail: "Author proceeds donated to river habitat preservation and wild species conservation.",
      badge: "Nature & Environment"
    },
    {
      title: "Little Tommy & Kingdom of Clouds",
      author: "Solonair",
      charity: "Ukraine Disaster Relief",
      detail: "100% of author proceeds donated directly to Ukraine emergency rescue and relief operations.",
      badge: "Crisis Relief"
    },
    {
      title: "Tulsi and the Tiger",
      author: "Dr Chet Trivedy",
      charity: "The Tulsi Foundation",
      detail: "All proceeds support frontline ranger healthcare across 14 tiger reserves in India.",
      badge: "Tiger Conservation"
    }
  ];

  return (
    <div className="py-16 bg-[#FAF8F4] text-[#1A1612]">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Page Title & Mission Badge */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/60 border border-red-200 px-3.5 py-1 rounded-full">
            <Sparkles className="w-4 h-4 text-[#7A1F1A]" /> Independent UK Publisher · Founded 2013 · Surrey, UK
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1612] leading-tight">
            Our Story & Global Mission
          </h1>
          <p className="text-slate-600 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            GB Publishing is an independent publishing house dedicated to bringing extraordinary voices, fine art literature, and impactful stories to readers worldwide.
          </p>
        </div>

        {/* Founder & CEO Bio Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-4 text-center">
            <div className="relative inline-block">
              <img 
                src={gbImage} 
                alt="George S Boughton - Founder & CEO" 
                className="w-44 h-56 object-cover rounded-2xl shadow-xl border-4 border-amber-100 mx-auto"
              />
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#7A1F1A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                Founder & Publisher
              </span>
            </div>

            <div className="pt-2">
              <h3 className="font-serif text-2xl font-bold text-[#1A1612]">George S Boughton</h3>
              <span className="text-xs font-bold text-[#7A1F1A] block uppercase tracking-wider mt-0.5">
                Founder & CEO · GB Publishing
              </span>
              <span className="text-[11px] text-slate-500 font-sans block mt-0.5">Chartered Engineer (MIMechE) · Author & Publisher</span>
            </div>

            <div className="pt-2 flex justify-center">
              <SocialLinks />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-slate-700 font-sans text-xs sm:text-sm leading-relaxed">
            <div className="inline-flex items-center gap-1.5 text-[#C49A45] font-serif italic text-base">
              <Quote className="w-5 h-5 opacity-80" />
              <span>"A book is for life — its life is in perpetuity, not the print life of a mere two years."</span>
            </div>
            
            <p>
              Born in Eritrea to English parents, <strong>George S Boughton</strong> grew up across Rome, New York, and the UK. Before establishing GB Publishing in Surrey in 2013, his global engineering career spanned landmark international assignments:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 pl-3 border-l-2 border-[#C49A45]">
              <li>• <strong>Shell</strong>: Oil exploration in Nigeria (during the Biafran War) & Brent North Sea platform designs.</li>
              <li>• <strong>Creole Production Services</strong>: Operations in London and Kuwait (during the Iran-Iraq & Gulf wars).</li>
              <li>• <strong>The Nichols Group & Azeus Systems</strong>: IT & change management across Hong Kong and South Africa.</li>
            </ul>

            <p>
              Now based in Surrey, his deep passion for nature, art, and storytelling drives GB Publishing's commitment to craftsman-quality books and author-first publishing.
            </p>
          </div>
        </div>

        {/* Core Philosophy Section */}
        <div className="bg-[#1C2B40] text-white p-8 md:p-10 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-amber-300 font-sans font-bold text-xs uppercase tracking-widest block">
              OUR PUBLISHING PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-50">
              Keeping the Reading Word Alive
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
            <p>
              The self-publishing boom has made book publishing bigger than ever — with over 1 million new releases globally each year. While this explosion of writing reflects an incredible human appetite to tell stories, the volume of new releases is simply overwhelming traditional review channels and bookstore buyers.
            </p>
            <p>
              At GB Publishing, keeping the reading word and the creativity of minds alive despite these challenges is what drives everything we do. We believe authors and illustrators hold the key to connecting directly with readers — for they alone can speak to the heart of what their story is all about.
            </p>
            <p className="text-amber-200 italic font-serif text-base border-t border-slate-700/60 pt-4">
              "We only publish authors and illustrators of exceptional talent. In April 2022, we celebrated this at the Riverhouse Barn Arts Centre in Surrey with an exhibition of original Cover Art Prints alongside our titles — proving that fine books are true works of art."
            </p>
          </div>
        </div>

        {/* Charity & Humanitarian Support Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#7A1F1A] font-sans font-bold text-xs uppercase tracking-widest block">
              HUMANITARIAN & CONSERVATION PLEDGES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1612]">
              Books Supporting Global Causes
            </h2>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              We are proud to publish authors who pledge their book proceeds to earthquake relief, wildlife conservation, disabled children's care, and crisis operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charityPledges.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E2DDD6] shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold text-[#7A1F1A] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <Heart className="w-4 h-4 text-[#7A1F1A]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1A1612]">{item.title}</h3>
                  <span className="text-xs font-semibold text-slate-600 block">By {item.author}</span>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed pt-1 border-t border-slate-100">
                    {item.detail}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Beneficiaries: {item.charity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact & Submissions */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E2DDD6] shadow-sm text-center space-y-4">
          <Mail className="w-10 h-10 text-[#7A1F1A] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#1A1612]">Contact GB Publishing</h3>
          <p className="text-xs text-slate-600 font-sans max-w-lg mx-auto leading-relaxed">
            Whether you are a reader, reviewer, book trade representative, or an author with a manuscript, we welcome hearing from you.
          </p>
          <div className="pt-2">
            <a 
              href="mailto:george@gbpublishing.org"
              className="inline-block bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-8 py-3 rounded-xl font-sans font-bold text-xs transition-colors shadow-md"
            >
              Contact George S Boughton (george@gbpublishing.org)
            </a>
          </div>
          <p className="text-[11px] text-slate-400 font-sans pt-2">
            GB Publishing · Surrey, United Kingdom
          </p>
        </div>

      </div>
    </div>
  );
}
