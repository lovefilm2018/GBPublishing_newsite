import React from 'react';
import { BookOpen, Utensils, Smile, Palette, Compass, ArrowRight } from 'lucide-react';

export default function GenreGrid({ onSelectCategory }) {
  const genres = [
    {
      id: "Fiction, YA & Sci-Fi",
      name: "Fiction, YA & Sci-Fi",
      count: "25+ Titles",
      desc: "Captivating novels, imaginative sci-fi sagas, and gripping young adult stories.",
      bg: "from-[#1D2A44] to-[#121A29]",
      accent: "text-amber-300",
      icon: <Compass className="w-7 h-7 text-amber-300" />
    },
    {
      id: "Non-Fiction & Memoir",
      name: "Non-Fiction & Memoir",
      count: "20+ Titles",
      desc: "Inspiring life stories, veterinary memoirs, historical accounts & emergency crisis appeals.",
      bg: "from-[#8C2520] to-[#5C1613]",
      accent: "text-red-200",
      icon: <BookOpen className="w-7 h-7 text-red-200" />
    },
    {
      id: "Cookbooks & Food",
      name: "Cookbooks & Food",
      count: "15+ Titles",
      desc: "Award-winning Turkish recipes by Özlem Warren & astrological date-night dining.",
      bg: "from-[#3A2410] to-[#211408]",
      accent: "text-amber-400",
      icon: <Utensils className="w-7 h-7 text-amber-400" />
    },
    {
      id: "Children's & Picture Books",
      name: "Children's & Picture Books",
      count: "20+ Titles",
      desc: "Delightful illustrated tales for young readers, Sam Widges, Erin & Cloud Kingdoms.",
      bg: "from-[#1C3A27] to-[#0E2015]",
      accent: "text-emerald-300",
      icon: <Smile className="w-7 h-7 text-emerald-300" />
    },
    {
      id: "Poetry & Fine Art",
      name: "Poetry & Fine Art",
      count: "15+ Titles",
      desc: "Stunning fine art coffee-table collections by Wendy Kimberley BEM & Lois Collins.",
      bg: "from-[#2A1C3A] to-[#160E21]",
      accent: "text-purple-300",
      icon: <Palette className="w-7 h-7 text-purple-300" />
    }
  ];

  return (
    <section className="py-16 bg-[#FBF9F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[#8C2520] font-sans font-bold text-xs uppercase tracking-widest block mb-1">
              EXPLORE OUR IMPRINTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Browse by Genre & Collection
            </h2>
          </div>
          <p className="text-slate-600 font-sans text-sm max-w-md mt-2 md:mt-0">
            Every genre is curated directly by our publishing editorial team to bring you authentic indie voices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectCategory(genre.id)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${genre.bg} p-7 text-white shadow-md hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1.5`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                  {genre.icon}
                </div>
                <span className="text-xs font-sans font-bold bg-white/15 px-3 py-1 rounded-full text-slate-200">
                  {genre.count}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold mb-2 group-hover:text-amber-200 transition-colors">
                {genre.name}
              </h3>
              
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                {genre.desc}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold font-sans text-amber-300 group-hover:translate-x-1 transition-transform">
                <span>Explore Titles</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
