import LandingHero from "@/components/LandingHero";
import HowItWorks from "@/components/HowItWorks";
import StoryShowcase from "@/components/StoryShowcase";
import VirtuesSection from "@/components/VirtuesSection";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <LandingHero />
      <HowItWorks />
      <StoryShowcase />
      <VirtuesSection />
      <PricingSection />
      <Testimonials />
    </div>
  );
}
