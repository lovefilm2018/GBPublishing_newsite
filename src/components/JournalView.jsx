import React, { useState, useEffect } from 'react';
import { Play, Video, Sparkles, Feather, Calendar, ExternalLink, X, BookOpen, MessageSquare, CheckCircle2, Rss } from 'lucide-react';

export default function JournalView() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [wixLivePosts, setWixLivePosts] = useState([]);

  const defaultEntries = [
    {
      id: "preview-grandad-lets-go-for-a-walk",
      title: "Preview - Grandad, let's go for a walk",
      author: "George S Boughton",
      date: "3 Aug 2026",
      type: "Video Post",
      summary: "A heartwarming and charming story celebrating intergenerational family walks, nature, and the joy of outdoor discovery.",
      thumbnail: "https://img.youtube.com/vi/OQBn-mSCfv4/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/OQBn-mSCfv4",
      badge: "NEW!"
    },
    {
      id: "preview-seafaring",
      title: "Preview - Seafaring",
      author: "George S Boughton",
      date: "3 Aug 2026",
      type: "Video Post",
      summary: "Explore the captivating maritime journey and historical seafaring adventures published by GB Publishing.",
      thumbnail: "https://img.youtube.com/vi/ncS3FYL4R_s/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/ncS3FYL4R_s",
      badge: "NEW!"
    },
    {
      id: "preview-the-zodiac-cooks",
      title: "Preview - The Zodiac Cooks",
      author: "George S Boughton",
      date: "3 Aug 2026",
      type: "Video Post",
      summary: "Could serving the right food capture a heart? Yes, according to passionate cook Penny Thornton (author of Suns and Lovers) who believes matching meals to personality types can open the route to happy seduction.",
      thumbnail: "https://img.youtube.com/vi/u1JsGksWwb4/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/u1JsGksWwb4",
      badge: "NEW!"
    },
    {
      id: "autobiology-of-a-vet-preview",
      title: "Preview - Autobiology of a Vet",
      author: "George S Boughton",
      date: "3 Aug 2026",
      type: "Video Post",
      summary: "An enlightening, educational but often hilarious memoir. A great read for anyone interested in animals and especially life as a veterinary surgeon, covering travels from the UK to East Africa (including under dictator Idi Amin) and South Africa.",
      thumbnail: "https://img.youtube.com/vi/HTaWcwy590M/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/HTaWcwy590M",
      badge: "NEW!"
    }
  ];

  // Fetch posts from raw GitHub content (instant updates on every sync run) with local /posts.json fallback
  useEffect(() => {
    async function fetchPosts() {
      const endpoints = [
        `https://raw.githubusercontent.com/lovefilm2018/GBPublishing_newsite/main/public/posts.json?t=${Date.now()}`,
        `/GBPublishing_newsite/posts.json?t=${Date.now()}`
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data.posts && data.posts.length > 0) {
              setWixLivePosts(data.posts);
              return; // Success!
            }
          }
        } catch (_) {
          // try fallback
        }
      }
    }
    fetchPosts();
  }, []);

  const liveTitles = new Set(wixLivePosts.map(p => p.title.toLowerCase().trim()));
  const extraDefaults = defaultEntries.filter(d => !liveTitles.has(d.title.toLowerCase().trim()));
  const allEntries = wixLivePosts.length > 0 ? wixLivePosts : [...wixLivePosts, ...extraDefaults];

  return (
    <div className="py-16 bg-[#FAF8F4] text-[#1A1612]">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1F1A] uppercase tracking-widest bg-red-100/60 border border-red-200 px-3.5 py-1 rounded-full">
            <Video className="w-4 h-4 text-[#7A1F1A]" /> GB Publishing Journal & Video Gallery
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#1A1612] leading-tight">
            News, Documentaries & Author Broadcasts
          </h1>
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed">
            Watch author interviews, river documentary films, fine art exhibition highlights, and publisher updates.
          </p>
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allEntries.map((entry) => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="p-5 space-y-4">
                {/* Media Thumbnail Container */}
                <div 
                  onClick={() => setActiveVideo(entry)}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-900 flex items-center justify-center"
                >
                  <img 
                    src={entry.thumbnail} 
                    alt={entry.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors" />

                  {/* Standout NEW! Badge (Only if 30 days or less old) */}
                  {entry.badge && (
                    <span className="absolute top-3 left-3 bg-[#7A1F1A] text-white text-[11px] font-extrabold tracking-widest px-3 py-1 rounded-full shadow-lg border border-red-400/30">
                      {entry.badge}
                    </span>
                  )}

                  {/* Big Play Button */}
                  <div className="w-16 h-16 bg-white/95 text-[#7A1F1A] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform pl-1">
                    <Play className="w-7 h-7 fill-current" />
                  </div>
                </div>

                {/* Entry Metadata & Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-sans font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C49A45]" />
                    <span>{entry.date}</span>
                    <span>·</span>
                    <span className="text-[#7A1F1A] font-bold">{entry.type}</span>
                  </div>

                  <h3 
                    onClick={() => setActiveVideo(entry)}
                    className="font-serif text-2xl font-bold text-[#1A1612] group-hover:text-[#7A1F1A] transition-colors leading-snug cursor-pointer"
                  >
                    {entry.title}
                  </h3>

                  <p className="text-sm text-slate-600 font-sans leading-relaxed line-clamp-3">
                    {entry.summary}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-xs font-serif italic text-slate-600">
                  By George S Boughton
                </span>
                <button 
                  onClick={() => setActiveVideo(entry)}
                  className="bg-amber-100/80 hover:bg-amber-200/80 text-[#1A1612] px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#7A1F1A]" />
                  <span>Watch & Read Story →</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Video Lightbox Modal */}
        {activeVideo && (
          <div className="modal-backdrop bg-black/85 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
            <div className="bg-[#161F2E] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 relative m-4 shadow-2xl space-y-5 text-white" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">{activeVideo.type}</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-50 leading-snug">{activeVideo.title}</h3>
                <p className="text-xs text-slate-300 font-sans">By George S Boughton · {activeVideo.date}</p>
              </div>

              {/* Video Player Container */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                <iframe 
                  src={`${activeVideo.embedUrl}?autoplay=1`} 
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Full Article Description in Modal */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">About This Broadcast & Article</h4>
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {activeVideo.summary}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
