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
    <div className="py-12 bg-[#FBF9F5]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C2520] uppercase tracking-widest bg-red-100 px-3.5 py-1 rounded-full">
            <Palette className="w-4 h-4" /> Fine Art & Illustration Imprint
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            GB Publishing Fine Art Gallery
          </h1>
          <p className="text-slate-600 font-sans text-base leading-relaxed">
            Discover original oil paintings, fine art coffee-table collections, and bespoke book illustrations by Wendy Kimberley BEM & Lois Collins.
          </p>
        </div>

        {/* Masonry / Grid of Art Pieces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artItems.map((art) => (
            <div 
              key={art.id}
              className="bg-white rounded-2xl border border-[#E5E0DA] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="p-4 space-y-4">
                <div 
                  onClick={() => setSelectedArt(art)}
                  className="relative overflow-hidden rounded-xl bg-slate-100 cursor-pointer group"
                >
                  <img 
                    src={art.coverImage} 
                    alt={art.title} 
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-4 h-4 text-[#8C2520]" />
                      Full Screen Preview
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#D4A359] uppercase tracking-wider block">
                    Artist: {art.author}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans line-clamp-2">
                    {art.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="font-serif text-2xl font-bold text-[#8C2520]">
                  £{art.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => onAddToCart(art)}
                  className="bg-[#8C2520] hover:bg-[#A62D27] text-white px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Direct</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {selectedArt && (
        <div className="modal-backdrop" onClick={() => setSelectedArt(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative m-4 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedArt(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <img src={selectedArt.coverImage} alt={selectedArt.title} className="w-full max-h-[70vh] object-contain rounded-xl" />

            <div className="flex justify-between items-center pt-2">
              <div>
                <h3 className="font-serif text-2xl font-bold">{selectedArt.title}</h3>
                <p className="text-xs text-slate-600 font-semibold">Artist: {selectedArt.author}</p>
              </div>
              <button 
                onClick={() => { onAddToCart(selectedArt); setSelectedArt(null); }}
                className="bg-[#8C2520] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
              >
                Purchase Direct — £{selectedArt.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
