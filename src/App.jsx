import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PerksRibbon from './components/PerksRibbon';
import GenreGrid from './components/GenreGrid';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import SampleReaderModal from './components/SampleReaderModal';
import CartDrawer from './components/CartDrawer';
import AuthorShowcase from './components/AuthorShowcase';
import PressReviews from './components/PressReviews';
import ArtGalleryView from './components/ArtGalleryView';
import AboutView from './components/AboutView';
import Footer from './components/Footer';

import catalogData from './data/catalog.json';
import { fetchCatalogProducts } from './services/wixClient';
import { Filter, Sparkles, Feather, Search, RotateCcw, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  const [catalog, setCatalog] = useState(catalogData);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAuthor, setSelectedAuthor] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSignedOnly, setFilterSignedOnly] = useState(false);
  const [filterUnder15, setFilterUnder15] = useState(false);
  
  // Modals & Drawers
  const [selectedBook, setSelectedBook] = useState(null);
  const [excerptBook, setExcerptBook] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch live products from Wix Headless API on mount with resilient fallback
  useEffect(() => {
    async function loadLiveCatalog() {
      const liveProducts = await fetchCatalogProducts();
      if (liveProducts && liveProducts.length > 0) {
        setCatalog(liveProducts);
      }
    }
    loadLiveCatalog();
  }, []);

  // Featured book for Hero banner
  const featuredBook = useMemo(() => {
    return catalog.find(b => b.title.includes("Özlem") || b.title.includes("Plants & Us")) || catalog[0];
  }, [catalog]);

  // Filtered catalogue logic
  const filteredBooks = useMemo(() => {
    return catalog.filter(book => {
      // Category Filter
      if (selectedCategory !== 'ALL' && !book.categories.includes(selectedCategory)) {
        return false;
      }
      // Author Filter
      if (selectedAuthor !== 'ALL' && !book.author.toLowerCase().includes(selectedAuthor.toLowerCase())) {
        return false;
      }
      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchAuthor = book.author.toLowerCase().includes(q);
        const matchSku = book.sku.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchSku) return false;
      }
      // Signed Only
      if (filterSignedOnly && !book.isSigned) {
        return false;
      }
      // Under £15 Only
      if (filterUnder15 && book.price > 15.0) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedAuthor, searchQuery, filterSignedOnly, filterUnder15]);

  // Cart operations
  const handleAddToCart = (bookToAdd) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === bookToAdd.id && item.selectedFormat === bookToAdd.selectedFormat);
      if (existing) {
        return prev.map(item => 
          (item.id === bookToAdd.id && item.selectedFormat === bookToAdd.selectedFormat)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...bookToAdd, quantity: 1, selectedFormat: bookToAdd.selectedFormat || bookToAdd.format }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const categoriesList = [
    { id: 'ALL', label: 'All Catalogue' },
    { id: 'Fiction, YA & Sci-Fi', label: 'Fiction, YA & Sci-Fi' },
    { id: 'Non-Fiction & Memoir', label: 'Non-Fiction & Memoir' },
    { id: 'Cookbooks & Food', label: 'Cookbooks & Food' },
    { id: "Children's & Picture Books", label: "Children's & Picture Books" },
    { id: 'Poetry & Fine Art', label: 'Poetry & Fine Art' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-slate-900 selection:bg-[#8C2520] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={totalCartCount} 
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="flex-1">
        {/* TAB 1: HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-0 animate-fade-in">
            {/* Hero Section */}
            <Hero 
              featuredBook={featuredBook} 
              onSelectBook={setSelectedBook}
              onExploreClick={() => { setActiveTab('books'); setSelectedCategory('ALL'); }}
            />

            {/* Direct DTC Perks Strip */}
            <PerksRibbon />

            {/* Genre Discovery Grid */}
            <GenreGrid 
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setActiveTab('books');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Releases Catalogue Carousel Section */}
            <section className="py-16 bg-[#FBF9F5] border-t border-[#E5E0DA]">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <span className="text-[#8C2520] font-sans font-bold text-xs uppercase tracking-widest block mb-1">
                      DIRECT PUBLISHER SELECTION
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                      Bestselling & Featured Titles
                    </h2>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2 text-xs font-sans font-bold">
                    <button 
                      onClick={() => setFilterSignedOnly(!filterSignedOnly)}
                      className={`px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${filterSignedOnly ? 'bg-amber-100 text-[#8C2520] border-amber-300 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                    >
                      <Feather className="w-3.5 h-3.5 text-[#D4A359]" />
                      <span>Signed Editions</span>
                    </button>
                    <button 
                      onClick={() => setFilterUnder15(!filterUnder15)}
                      className={`px-3.5 py-2 rounded-xl border transition-all ${filterUnder15 ? 'bg-amber-100 text-[#8C2520] border-amber-300 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                    >
                      <span>Under £15</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('books'); setSelectedCategory('ALL'); }}
                      className="bg-[#1D2A44] text-white px-4 py-2 rounded-xl hover:bg-[#263859] transition-colors flex items-center gap-1"
                    >
                      <span>View All 100+ Titles →</span>
                    </button>
                  </div>
                </div>

                {/* 4-Column Book Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBooks.slice(0, 8).map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onSelectBook={setSelectedBook} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Authors Roster */}
            <AuthorShowcase 
              onSelectAuthor={(authorName) => {
                setSelectedAuthor(authorName);
                setActiveTab('books');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Press & Praise Carousel */}
            <PressReviews />
          </div>
        )}

        {/* TAB 2: BOOKS & CATALOGUE VIEW */}
        {activeTab === 'books' && (
          <div className="py-12 bg-[#FBF9F5] min-h-[80vh] animate-fade-in">
            <div className="container mx-auto px-4">
              
              {/* Catalogue Header */}
              <div className="mb-8 space-y-3">
                <span className="text-xs font-bold text-[#8C2520] uppercase tracking-widest block">
                  GB PUBLISHING MASTER CATALOGUE
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                  {selectedCategory === 'ALL' ? 'Complete Book Catalogue' : selectedCategory}
                </h1>
                <p className="text-xs text-slate-600 font-sans max-w-2xl">
                  Showing {filteredBooks.length} titles available directly from GB Publishing. Orders include free custom bookmarks, fast UK delivery, and optional author-signed copies.
                </p>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E0DA] shadow-sm mb-8 space-y-4">
                
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categoriesList.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSelectedAuthor('ALL'); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-sans whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-[#8C2520] text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Secondary Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs font-sans">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input 
                        type="checkbox" 
                        checked={filterSignedOnly} 
                        onChange={(e) => setFilterSignedOnly(e.target.checked)}
                        className="rounded text-[#8C2520] focus:ring-[#8C2520]" 
                      />
                      <span>✍️ Signed Copies Only</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                      <input 
                        type="checkbox" 
                        checked={filterUnder15} 
                        onChange={(e) => setFilterUnder15(e.target.checked)}
                        className="rounded text-[#8C2520] focus:ring-[#8C2520]" 
                      />
                      <span>🏷️ Under £15</span>
                    </label>
                  </div>

                  {(selectedCategory !== 'ALL' || selectedAuthor !== 'ALL' || searchQuery || filterSignedOnly || filterUnder15) && (
                    <button 
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedAuthor('ALL');
                        setSearchQuery('');
                        setFilterSignedOnly(false);
                        setFilterUnder15(false);
                      }}
                      className="text-xs text-[#8C2520] font-bold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Book Cards Grid */}
              {filteredBooks.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-12">
                  <Search className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="font-serif text-xl font-bold">No titles match your filter criteria</h3>
                  <p className="text-xs text-slate-500">
                    Try adjusting your search keywords, clearing signed/price filters, or switching category tags.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSelectedAuthor('ALL');
                      setSearchQuery('');
                      setFilterSignedOnly(false);
                      setFilterUnder15(false);
                    }}
                    className="bg-[#8C2520] text-white px-6 py-2.5 rounded-xl text-xs font-bold font-sans"
                  >
                    View All 100+ Books
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onSelectBook={setSelectedBook} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: ART GALLERY VIEW */}
        {activeTab === 'art' && (
          <ArtGalleryView 
            catalog={catalog} 
            onAddToCart={handleAddToCart} 
          />
        )}

        {/* TAB 4: ABOUT GBP VIEW */}
        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookModal 
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddToCart={handleAddToCart}
          onOpenExcerpt={(b) => { setExcerptBook(b); setSelectedBook(null); }}
          relatedBooks={catalog.filter(b => b.categories.some(c => selectedBook.categories.includes(c)) && b.id !== selectedBook.id)}
          onSelectBook={setSelectedBook}
        />
      )}

      {/* Sample Reader Excerpt Modal */}
      {excerptBook && (
        <SampleReaderModal 
          book={excerptBook}
          onClose={() => setExcerptBook(null)}
        />
      )}

      {/* Slide-Over Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <Footer 
        onNavClick={(tab, cat = 'ALL') => {
          setActiveTab(tab);
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
