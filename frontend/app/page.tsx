import DiscoverProjects from "@/components/DiscoverProjects";
import FaqSection from "@/components/FaqSection";
import Header from "@/components/Header";
import HomePageHero from "@/components/HomepageHero";
import HowItWorksSection from "@/components/HowItWorksSection";
import PartnersSection from "@/components/PartnersSection";
import SubheroSection from "@/components/SubheroSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <section className="">
      <Header />
      <HomePageHero />
      <SubheroSection />
      <HowItWorksSection />
      <DiscoverProjects />
      <TestimonialsSection />
      <FaqSection />
      <PartnersSection />
    </section>
  );
}
