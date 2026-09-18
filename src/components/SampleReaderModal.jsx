import React, { useState } from 'react';
import { X, BookOpen, Feather, ChevronLeft, ChevronRight, Image as ImageIcon, FileText } from 'lucide-react';

export default function SampleReaderModal({ book, onClose }) {
  if (!book) return null;

  const hasVisualPreview = book.previewPages && book.previewPages.length > 0;
  const [activeTab, setActiveTab] = useState(hasVisualPreview ? 'visual' : 'text');
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = hasVisualPreview ? book.previewPages.length : 0;

  const handlePrevPage = () => {
    setPageIndex(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setPageIndex(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className={`bg-[#FBF9F5] rounded-2xl w-full ${activeTab === 'visual' ? 'max-w-4xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5E0DA] relative my-6 p-6 md:p-8 transition-all`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded-full transition-colors"
          title="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6 pb-4 border-b border-[#E5E0DA]">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/60 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5" /> Book Preview & Look Inside
            </span>
            {hasVisualPreview && (
              <div className="inline-flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('visual')}
                  className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${activeTab === 'visual' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <ImageIcon className="w-3 h-3" /> Visual Pages
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all ${activeTab === 'text' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <FileText className="w-3 h-3" /> Synopsis
                </button>
              </div>
            )}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">{book.title}</h2>
          <p className="font-serif italic text-slate-600 text-xs sm:text-sm">By {book.author}</p>
        </div>

        {/* Visual Preview Mode */}
        {activeTab === 'visual' && hasVisualPreview ? (
          <div className="space-y-4">
            <div className="relative bg-stone-900/5 rounded-2xl p-2 sm:p-4 border border-[#E5E0DA] flex items-center justify-center min-h-[420px] max-h-[650px] overflow-hidden group">
              <img 
                src={book.previewPages[pageIndex]} 
                alt={`Page ${pageIndex + 1}`}
                className="max-h-[580px] w-auto max-w-full object-contain mx-auto rounded-lg shadow-xl" 
              />

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrevPage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextPage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Page Number Pill */}
              <span className="absolute bottom-3 right-4 bg-stone-900/80 text-white text-xs font-sans px-3 py-1 rounded-full shadow">
                Page {pageIndex + 1} of {totalPages}
              </span>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
              {book.previewPages.map((pageUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setPageIndex(idx)}
                  className={`w-12 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${pageIndex === idx ? 'border-[#7A1F1A] scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                >
                  <img src={pageUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Text Excerpt Mode */
          <div className="prose prose-slate max-w-none font-serif text-base sm:text-lg leading-[1.9] text-[#1A1612] space-y-6 max-h-[500px] overflow-y-auto pr-2">
            <p className="first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#7A1F1A] first-letter:mr-3 first-letter:leading-none">
              {book.description.slice(0, 300) || "The quiet stillness of the publishing house harbored stories waiting to be told across every page."}
            </p>

            <blockquote className="border-l-4 border-[#7A1F1A] pl-4 italic text-slate-700 bg-amber-50/50 py-3 pr-2 my-6 rounded-r-lg font-serif">
              "{book.tagline || 'To hold a book published directly from its creators is to share in the raw passion of literature.'}"
            </blockquote>

            <p>
              {book.description.slice(300, 900) || "Explore the complete publication directly through GB Publishing for select author signed copies, direct author support, and fast UK delivery."}
            </p>
          </div>
        )}

        {/* Modal Footer CTA */}
        <div className="mt-8 pt-4 border-t border-[#E5E0DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Feather className="w-4 h-4 text-[#C49A45]" />
            <span>Enjoyed this preview? Order the full edition directly from the publisher!</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-6 py-2.5 rounded-xl font-sans text-xs font-bold transition-colors shadow-sm"
          >
            Return to Book Options
          </button>
        </div>

      </div>
    </div>
  );
}
