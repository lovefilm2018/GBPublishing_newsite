import React, { useState } from 'react';
import { Palette, Eye, ShoppingBag, Sparkles, X } from 'lucide-react';

export default function ArtGalleryView({ catalog, onAddToCart }) {
  const [selectedArt, setSelectedArt] = useState(null);

  // Filter art items from catalog
  const artItems = catalog.filter(item => 
    item.categories.includes("Poetry & Fine Art") || 
    item.author.includes("Wendy Kimberley") || 
    item.author.includes("Lois Collins") ||
    item.title.toLowerCase().includes("art") ||
    item.title.toLowerCase().includes("painting")
  );

  return (
    <div className="py-16 bg-[#121824] text-white min-h-[85vh]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full">
            <Palette className="w-4 h-4 text-amber-400" /> Fine Art & Illustration Imprint
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-amber-50">
            GB Publishing Fine Art Gallery
          </h1>
          <p className="text-slate-300 font-sans text-base leading-relaxed max-w-2xl mx-auto">
            Discover original oil paintings, fine art coffee-table collections, and bespoke book illustrations by Wendy Kimberley BEM & Lois Collins.
          </p>
        </div>

        {/* Floating Dark Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artItems.map((art) => (
            <div 
              key={art.id}
              className="bg-[#1C2638] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div 
                  onClick={() => setSelectedArt(art)}
                  className="relative overflow-hidden rounded-xl bg-[#0F141F] h-80 p-3 flex items-center justify-center cursor-pointer group border border-slate-800"
                >
                  <img 
                    src={art.coverImage} 
                    alt={art.title} 
                    className="max-h-full max-w-full object-contain rounded group-hover:scale-105 transition-transform duration-500 shadow-xl"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4 text-[#7A1F1A]" />
                      Full Screen Preview
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-serif italic text-sm text-[#C49A45] block">
                    Artist: {art.author}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-amber-50 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-700/50 flex items-center justify-between mt-2">
                <span className="font-serif text-2xl font-bold text-amber-300">
                  £{art.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => onAddToCart(art)}
                  className="bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-4 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Direct</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Lightbox Preview Modal */}
      {selectedArt && (
        <div className="modal-backdrop bg-black/85 backdrop-blur-md" onClick={() => setSelectedArt(null)}>
          <div className="bg-[#161F2E] border border-slate-700 rounded-2xl max-w-4xl w-full p-6 relative m-4 shadow-2xl space-y-4 text-white" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-[#0B0F17] p-4 rounded-xl flex items-center justify-center max-h-[65vh]">
              <img src={selectedArt.coverImage} alt={selectedArt.title} className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-700">
              <div>
                <span className="font-serif italic text-sm text-[#C49A45] block">Artist: {selectedArt.author}</span>
                <h3 className="font-serif text-2xl font-bold text-amber-50">{selectedArt.title}</h3>
              </div>
              <button 
                onClick={() => { onAddToCart(selectedArt); setSelectedArt(null); }}
                className="bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Purchase Direct — £{selectedArt.price.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
