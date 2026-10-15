import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Foydalanish Shartlari | NurQissa AI",
  description: "NurQissa AI platformasidan foydalanish shartlari va qoidalari.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] text-slate-800 dark:text-butter-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-pine-800 dark:text-butter-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>

        <div className="space-y-3 border-b border-slate-200 dark:border-pine-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-pine-900 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <FileText className="w-4 h-4" />
            <span>Foydalanish Qoidalari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-pine-950 dark:text-butter-100">
            Foydalanish Shartlari (Terms of Service)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Oxirgi yangilanish: 2026-yil sentabr
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              1. Shartlarning qabul qilinishi
            </h2>
            <p>
              «NurQissa AI» (nur-qissa.uz) veb-saytidan yoki xizmatlaridan foydalanish orqali siz ushbu Foydalanish Shartlariga to'liq rozilik bildirasiz. Agar shartlarga rozi bo'lmasangiz, xizmatdan foydalanmasligingizni so'raymiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              2. Xizmat tavsifi
            </h2>
            <p>
              NurQissa AI sun'iy intellekt texnologiyalaridan foydalangan holda bolalar uchun shaxsiylashtirilgan, milliy va axloqiy qadriyatlarga mos ertaklar, 3D illyustratsiyalar hamda audio qissalar yaratish imkonini beradi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              3. Intellektual mulk va mualliflik huquqi
            </h2>
            <p>
              Platformada foydalanuvchi tomonidan yaratilgan ertak matnlari va rasmlar shaxsiy oilaviy foydalanish uchun taqdim etiladi. Platformaning dizayni, dasturiy kodi, logotiplari va brend elementlari NurQissa AI mulki hisoblanadi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              4. Obunalar va to'lovlar
            </h2>
            <p>
              Pullik obunalar va tarif paketlari saytda ko'rsatilgan rasmiy to'lov usullari orqali xarid qilinadi. Har bir paket bo'yicha taqdim etiladigan ertak kreditlari hisobingizga biriktiriladi.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
