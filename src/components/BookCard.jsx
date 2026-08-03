import React from 'react';
import { ShoppingBag, Eye, Feather, Sparkles } from 'lucide-react';

export default function BookCard({ book, onSelectBook, onAddToCart }) {
  const isSigned = book.isSigned;
  const ribbonText = book.ribbon;

  return (
    <div className="book-card group bg-white border border-[#E5E0DA] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div className="p-4 space-y-4">
        {/* Book Cover Container with 3D Effect */}
        <div 
          onClick={() => onSelectBook(book)}
          className="book-cover-wrap cursor-pointer relative bg-[#F2EDE7] h-72 rounded-xl p-2 flex items-center justify-center border border-slate-200/60 overflow-hidden"
        >
          <img 
            src={book.coverImage} 
            alt={book.title} 
            loading="lazy"
            className="max-h-full max-w-full object-contain rounded shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="book-spine-effect" />

          {/* Ribbon Badge Overlay */}
          {ribbonText && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className={`ribbon-badge ${isSigned ? 'ribbon-gold' : 'ribbon-burgundy'} shadow-md`}>
                {isSigned && <Feather className="w-3 h-3" />}
                {ribbonText}
              </span>
            </div>
          )}

          {/* Quick Hover Quick-View Button */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-sans shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-4 h-4 text-[#7A1F1A]" />
              Quick View
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans font-medium">
            <span className="truncate">{book.categories[0] || "Publication"}</span>
          </div>

          <h3 
            onClick={() => onSelectBook(book)}
            className="font-serif text-lg font-medium text-slate-900 group-hover:text-[#7A1F1A] transition-colors line-clamp-2 leading-snug cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="text-xs text-slate-600 font-sans font-medium line-clamp-1">
            By <span className="text-slate-800">{book.author}</span>
          </p>
        </div>
      </div>

      {/* Footer & Direct Buy Action */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-baseline justify-between pt-2 border-t border-[#E5E0DA]/80">
          <div>
            <span className="font-serif text-xl font-bold text-slate-900">
              £{book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-slate-400 line-through ml-2">
                £{book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#2D7D46] bg-[#EAF5ED] px-2 py-0.5 rounded">
            In Stock
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => onAddToCart(book)}
            className="w-full bg-[#7A1F1A] hover:bg-[#8C2520] text-white py-2.5 px-3 rounded-xl font-sans text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
