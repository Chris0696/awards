import DiscoverProjects from "@/components/DiscoverProjects";
import FaqSection from "@/components/FaqSection";
import HomePageHero from "@/components/HomepageHero";
import HowItWorksSection from "@/components/HowItWorksSection";
import PartnersSection from "@/components/PartnersSection";
import SubheroSection from "@/components/SubheroSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <section className="">
      <HomePageHero />
      <SubheroSection />
      <HowItWorksSection />
      <DiscoverProjects />
      <TestimonialsSection />
      <FaqSection title="Faq" />
      <PartnersSection />
    </section>
  );
}
