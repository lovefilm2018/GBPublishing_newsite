import React, { useState } from 'react';
import { X, ShoppingBag, Bookmark, Feather, Truck, ShieldCheck, ChevronDown, BookOpen, Star, Share2 } from 'lucide-react';

export default function BookModal({ book, onClose, onAddToCart, onOpenExcerpt, relatedBooks, onSelectBook }) {
  if (!book) return null;

  const [activeImage, setActiveImage] = useState(book.coverImage);
  const [selectedFormat, setSelectedFormat] = useState(book.format || "Paperback");
  const [showExternalRetailers, setShowExternalRetailers] = useState(false);
  const [copied, setCopied] = useState(false);

  const images = book.gallery && book.gallery.length > 0 ? [book.coverImage, ...book.gallery] : [book.coverImage];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Gallery & Cover */}
            <div className="md:col-span-5 space-y-4">
              <div className="book-cover-wrap relative bg-[#FBF9F5] p-4 rounded-xl border border-slate-200">
                <img 
                  src={activeImage} 
                  alt={book.title} 
                  className="book-cover w-full max-h-[380px] object-contain mx-auto rounded-lg shadow-xl"
                />
                <div className="book-spine-effect" />
                {book.ribbon && (
                  <span className="absolute top-6 right-6 ribbon-badge ribbon-gold shadow-md">
                    {book.ribbon}
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-[#8C2520] scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Sample Excerpt Lightbox Trigger */}
              <button 
                onClick={() => onOpenExcerpt(book)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8C2520] border border-amber-200 font-sans text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#8C2520]" />
                <span>Read Sample Chapter / Excerpt</span>
              </button>
            </div>

            {/* Right Column: Book Metadata & Buy Direct Action */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Category & Format Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[#8C2520] uppercase tracking-wider">
                    {book.categories.join(' · ')}
                  </span>
                  <button 
                    onClick={handleShare}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copied ? 'Copied Link!' : 'Share'}
                  </button>
                </div>

                <h1 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
                  {book.title}
                </h1>
                
                <p className="text-sm text-slate-600 font-sans font-semibold mt-1">
                  Published by GB Publishing · Author: <span className="text-slate-900 underline">{book.author}</span>
                </p>
              </div>

              {/* Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold font-sans text-slate-700 uppercase tracking-wide">
                  Select Format:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Paperback', 'Hardcover', 'Signed Edition'].map((fmt) => (
                    <button 
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold font-sans border text-center transition-all ${selectedFormat === fmt ? 'border-[#8C2520] bg-red-50 text-[#8C2520] shadow-sm' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E5E0DA] space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block font-sans">Direct Publisher Price</span>
                    <span className="font-serif text-3xl font-bold text-[#8C2520]">
                      £{book.price.toFixed(2)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-sm text-slate-400 line-through ml-2">
                        £{book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="bg-[#EAF5ED] text-[#2D7D46] border border-green-200 text-xs font-bold px-3 py-1 rounded-full">
                    ✨ Direct Purchase Guarantee
                  </span>
                </div>

                {/* Primary CTA */}
                <button 
                  onClick={() => { onAddToCart({ ...book, selectedFormat }); onClose(); }}
                  className="w-full bg-[#8C2520] hover:bg-[#A62D27] text-white py-3.5 px-6 rounded-xl font-sans text-base font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>BUY DIRECT FROM GBP — £{book.price.toFixed(2)}</span>
                </button>

                {/* D2C Incentives Bar */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-2 border-t border-slate-200/70">
                  <span className="flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-[#8C2520]" /> Free Bookmark Included</span>
                  <span className="flex items-center gap-1.5"><Feather className="w-4 h-4 text-[#D4A359]" /> Signed Copy Available</span>
                  <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#1D2A44]" /> Free UK Delivery £25+</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Direct Author Support</span>
                </div>
              </div>

              {/* Collapsed External Retailers Section */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setShowExternalRetailers(!showExternalRetailers)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
                >
                  <span>Also Available From External Retailers</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showExternalRetailers ? 'rotate-180' : ''}`} />
                </button>

                {showExternalRetailers && (
                  <div className="p-4 bg-white space-y-2 text-xs text-slate-600 border-t border-slate-200">
                    <p className="italic text-slate-500 mb-2">
                      Note: Ordering directly from GB Publishing includes custom bookmarks, signed copies, and direct author royalties.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <a href="https://www.amazon.co.uk" target="_blank" rel="noreferrer" className="p-2 border rounded text-center hover:bg-slate-50 text-slate-800 font-medium">Amazon UK</a>
                      <a href="https://www.waterstones.com" target="_blank" rel="noreferrer" className="p-2 border rounded text-center hover:bg-slate-50 text-slate-800 font-medium">Waterstones</a>
                      <a href="https://www.blackwells.co.uk" target="_blank" rel="noreferrer" className="p-2 border rounded text-center hover:bg-slate-50 text-slate-800 font-medium">Blackwell's</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Synopsis & Details */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-slate-900">Synopsis</h3>
                <p className="text-sm text-slate-700 font-sans leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Book Metadata Footer */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs text-slate-500">
                <div>
                  <span className="font-semibold block text-slate-700">ISBN / SKU</span>
                  <span>{book.sku}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-700">Publisher</span>
                  <span>GB Publishing UK</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-700">Dispatch</span>
                  <span>1-2 Working Days</span>
                </div>
              </div>

            </div>

          </div>

          {/* Related Titles Carousel */}
          {relatedBooks && relatedBooks.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">
                You May Also Enjoy
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedBooks.slice(0, 4).map((rel) => (
                  <div 
                    key={rel.id}
                    onClick={() => onSelectBook(rel)}
                    className="p-3 border rounded-xl hover:shadow-md cursor-pointer transition-shadow bg-slate-50"
                  >
                    <img src={rel.coverImage} alt={rel.title} className="w-full h-32 object-cover rounded mb-2" />
                    <h4 className="font-serif text-xs font-bold line-clamp-1 text-slate-900">{rel.title}</h4>
                    <p className="text-[11px] text-slate-500">£{rel.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
