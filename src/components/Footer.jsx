import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  const blogUrl = "https://www.gbpublishing.co.uk/blog";

  return (
    <footer className="bg-[#121A29] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="container mx-auto px-4 space-y-12">
        
        {/* Newsletter Reader Circle Banner */}
        <div className="bg-gradient-to-r from-[#8C2520] to-[#5C1613] rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-400/20">
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <span className="text-amber-300 font-sans font-bold text-xs uppercase tracking-widest block">
              GB PUBLISHING READER CIRCLE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-50">
              Join for 10% Off Your First Direct Order
            </h3>
            <p className="text-xs text-amber-100/90 font-sans leading-relaxed">
              Get exclusive early access to author-signed collector releases, new book launches, and direct publisher discounts.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="bg-white/20 text-amber-200 px-6 py-3 rounded-xl text-xs font-bold font-sans flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-300" />
                <span>Welcome to the Reader Circle! Check your inbox for your 10% code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl font-sans focus:outline-none focus:ring-2 focus:ring-amber-300 flex-1"
                />
                <button 
                  type="submit"
                  className="bg-[#D4A359] hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-sans text-slate-400">
          
          {/* Brand Colophon */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#8C2520] flex items-center justify-center font-serif font-bold text-white text-base">
                GBP
              </div>
              <span className="font-serif text-xl font-bold text-amber-50">GB PUBLISHING</span>
            </div>

            <p className="leading-relaxed">
              Independent indie book publishing house based in the United Kingdom. Dedicated to high-end literary craftsmanship, author-signed editions, and direct reader relationships since 2013.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Direct Storefront Security Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-100 uppercase tracking-wider">Store Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavClick('home')} className="hover:text-amber-300 transition-colors">Home Page</button></li>
              <li><button onClick={() => onNavClick('books', 'ALL')} className="hover:text-amber-300 transition-colors">Full Book Catalogue (100+ Titles)</button></li>
              <li><button onClick={() => onNavClick('art')} className="hover:text-amber-300 transition-colors">Fine Art & Painting Gallery</button></li>
              <li><button onClick={() => onNavClick('about')} className="hover:text-amber-300 transition-colors">About GB Publishing</button></li>
              <li>
                <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors text-amber-200/90 underline">
                  News & Blog (Wix Journal) →
                </a>
              </li>
            </ul>
          </div>

          {/* Imprints & Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-100 uppercase tracking-wider">Book Genres</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavClick('books', 'Fiction, YA & Sci-Fi')} className="hover:text-amber-300 transition-colors">Fiction, YA & Sci-Fi</button></li>
              <li><button onClick={() => onNavClick('books', 'Non-Fiction & Memoir')} className="hover:text-amber-300 transition-colors">Non-Fiction & Memoir</button></li>
              <li><button onClick={() => onNavClick('books', 'Cookbooks & Food')} className="hover:text-amber-300 transition-colors">Cookbooks & Culinary</button></li>
              <li><button onClick={() => onNavClick('books', "Children's & Picture Books")} className="hover:text-amber-300 transition-colors">Children's Picture Books</button></li>
              <li><button onClick={() => onNavClick('books', 'Poetry & Fine Art')} className="hover:text-amber-300 transition-colors">Poetry & Fine Art</button></li>
            </ul>
          </div>

          {/* Contact & Direct Perks */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold text-amber-100 uppercase tracking-wider">Direct Benefits</h4>
            <ul className="space-y-2 text-[11px]">
              <li>✨ Free Custom Bookmark</li>
              <li>✍️ Author Signed Copies</li>
              <li>🚚 Free UK Delivery £25+</li>
              <li>📦 1-2 Day Dispatch</li>
              <li>❤️ Direct Author Support</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} GB Publishing. All rights reserved. Registered UK Independent Publisher.</p>
          <p className="flex items-center justify-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#8C2520] fill-[#8C2520]" />
            <span>for Independent Readers Worldwide</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
