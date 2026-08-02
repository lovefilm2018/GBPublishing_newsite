import React from 'react';
import { Bookmark, Feather, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function PerksRibbon() {
  const perks = [
    {
      icon: <Bookmark className="w-6 h-6 text-[#8C2520]" />,
      title: "Free Custom Bookmark",
      desc: "Included with every direct order from GB Publishing."
    },
    {
      icon: <Feather className="w-6 h-6 text-[#D4A359]" />,
      title: "Signed Collector Editions",
      desc: "Author hand-signed copies shipped directly to your door."
    },
    {
      icon: <Truck className="w-6 h-6 text-[#1D2A44]" />,
      title: "Fast UK Delivery",
      desc: "Free UK shipping on orders £25+ with tracked dispatch."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#2D7D46]" />,
      title: "Support Independent Authors",
      desc: "100% of direct proceeds support our indie authors directly."
    }
  ];

  return (
    <section id="perks" className="bg-[#F3EFEA] border-y border-[#E5E0DA] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/70 border border-[#E5E0DA]/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-2.5 rounded-xl bg-white shadow-inner flex-shrink-0">
                {perk.icon}
              </div>
              <div>
                <h4 className="font-sans font-bold text-slate-900 text-sm">{perk.title}</h4>
                <p className="font-sans text-xs text-slate-600 mt-0.5 leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
