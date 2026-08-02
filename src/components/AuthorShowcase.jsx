import React from 'react';
import { Feather, BookOpen, ArrowRight } from 'lucide-react';

export default function AuthorShowcase({ onSelectAuthor }) {
  const authors = [
    {
      name: "Özlem Warren",
      role: "Gourmand Award Winner & Turkish Culinary Author",
      bio: "Renowned international Turkish culinary expert, author of Özlem's Turkish Table, celebrating vibrant Turkish heritage and authentic dishes.",
      image: "https://static.wixstatic.com/media/7c7af8_a981779d022c4bce99ef1ceaab990dec~mv2.jpg",
      booksCount: "Turkish Table & Regional Recipes"
    },
    {
      name: "Anthony & Wendy Kimberley",
      role: "Fine Art & Children's Picture Book Creators",
      bio: "Acclaimed author-illustrator duo blending fine art oil paintings with enchanting children's stories like Grandad, Let's Go For a Walk.",
      image: "https://static.wixstatic.com/media/7c7af8_e0e53d13f359412b9a182892fbb51691~mv2.jpg",
      booksCount: "Picture Books & Fine Art"
    },
    {
      name: "P Thornton",
      role: "Astrological Culinary Specialist",
      bio: "Creator of The Zodiac Cooks series, combining planetary astrology with romance and romantic date-night dining.",
      image: "https://static.wixstatic.com/media/7c7af8_12677724088b4ed1af8a70a7bc987e7d~mv2.jpg",
      booksCount: "Zodiac Cooks Series"
    },
    {
      name: "Clare Latham",
      role: "Charity & Children's Author",
      bio: "Author of Erin & the Mouse, dedicated to creating heartfelt children's picture books that support crisis relief and charity causes.",
      image: "https://static.wixstatic.com/media/7c7af8_a84413fb280f4895ab88f85a5ff9c90b~mv2.jpg",
      booksCount: "Erin & the Mouse Series"
    }
  ];

  return (
    <section className="py-16 bg-[#F3EFEA] border-t border-[#E5E0DA]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#8C2520] font-sans font-bold text-xs uppercase tracking-widest block mb-1">
            FEATURED CREATORS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Meet Our Independent Authors
          </h2>
          <p className="text-slate-600 font-sans text-sm mt-2">
            Every GB Publishing book is born from authentic passion, craftsmanship, and indie publishing independence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {authors.map((author, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E5E0DA] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#D4A359] p-1 bg-amber-50 shadow-md">
                  <img src={author.image} alt={author.name} className="w-full h-full object-cover rounded-full" />
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">{author.name}</h3>
                  <span className="text-[11px] font-semibold text-[#8C2520] block mt-0.5">{author.role}</span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                  {author.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-center">
                <button 
                  onClick={() => onSelectAuthor(author.name)}
                  className="text-xs font-bold font-sans text-[#1D2A44] hover:text-[#8C2520] inline-flex items-center gap-1 transition-colors"
                >
                  <span>View Author Titles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
