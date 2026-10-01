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
import JournalView from './components/JournalView';
import AboutView from './components/AboutView';
import Footer from './components/Footer';

import catalogData from './data/catalog.json';
import { fetchCatalogProducts } from './services/wixClient';
import { Filter, Sparkles, Feather, Search, RotateCcw, Check, ShoppingBag, ArrowRight } from 'lucide-react';

// George's authoritative order specification for each curated menu (Sept 2026)
const MENU_ORDER_MAP = {
  "Non-Fiction": [
    "b220ed82-aca4-347e-1fd3-a029e6d655d4", // Plants & Us
    "76419b0d-f424-c776-9477-d7d9255302f3", // You are Noah
    "bd3fe905-f8dc-a69b-b940-84f606827877", // Seafaring
    "ec30ad44-30fb-85eb-9725-4259f6c72523", // Ozlem's Turkish Table
    "92a63bda-ac59-c829-3555-556efea2db63", // Nora & John
    "8936d9d1-058c-a475-7ba0-033604f27f65", // Absurd
    "5aba1fc3-b88f-12d6-37f8-4da625fff3bd", // The Zodiac Cooks
    "3cd38c96-a27a-0a03-77c2-93f8a2360fd3", // Autobiology of a Vet
    "4f0a9ef7-8f73-4dad-a64c-1de4e3e405aa", // Tulsi the Tiger
    "9792a2c8-299a-cf0e-6987-1c32c2df92a4", // The Ginologist Cook
    "df277b0f-e176-ca36-344f-72354c95ba9c", // Time's Up
    "31475034-ae01-d1cb-73e3-6dcf687de768", // Black Gold - Black Scorpion
    "33b34cc3-7713-1327-240c-204c99fb52b1", // Dennis to Alice
  ],
  "Nature & Biodiversity": [
    "76419b0d-f424-c776-9477-d7d9255302f3", // You are Noah
    "b220ed82-aca4-347e-1fd3-a029e6d655d4", // Plants & Us
    "3cd38c96-a27a-0a03-77c2-93f8a2360fd3", // Autobiology of a Vet
    "4f0a9ef7-8f73-4dad-a64c-1de4e3e405aa", // Tulsi the Tiger
    "33b34cc3-7713-1327-240c-204c99fb52b1", // Dennis to Alice
  ],
  "Autobiography & Memoir": [
    "92a63bda-ac59-c829-3555-556efea2db63", // Nora & John
    "bd3fe905-f8dc-a69b-b940-84f606827877", // Seafaring
    "8936d9d1-058c-a475-7ba0-033604f27f65", // Absurd
    "3cd38c96-a27a-0a03-77c2-93f8a2360fd3", // Autobiology of a Vet
    "31475034-ae01-d1cb-73e3-6dcf687de768", // Black Gold - Black Scorpion
  ],
  "Adult Sci-Fi": [
    "bb859fbd-7446-7580-8c3d-058c54e1a570", // Adventures of Milla Carter Series 1
    "0dda819e-726d-32e4-6a43-bb7a3caa5d87", // Adventures of Milla Carter Series 2
    "ab1a611d-9061-e0ea-cf14-0c3b43255ebd", // The Ordinary
  ]
};

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

  // Sync activeTab & selectedCategory state with URL hash (#home, #books?category=..., #art, #news, #about)
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace('#', '');
      if (!raw) return;
      const [tabPart, queryPart] = raw.split('?');
      const tab = tabPart.toLowerCase();
      if (['home', 'books', 'art', 'news', 'about'].includes(tab)) {
        setActiveTab(tab);
        if (tab === 'books' && queryPart) {
          const params = new URLSearchParams(queryPart);
          const cat = params.get('category');
          if (cat) {
            setSelectedCategory(decodeURIComponent(cat));
          }
        }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSetActiveTab = (tab, category = null) => {
    setActiveTab(tab);
    if (tab === 'books' && category) {
      setSelectedCategory(category);
      window.location.hash = category === 'ALL' ? '#books' : `#books?category=${encodeURIComponent(category)}`;
    } else {
      window.location.hash = `#${tab}`;
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveTab('books');
    if (category === 'ALL') {
      window.location.hash = '#books';
    } else {
      window.location.hash = `#books?category=${encodeURIComponent(category)}`;
    }
  };

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
    return catalog.find(b => b.title.includes("Ozlem") || b.title.includes("Özlem") || b.title.includes("Plants & Us")) || catalog[0];
  }, [catalog]);

  // Filtered catalogue logic (Books strictly separated from Art Prints)
  const filteredBooks = useMemo(() => {
    let result = catalog.filter(book => {
      // Exclude hidden products flagged in Wix
      if (book.visible === false) return false;

      // STRICT: Exclude art prints from book catalogue
      if (book.isArt === true) return false;

      const titleLower = book.title.toLowerCase();

      // Exclude generic empty Wix placeholder/dummy bundle container entries
      if (
        titleLower.startsWith("copy of") ||
        titleLower === "non-fiction biography memoir paperbacks" ||
        titleLower.startsWith("stunning coffee-table cookbooks") ||
        titleLower.startsWith("gbp crisis appeal")
      ) {
        return false;
      }

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
        const matchContributors = (book.contributors || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchSku && !matchContributors) return false;
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

    // Apply George's curated book ordering if viewing a specific menu
    if (selectedCategory !== 'ALL' && MENU_ORDER_MAP[selectedCategory]) {
      const order = MENU_ORDER_MAP[selectedCategory];
      result = [...result].sort((a, b) => {
        const idxA = order.indexOf(a.id);
        const idxB = order.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }

    return result;
  }, [catalog, selectedCategory, selectedAuthor, searchQuery, filterSignedOnly, filterUnder15]);

  // Group books by 7 core curated menus in George's exact order
  const booksByGenre = useMemo(() => {
    const genres = [
      { 
        id: 'Non-Fiction', 
        title: 'Non-Fiction', 
        description: 'Botany, world culinary heritage, veterinary life, Biafran war memoirs & true accounts' 
      },
      { 
        id: 'Nature & Biodiversity', 
        title: 'Nature & Biodiversity', 
        description: 'Endangered wildlife conservation, official Sky TV companion & botanical exploration' 
      },
      { 
        id: 'Autobiography & Memoir', 
        title: 'Autobiography & Memoir', 
        description: 'Heroic seafaring tall ships, Cold War espionage, motorcycle journeys & veterinary life' 
      },
      { 
        id: 'Poetry & Politics', 
        title: 'Poetry & Politics', 
        description: 'Moving verse reflections, reflective poetry collections & thought-provoking commentary' 
      },
      { 
        id: "Children's & Picture Books", 
        title: "Children's & Picture Books", 
        description: 'Delightfully illustrated picture books, conservation wildlife adventures & collector storybooks' 
      },
      { 
        id: 'Fiction, Young Adult & Sci-Fi', 
        title: 'Fiction, Young Adult & Sci-Fi', 
        description: 'Epic mythological fantasy, space opera science fiction & psychological thrillers' 
      },
      { 
        id: 'Adult Sci-Fi', 
        title: 'Adult Sci-Fi', 
        description: 'Dark, provocative science fiction, psychological thrillers & deep space odysseys' 
      }
    ];

    return genres.map(g => {
      let bks = filteredBooks.filter(b => b.categories.includes(g.id));
      if (MENU_ORDER_MAP[g.id]) {
        const order = MENU_ORDER_MAP[g.id];
        bks = [...bks].sort((a, b) => {
          const idxA = order.indexOf(a.id);
          const idxB = order.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
      }
      return {
        ...g,
        books: bks
      };
    }).filter(g => g.books.length > 0);
  }, [filteredBooks]);

  // Cart operations
  const handleAddToCart = (bookToAdd) => {
    const itemKey = `${bookToAdd.id}-${bookToAdd.selectedFormat || bookToAdd.format || 'Standard'}`;
    setCartItems(prev => {
      const existing = prev.find(item => (item.cartKey || item.id) === itemKey);
      if (existing) {
        return prev.map(item => 
          (item.cartKey || item.id) === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        ...bookToAdd, 
        cartKey: itemKey,
        quantity: 1, 
        selectedFormat: bookToAdd.selectedFormat || bookToAdd.format || 'Standard' 
      }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(cartKey);
      return;
    }
    setCartItems(prev => prev.map(item => (item.cartKey || item.id) === cartKey ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (cartKey) => {
    setCartItems(prev => prev.filter(item => (item.cartKey || item.id) !== cartKey));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const categoriesList = [
    { id: 'ALL', label: 'All Catalogue' },
    { id: 'Non-Fiction', label: 'Non-Fiction' },
    { id: 'Nature & Biodiversity', label: 'Nature & Biodiversity' },
    { id: 'Autobiography & Memoir', label: 'Autobiography & Memoir' },
    { id: 'Poetry & Politics', label: 'Poetry & Politics' },
    { id: "Children's & Picture Books", label: "Children's & Picture Books" },
    { id: 'Fiction, Young Adult & Sci-Fi', label: 'Fiction, Young Adult & Sci-Fi' },
    { id: 'Adult Sci-Fi', label: 'Adult Sci-Fi' }
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
        setSelectedCategory={handleCategorySelect}
      />

      <main className="flex-1">
        {/* TAB 1: HOMEPAGE VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-0 animate-fade-in">
            {/* Hero Section */}
            <Hero 
              featuredBook={featuredBook} 
              onSelectBook={setSelectedBook} 
              onExploreClick={() => handleCategorySelect('ALL')}
            />

            {/* Direct DTC Perks Strip */}
            <PerksRibbon />

            {/* Genre Discovery Grid */}
            <GenreGrid 
              onSelectCategory={(catId) => {
                handleCategorySelect(catId);
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
                      onClick={() => handleCategorySelect('ALL')}
                      className="bg-[#1D2A44] text-white px-4 py-2 rounded-xl hover:bg-[#263859] transition-colors flex items-center gap-1"
                    >
                      <span>View All 100+ Titles →</span>
                    </button>
                  </div>
                </div>

                {/* 3-Column Book Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  Showing {filteredBooks.length} titles available directly from GB Publishing Org. Free UK delivery on orders over £15, author signed editions, and direct royalties for indie creators.
                </p>
              </div>

              {/* Filters Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5E0DA] shadow-sm mb-8 space-y-4">
                
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categoriesList.map(cat => {
                    const catId = typeof cat === 'string' ? cat : cat.id;
                    const catLabel = typeof cat === 'string' ? cat : cat.label;
                    return (
                      <button 
                        key={catId}
                        onClick={() => handleCategorySelect(catId)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === catId ? 'bg-[#8C2520] text-white shadow-md shadow-red-950/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      >
                        {catLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Filters & Quick Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
                  
                  {/* Left toggles */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                      <input 
                        type="checkbox" 
                        checked={filterSignedOnly} 
                        onChange={(e) => setFilterSignedOnly(e.target.checked)}
                        className="rounded text-[#8C2520] focus:ring-[#8C2520]" 
                      />
                      <span>✍️ Author Signed / Special Offers</span>
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
                        handleCategorySelect('ALL');
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
                      handleCategorySelect('ALL');
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
              ) : selectedCategory === 'ALL' && !searchQuery && !filterSignedOnly && !filterUnder15 && selectedAuthor === 'ALL' ? (
                /* Grouped by 5 Core Genre Imprints matching live homepage */
                <div className="space-y-16">
                  {booksByGenre.map(group => (
                    <section key={group.id} className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E0DA] pb-4 gap-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                              {group.title}
                            </h2>
                            <span className="text-xs font-sans font-bold text-[#8C2520] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                              {group.books.length} {group.books.length === 1 ? 'Book' : 'Books'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-sans max-w-xl">
                            {group.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCategorySelect(group.id)}
                          className="text-xs font-bold text-[#8C2520] hover:underline flex items-center gap-1 self-start sm:self-auto"
                        >
                          <span>Explore {group.title} →</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.books.map((book) => (
                          <BookCard 
                            key={book.id} 
                            book={book} 
                            onSelectBook={setSelectedBook} 
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                /* Filtered Single Category or Search Results Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* TAB 4: NEWS & VIDEO JOURNAL VIEW */}
        {activeTab === 'news' && (
          <JournalView />
        )}

        {/* TAB 5: ABOUT GBP VIEW */}
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
