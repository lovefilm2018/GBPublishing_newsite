import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, BookOpen, Sparkles, Feather, ArrowUpRight } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  setIsCartOpen, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const blogUrl = "https://www.gbpublishing.co.uk/blog";

  const handleNavClick = (tab, category = null) => {
    setActiveTab(tab);
    if (category !== null) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1D2A44] text-white shadow-lg">
      {/* Top Direct Buy Incentive Ribbon */}
      <div className="bg-[#8C2520] text-amber-100 text-xs py-1.5 px-4 font-medium tracking-wide">
        <div className="container mx-auto flex justify-between items-center text-center sm:text-left">
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-300" /> ✨ Free Custom Bookmark with Every Direct Order</span>
            <span className="hidden md:flex items-center gap-1"><Feather className="w-3.5 h-3.5 text-amber-300" /> ✍️ Author Signed Copies Available</span>
            <span className="hidden lg:inline">🚚 Free UK Delivery on Orders £25+</span>
          </div>
          <a 
            href="#perks" 
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); setTimeout(() => document.getElementById('perks')?.scrollIntoView(), 100); }}
            className="hidden sm:inline-block text-amber-200 hover:text-white underline text-[11px]"
          >
            Why Buy Direct? →
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8C2520] to-[#D4A359] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              GBP
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-50 block leading-none">
                GB PUBLISHING
              </span>
              <span className="text-[10px] tracking-widest text-amber-200/80 uppercase font-sans font-semibold mt-1 block">
                Independent UK Publisher
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-sans text-sm font-medium">
          <button 
            onClick={() => handleNavClick('home')}
            className={`transition-colors relative py-1 ${activeTab === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-200 hover:text-white'}`}
          >
            HOME
            {activeTab === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />}
          </button>

          <button 
            onClick={() => handleNavClick('books', 'ALL')}
            className={`transition-colors relative py-1 ${activeTab === 'books' ? 'text-amber-400 font-semibold' : 'text-slate-200 hover:text-white'}`}
          >
            BOOKS
            {activeTab === 'books' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />}
          </button>

          <button 
            onClick={() => handleNavClick('art')}
            className={`transition-colors relative py-1 ${activeTab === 'art' ? 'text-amber-400 font-semibold' : 'text-slate-200 hover:text-white'}`}
          >
            ART GALLERY
            {activeTab === 'art' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />}
          </button>

          <button 
            onClick={() => handleNavClick('about')}
            className={`transition-colors relative py-1 ${activeTab === 'about' ? 'text-amber-400 font-semibold' : 'text-slate-200 hover:text-white'}`}
          >
            ABOUT GBP
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />}
          </button>

          {/* External Blog Link back to Original Wix Site per Plan */}
          <a 
            href={blogUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-200 hover:text-amber-300 transition-colors py-1 border-b border-dashed border-amber-400/40"
            title="Read articles on the GB Publishing Journal on Wix"
          >
            NEWS & BLOG
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </a>
        </nav>

        {/* Search & Cart Actions */}
        <div className="flex items-center gap-3">
          {/* Live Search Input Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
              title="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {isSearchOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white text-slate-800 rounded-xl shadow-2xl p-3 border border-slate-200 z-50 animate-fade-in">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== 'books') setActiveTab('books');
                    }}
                    autoFocus
                    className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#8C2520]"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Drawer Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-[#8C2520] hover:bg-[#A62D27] text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Direct Cart</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121A29] border-t border-slate-800 px-4 py-5 space-y-4 animate-fade-in">
          <button 
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 text-base font-medium ${activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-200'}`}
          >
            HOME
          </button>
          <button 
            onClick={() => handleNavClick('books', 'ALL')}
            className={`block w-full text-left py-2 text-base font-medium ${activeTab === 'books' ? 'text-amber-400 font-bold' : 'text-slate-200'}`}
          >
            BOOKS & CATALOGUE
          </button>
          <button 
            onClick={() => handleNavClick('art')}
            className={`block w-full text-left py-2 text-base font-medium ${activeTab === 'art' ? 'text-amber-400 font-bold' : 'text-slate-200'}`}
          >
            ART GALLERY
          </button>
          <button 
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2 text-base font-medium ${activeTab === 'about' ? 'text-amber-400 font-bold' : 'text-slate-200'}`}
          >
            ABOUT GBP
          </button>
          <a 
            href={blogUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 text-amber-200 font-medium border-t border-slate-800 pt-3"
          >
            <span>NEWS & BLOG (WIX JOURNAL)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
