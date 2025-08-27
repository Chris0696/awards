import SubmitProjectFormContainer from "@/app/(landing)/submit/forms/SubmitProjectFormContainer";
import SubmitHeroSection from "./SubmitHeroSection";

export default function page() {
  return (
    <section>
      <SubmitHeroSection />
      <SubmitProjectFormContainer />
    </section>
  );
}
