import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Maxfiylik Siyosati | NurQissa AI",
  description: "NurQissa AI platformasining maxfiylik siyosati va foydalanuvchi ma'lumotlarini himoya qilish qoidalari.",
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-pine-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <Shield className="w-4 h-4" />
            <span>NurQissa AI Himoya Siyosati</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-pine-950 dark:text-butter-100">
            Maxfiylik Siyosati (Privacy Policy)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Oxirgi yangilanish: 2026-yil sentabr
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              1. Umumiy qoidalar
            </h2>
            <p>
              «NurQissa AI» (nur-qissa.uz) bolalar uchun tarbiyaviy, ibratli ertaklar va hikoyalar yaratuvchi innovatsion platformadir. Biz foydalanuvchilarimiz, ayniqsa ota-onalar va bolalarning shaxsiy ma'lumotlari xavfsizligini ta'minlashni eng ustuvor vazifa deb bilamiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              2. Qanday ma'lumotlar to'planadi?
            </h2>
            <p>Platformadan foydalanish jarayonida quyidagi ma'lumotlar olinishi mumkin:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Google hisob ma'lumotlari:</b> Google OAuth orqali kirganingizda sizning ismingiz, profilingizdagi rasm va elektron pochta manzilingiz.</li>
              <li><b>Qahramon profili:</b> Ertak yaratish uchun kiritilgan bolaning ismi, yoshi va qiziqishlari.</li>
              <li><b>To'lov ma'lumotlari:</b> Obuna xaridi uchun taqdim etilgan telefon raqami va chek ma'lumoti.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              3. Ma'lumotlardan foydalanish maqsadi
            </h2>
            <p>To'plangan ma'lumotlar faqat quyidagi maqsadlarda ishlatiladi:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bolangiz nomiga moslashtirilgan shaxsiy ertaklar yaratish;</li>
              <li>Foydalanuvchi hisobini saqlash va tizimga xavfsiz kirishni ta'minlash;</li>
              <li>Obuna va balans holatini boshqarish;</li>
              <li>Xizmat sifatini oshirish va texnik qo'llab-quvvatlash.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              4. Ma'lumotlarni uchinchi shaxslarga berilmasligi
            </h2>
            <p>
              Biz sizning yoki farzandingizning shaxsiy ma'lumotlarini hech qachon uchinchi shaxslarga sotmaymiz, ijaraga bermaymiz va reklama tarqatuvchilar bilan bo'lishmaymiz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-black text-pine-900 dark:text-butter-200">
              5. Bog'lanish
            </h2>
            <p>
              Maxfiylik siyosati bo'yicha savollaringiz bo'lsa, rasmiy Telegram manzilimiz (<b>@nurqissaaa_bot</b>) yoki saytdagi qo'llab-quvvatlash xizmati orqali murojaat qilishingiz mumkin.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
