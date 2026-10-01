import React from 'react';
import { BookOpen, Leaf, Compass, Feather, Smile, Palette, ArrowRight, Sparkles } from 'lucide-react';

export default function GenreGrid({ onSelectCategory }) {
  const genres = [
    {
      id: "Non-Fiction",
      name: "Non-Fiction",
      count: "13 Titles",
      desc: "Botany, world culinary heritage, veterinary memoirs, Biafran war history & true accounts.",
      bg: "from-[#8C2520] to-[#5C1613]",
      accent: "text-red-200",
      icon: <BookOpen className="w-7 h-7 text-red-200" />
    },
    {
      id: "Nature & Biodiversity",
      name: "Nature & Biodiversity",
      count: "5 Titles",
      desc: "Endangered wildlife conservation, official Sky TV rewilding companion & botanical ecology.",
      bg: "from-[#1B4332] to-[#081C15]",
      accent: "text-emerald-300",
      icon: <Leaf className="w-7 h-7 text-emerald-300" />
    },
    {
      id: "Autobiography & Memoir",
      name: "Autobiography & Memoir",
      count: "5 Titles",
      desc: "Heroic seafaring tall ships, Cold War espionage, motorcycle journeys & veterinary life.",
      bg: "from-[#2A3B5C] to-[#141E30]",
      accent: "text-cyan-200",
      icon: <Compass className="w-7 h-7 text-cyan-200" />
    },
    {
      id: "Poetry & Politics",
      name: "Poetry & Politics",
      count: "Curated Verse",
      desc: "Moving verse reflections, reflective poetry collections & thought-provoking commentary.",
      bg: "from-[#4A1E3E] to-[#2B0E23]",
      accent: "text-purple-300",
      icon: <Palette className="w-7 h-7 text-purple-300" />
    },
    {
      id: "Children's & Picture Books",
      name: "Children's & Picture Books",
      count: "10 Titles",
      desc: "Delightful illustrated tales for young readers, Sam Widges, Erin & rescue dog adventures.",
      bg: "from-[#1C3A27] to-[#0E2015]",
      accent: "text-emerald-300",
      icon: <Smile className="w-7 h-7 text-emerald-300" />
    },
    {
      id: "Fiction, Young Adult & Sci-Fi",
      name: "Fiction, Young Adult & Sci-Fi",
      count: "13 Titles",
      desc: "Epic mythological fantasy, space opera sagas, psychological thrillers & young adult fiction.",
      bg: "from-[#1D2A44] to-[#121A29]",
      accent: "text-amber-300",
      icon: <Feather className="w-7 h-7 text-amber-300" />
    },
    {
      id: "Adult Sci-Fi",
      name: "Adult Sci-Fi",
      count: "3 Titles",
      desc: "Dark, provocative science fiction, psychological thrillers & deep space odysseys.",
      bg: "from-[#0F172A] to-[#020617]",
      accent: "text-violet-300",
      icon: <Sparkles className="w-7 h-7 text-violet-300" />
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
