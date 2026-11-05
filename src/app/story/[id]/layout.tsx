import { Metadata } from 'next';
import { SAMPLE_STORIES } from '@/lib/sampleStories';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const storyId = params.id;
  const sample = SAMPLE_STORIES.find((s) => s.id === storyId);
  let title = sample?.title_uz || 'Sehrli ertak';
  let coverUrl = sample?.cover_image_url || '/apple-touch-icon.png';

  if (!sample) {
    try {
      const { supabaseAdmin } = await import('@/lib/supabase');
      const { data } = await supabaseAdmin
        .from('stories')
        .select('title_uz, cover_image_url')
        .eq('id', storyId)
        .maybeSingle();

      if (data?.title_uz) {
        title = data.title_uz;
        if (data.cover_image_url) {
          coverUrl = data.cover_image_url;
        }
      }
    } catch {}
  }

  return {
    title: `${title} — NurQissa AI`,
    description: `Bolalar uchun shaxsiylashtirilgan ibratli ertak: ${title}`,
    openGraph: {
      title: `${title} — NurQissa AI`,
      description: "NurQissa AI — Farzandingiz qahramon bo'lgan ibratli ertaklar olami",
      images: [
        {
          url: coverUrl,
          width: 1024,
          height: 1024,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — NurQissa AI`,
      description: "NurQissa AI — Farzandingiz qahramon bo'lgan ibratli ertaklar olami",
      images: [coverUrl],
    },
  };
}

export default function StoryLayout({ children }: Props) {
  return <>{children}</>;
}

