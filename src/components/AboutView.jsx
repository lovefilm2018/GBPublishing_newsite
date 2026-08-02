import React from 'react';
import { BookOpen, Download, Feather, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="py-16 bg-[#FBF9F5]">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Publisher Story Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C2520] uppercase tracking-widest bg-red-100 px-3.5 py-1 rounded-full">
            <Sparkles className="w-4 h-4" /> Independent UK Publisher Since 2013
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Celebrating Authentic Literature & Indie Voices
          </h1>
          <p className="text-slate-600 font-sans text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            GB Publishing is an independent UK book publishing house dedicated to bringing extraordinary fiction, memoirs, culinary heritage, fine art, and children's picture books directly to readers.
          </p>
        </div>

        {/* Core Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E0DA] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-100 text-[#8C2520] rounded-xl flex items-center justify-center font-bold">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Author Direct First</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              We champion our authors with higher direct royalty margins and direct reader connections, bypassing traditional gatekeepers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E0DA] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-red-100 text-[#8C2520] rounded-xl flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Craftsmanship Quality</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Every book features hand-curated typography, bespoke cover designs, premium paper stocks, and optional author-signed editions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E0DA] shadow-sm space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-[#2D7D46] rounded-xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Crisis & Charity Support</h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Selected titles, including our emergency crisis appeal publications, donate up to 25% of sales to relief funds.
            </p>
          </div>
        </div>

        {/* PDF Catalogue Download Banner */}
        <div className="bg-gradient-to-r from-[#1D2A44] to-[#121A29] text-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-amber-50">
              Download 2026 Publisher Catalogue
            </h3>
            <p className="text-xs text-slate-300 font-sans max-w-md">
              Get the complete printable PDF catalogue featuring all 100+ titles, ISBN listings, author bios, and wholesale contact details.
            </p>
          </div>

          <button 
            onClick={() => alert("Downloading GB Publishing 2026 Complete Catalogue PDF...")}
            className="bg-[#8C2520] hover:bg-[#A62D27] text-white px-6 py-3 rounded-xl font-sans font-bold text-xs flex items-center gap-2 shadow-md whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Download Catalogue PDF</span>
          </button>
        </div>

        {/* Submissions & Contact */}
        <div className="bg-white p-8 rounded-2xl border border-[#E5E0DA] shadow-sm space-y-4 text-center">
          <Mail className="w-10 h-10 text-[#8C2520] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-slate-900">Author Submissions & Inquiries</h3>
          <p className="text-xs text-slate-600 font-sans max-w-lg mx-auto leading-relaxed">
            Are you an indie author or illustrator looking to publish? We accept manuscript submissions for non-fiction memoirs, culinary heritage, children's picture books, and sci-fi.
          </p>
          <a 
            href="mailto:editorial@gbpublishing.co.uk"
            className="inline-block bg-[#1D2A44] text-white px-6 py-2.5 rounded-xl font-sans font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Contact Editorial Team
          </a>
        </div>

      </div>
    </div>
  );
}
