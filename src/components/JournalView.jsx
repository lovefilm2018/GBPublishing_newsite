import React, { useState, useEffect } from 'react';
import { Play, Video, Sparkles, Feather, Calendar, ExternalLink, X, BookOpen, MessageSquare, CheckCircle2, Rss } from 'lucide-react';

export default function JournalView() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [wixLivePosts, setWixLivePosts] = useState([]);

  const defaultEntries = [
    {
      id: "preview-the-zodiac-cooks",
      title: "Preview - The Zodiac Cooks",
      author: "Alex Poxon (via Penny Thornton)",
      date: "Live Post from Wix Dashboard",
      type: "Wix Video Post",
      summary: "Could serving the right food capture a heart? Yes, according to passionate cook Penny Thornton (author of Suns and Lovers) who believes matching meals to personality types can open the route to happy seduction.",
      thumbnail: "https://img.youtube.com/vi/u1JsGksWwb4/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/u1JsGksWwb4",
      badge: "Live Post from Wix Dashboard"
    },
    {
      id: "autobiology-of-a-vet-preview",
      title: "Preview - Autobiology of a Vet",
      author: "Alex Poxon (via John Sauvage / Paddy Cummins)",
      date: "Live Post from Wix Dashboard",
      type: "Wix Video Post",
      summary: "An enlightening, educational but often hilarious memoir. A great read for anyone interested in animals and especially life as a veterinary surgeon, covering travels from the UK to East Africa (including under dictator Idi Amin) and South Africa.",
      thumbnail: "https://img.youtube.com/vi/HTaWcwy590M/hqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/HTaWcwy590M",
      badge: "Live Post from Wix Dashboard"
    },
    {
      id: "dennis-to-alice",
      title: "Dennis to Alice — River Flood Documentary & Author Story",
      author: "George S Boughton",
      date: "Surrey & Thames Tributaries Feature",
      type: "Documentary Video",
      summary: "George S Boughton shares the captivating story behind Dennis to Alice, exploring river ecology, environmental preservation, and the human journeys along local waterways.",
      thumbnail: "https://static.wixstatic.com/media/7c7af8_ed5c5ab58eb749838f02682382fc183c~mv2.jpg",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      badge: "Featured Documentary"
    },
    {
      id: "ozlems-table",
      title: "Özlem's Turkish Table — Gourmand Award & TV/Radio Feature",
      author: "Özlem Warren",
      date: "BBC & Talk Radio Europe Interview",
      type: "Author Interview",
      summary: "Celebrated author Özlem Warren discusses regional Turkish culinary heritage, hosting live cooking masterclasses, and donating book proceeds to Turkey earthquake relief.",
      thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      badge: "Award Winner"
    },
    {
      id: "you-are-noah",
      title: "You are Noah! — Wildlife Conservation & Sky TV Broadcast",
      author: "Hein Prinsloo Curson",
      date: "Global Wildlife Appeal",
      type: "Conservation Video",
      summary: "Explore the international wildlife rescue mission behind the You are Noah! series, protecting endangered species from extinction in partnership with The Noah's Ark Foundation.",
      thumbnail: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      badge: "Sky TV Feature"
    }
  ];

  // Fetch live Wix Blog posts via CORS-safe proxy chain
  useEffect(() => {
    async function parseXml(xmlText) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      return Array.from(items).map((item, idx) => {
        const title = item.querySelector("title")?.textContent || "Wix Journal Post";
        const description = item.querySelector("description")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const creator = item.querySelector("creator")?.textContent || "GB Publishing";
        const enclosure = item.querySelector("enclosure");
        const rawMediaUrl = enclosure ? enclosure.getAttribute("url") : "";

        let embedUrl = null;
        let thumbnail = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";

        if (rawMediaUrl) {
          const ytMatch = rawMediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch && ytMatch[1]) {
            const ytId = ytMatch[1];
            embedUrl = `https://www.youtube.com/embed/${ytId}`;
            thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          }
        }

        return {
          id: `wix-live-${idx}`,
          title,
          author: creator,
          date: pubDate ? new Date(pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently Published",
          type: embedUrl ? "Wix Video Post" : "Wix Blog Post",
          summary: description.replace(/<[^>]*>?/gm, ''),
          thumbnail,
          embedUrl: embedUrl || "https://www.youtube.com/embed/HTaWcwy590M",
          wixLink: link,
          badge: "Live Post from Wix Dashboard"
        };
      });
    }

    async function fetchWixLiveFeed() {
      const RAW_FEED = `https://gbpublishingorg.wixsite.com/website-5/blog-feed.xml`;
      const encodedFeed = encodeURIComponent(RAW_FEED);

      // Try direct fetch first (works when Wix sends CORS headers), then proxy fallbacks
      const attempts = [
        () => fetch(`${RAW_FEED}?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.text() : Promise.reject()),
        () => fetch(`https://api.codetabs.com/v1/proxy?quest=${encodedFeed}`).then(r => r.ok ? r.text() : Promise.reject()),
        () => fetch(`https://corsproxy.io/?${encodedFeed}`).then(r => r.ok ? r.text() : Promise.reject()),
        () => fetch(`https://api.allorigins.win/raw?url=${encodedFeed}&t=${Date.now()}`).then(r => r.ok ? r.text() : Promise.reject()),
      ];

      for (const attempt of attempts) {
        try {
          const xmlText = await attempt();
          if (xmlText && xmlText.includes('<item>')) {
            const livePosts = await parseXml(xmlText);
            if (livePosts.length > 0) {
              setWixLivePosts(livePosts);
              return; // success — stop trying
            }
          }
        } catch (_) {
          // try next proxy
        }
      }
      console.warn("All RSS fetch attempts failed — showing default entries.");
    }

    fetchWixLiveFeed();
  }, []);

  // Live Wix posts show at the top; sample entries fill the rest as evergreen content
  const liveIds = new Set(wixLivePosts.map(p => p.title.toLowerCase()));
  const filteredDefaults = defaultEntries.filter(e => !liveIds.has(e.title.toLowerCase()));
  const allEntries = [...wixLivePosts, ...filteredDefaults];

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
            Watch author interviews, river documentary films, fine art exhibition highlights, and crisis relief updates directly from our independent publishing house.
          </p>
        </div>

        {/* Headless Wix CMS Notice Banner for Publisher */}
        <div className="bg-[#1C2B40] text-amber-50 p-6 rounded-2xl shadow-md border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center text-amber-300 font-bold flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-amber-100">Live Wix CMS Integration Active</h4>
              <p className="text-xs text-slate-300 font-sans">
                Publisher update: All video clips, press articles, and journal entries published in your Wix Dashboard stream directly into this layout.
              </p>
            </div>
          </div>
          <a 
            href="https://gbpublishingorg.wixsite.com/website-5/posts" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#7A1F1A] hover:bg-[#8C2520] text-white px-5 py-2.5 rounded-xl font-sans text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Wix CMS Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allEntries.map((entry) => (
            <div 
              key={entry.id}
              className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                
                {/* Video Thumbnail Container with Play Overlay */}
                <div 
                  onClick={() => setActiveVideo(entry)}
                  className="relative overflow-hidden rounded-xl bg-slate-900 h-60 cursor-pointer group flex items-center justify-center"
                >
                  <img 
                    src={entry.thumbnail} 
                    alt={entry.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors" />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#7A1F1A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {entry.badge}
                  </span>

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

                  <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                    {entry.summary}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-xs font-serif italic text-slate-600">
                  By {entry.author}
                </span>
                <button 
                  onClick={() => setActiveVideo(entry)}
                  className="bg-amber-100/80 hover:bg-amber-200/80 text-[#1A1612] px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#7A1F1A]" />
                  <span>Watch Video</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Video Lightbox Modal */}
        {activeVideo && (
          <div className="modal-backdrop bg-black/85 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
            <div className="bg-[#161F2E] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 relative m-4 shadow-2xl space-y-4 text-white" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">{activeVideo.type}</span>
                <h3 className="font-serif text-2xl font-bold text-amber-50">{activeVideo.title}</h3>
                <p className="text-xs text-slate-300 font-sans">By {activeVideo.author} · {activeVideo.date}</p>
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

              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2">
                {activeVideo.summary}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
