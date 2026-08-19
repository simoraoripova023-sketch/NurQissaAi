'use client';

import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Testimonials() {
  const { locale } = useAppStore();

  const reviews = [
    {
      name: locale === 'uz' ? "Dilnoza Rahimova" : "Dilnoza R.",
      role: locale === 'uz' ? "3 farzandning onasi (Toshkent)" : "Mother of 3, Tashkent",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      comment: locale === 'uz'
        ? "O'g'lim Ali har oqshom o'zi bosh qahramon bo'lgan ertakni eshitishni intizorlik bilan kutadi. Eng muhimi, o'yinchoqlarini ukasiga ulashishni va 'Alhamdulillah' deyishni o'rgandi!"
        : "My son Ali looks forward to bedtime every single night because he is the hero of the story. Best of all, it naturally helped him learn patience and sharing!",
    },
    {
      name: locale === 'uz' ? "Jasur va Nilufar Karimovlar" : "Jasur & Nilufar K.",
      role: locale === 'uz' ? "Ota-ona (Samarqand)" : "Parents, Samarkand",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      comment: locale === 'uz'
        ? "Qattiq muqovali kitobini buyurtma qildik, sifati shunchaki ajoyib! Sahifadagi rasmda qizimiz Madinaning qiyofasi aniq chiqqan. Oilaviy bebaho xazinaga aylandi."
        : "We ordered the hardcover physical book and the print quality blew us away! Our daughter Madina was ecstatic seeing her face inside a real fairytale book.",
    },
    {
      name: locale === 'uz' ? "Gulnoza Usmonova" : "Gulnoza U.",
      role: locale === 'uz' ? "Bolalar psixologi va murabbiy" : "Child Psychologist & Educator",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      comment: locale === 'uz'
        ? "Ertak oxiridagi ota-ona bilan suhbat savollari va kichik duo bo'limi juda professional ishlab chiqilgan. Bu bolada hissiy intellekt va ma'naviyatni rivojlantiradi."
        : "The reflection questions and bedtime dua at the end of each storybook are brilliantly crafted for deep parent-child bonding and emotional intelligence.",
    },
  ];

  return (
    <section className="py-20 bg-[#FFFDF5] dark:bg-[#002621] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{locale === 'uz' ? "Ota-onalar fikri" : "Parent Reviews"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
            {locale === 'uz' ? "Mehr bilan aytilgan samimiy so'zlar" : "Loved by 10,000+ Happy Families"}
          </h2>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#01342e] p-8 rounded-3xl border border-amber-200/70 dark:border-emerald-700/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-amber-300/80 dark:text-emerald-700" />

                <p className="text-sm text-slate-700 dark:text-emerald-100 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-amber-100 dark:border-emerald-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-amber-300 dark:border-emerald-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1E1B4B] dark:text-amber-200">{rev.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
