import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Star, BookOpen } from 'lucide-react';

export default function Hero({ featuredBook, onSelectBook, onExploreClick }) {
  if (!featuredBook) return null;

  return (
    <section className="relative bg-gradient-to-b from-[#1D2A44] via-[#162137] to-[#121A29] text-white py-16 lg:py-24 overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A359_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Direct CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#8C2520]/80 border border-[#D4A359]/30 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Independent UK Book Publishing House</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.15] text-amber-50">
              Independent Stories, <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent italic">
                Beautifully Crafted.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Welcome to the direct storefront of GB Publishing. By ordering direct from us, you receive author-signed collector copies, exclusive bookmarks, and help ensure 100% of proceeds support our indie authors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button 
                onClick={onExploreClick}
                className="w-full sm:w-auto bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-7 py-3.5 rounded-xl font-sans font-bold text-base shadow-xl shadow-red-950/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Browse Full Catalogue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => onSelectBook(featuredBook)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-200/30 px-6 py-3.5 rounded-xl font-sans font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-amber-300" />
                <span className="truncate max-w-[220px] inline-block align-bottom">Featured Release: {featuredBook.title}</span>
              </button>
            </div>

            {/* Direct Trust Badges */}
            <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left text-xs text-slate-300">
              <div>
                <span className="font-bold text-amber-300 block text-sm">100+</span>
                <span>Indie Titles</span>
              </div>
              <div>
                <span className="font-bold text-amber-300 block text-sm">100%</span>
                <span>Direct Guarantee</span>
              </div>
              <div>
                <span className="font-bold text-amber-300 block text-sm">Free</span>
                <span>Bookmark Included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Book 3D Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              {/* Glow backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#7A1F1A] to-[#C49A45] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              
              <div className="relative bg-[#1A253A] border border-amber-300/30 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider truncate">
                    {featuredBook.ribbon || "FEATURED BESTSELLER"}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-400/20 truncate">
                    {featuredBook.categories?.[0] || "Publisher Select"}
                  </span>
                </div>

                {/* 3D Book Cover */}
                <div 
                  onClick={() => onSelectBook(featuredBook)}
                  className="book-cover-wrap cursor-pointer bg-[#0F1626] h-80 rounded-xl p-3 flex items-center justify-center border border-slate-700/60 overflow-hidden"
                >
                  <img 
                    src={featuredBook.coverImage} 
                    alt={featuredBook.title}
                    className="max-h-full max-w-full object-contain rounded shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="book-spine-effect" />
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="font-serif text-2xl font-bold text-amber-50 line-clamp-1">
                    {featuredBook.title}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-sans font-medium">
                    By {featuredBook.author}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <div>
                    <span className="text-xs text-slate-400 block">Direct Price</span>
                    <span className="font-serif text-2xl font-bold text-amber-300">
                      £{featuredBook.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => onSelectBook(featuredBook)}
                    className="bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
