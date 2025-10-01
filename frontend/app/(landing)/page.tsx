import DiscoverProjects from "@/app/(landing)/components/DiscoverProjects";
import FaqSection from "@/app/(landing)/components/FaqSection";

import PartnersSection from "@/app/(landing)/components/PartnersSection";
import SubheroSection from "@/app/(landing)/components/subhero/SubheroSection";

import HomePageHero from "./components/HomepageHero";
import TestimonialsSection from "./components/testimonials/TestimonialsSection";
import HowItWorksSection from "./components/HowItWorksSection";

export default function Home() {
  return (
    <section className="">
      <HomePageHero />
      <SubheroSection />
      <HowItWorksSection />
      <DiscoverProjects />
      {/* <TestimonialsSection /> */}
      <FaqSection title="Faq" />
      {/* <PartnersSection /> */}
    </section>
  );
}
