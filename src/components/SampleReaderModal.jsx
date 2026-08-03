import React from 'react';
import { X, BookOpen, Feather } from 'lucide-react';

export default function SampleReaderModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="bg-[#FBF9F5] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E5E0DA] relative my-8 p-6 md:p-10">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-200/60 hover:bg-slate-300 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-8 pb-6 border-b border-[#E5E0DA]">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/60 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" /> Sample Chapter Excerpt
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">{book.title}</h2>
          <p className="font-serif italic text-slate-600 text-sm">By {book.author}</p>
        </div>

        {/* Excerpt Body Styled like classic paper book */}
        <div className="prose prose-slate max-w-none font-serif text-base sm:text-lg leading-[1.9] text-[#1A1612] space-y-6">
          <p className="first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#7A1F1A] first-letter:mr-3 first-letter:leading-none">
            {book.description.slice(0, 300) || "The quiet stillness of the publishing house harbored stories waiting to be told across every page."}
          </p>

          <p>
            "Words carry a distinct rhythm," wrote {book.author}. "When captured with care and published independently, they remain immortal."
          </p>

          <blockquote className="border-l-4 border-[#7A1F1A] pl-4 italic text-slate-700 bg-amber-50/50 py-3 pr-2 my-6 rounded-r-lg font-serif">
            "To hold a book published directly from its creators is to share in the raw passion of literature."
          </blockquote>

          <p>
            {book.description.slice(300, 700) || "Explore the complete publication directly through GB Publishing for author signed copies, custom bookmark, and fast UK delivery."}
          </p>
        </div>

        {/* Modal Footer CTA */}
        <div className="mt-10 pt-6 border-t border-[#E5E0DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Feather className="w-4 h-4 text-[#C49A45]" />
            <span>Enjoyed this preview? Order the full book direct!</span>
          </div>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-6 py-2.5 rounded-xl font-sans text-xs font-bold transition-colors"
          >
            Return to Book Options
          </button>
        </div>

      </div>
    </div>
  );
}
