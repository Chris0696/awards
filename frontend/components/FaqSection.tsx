import Link from "next/link";
import AccordionItem from "./Accordion";
import Accordion from "./Accordion";
import ColoredOutlineLink from "./ColoredOutlineLink";

export default function FaqSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="md:w-2/5 mx-auto">
        <div className="text-center space-y-4">
          <h2 className="font-bold text-primary text-4xl">Faq</h2>
          <p className="text-gray-600 text-lg">Vos questions, nos réponses</p>
        </div>
        <div className="max-w-2xl mx-auto mt-10 space-y-4 px-4">
          <AccordionItem
            title="Comment soumettre mon idée de projet ?"
            content="Il vous suffit de créer un compte sur notre plateforme, remplir le formulaire et soumettre votre projet."
          />
          <AccordionItem
            title="Est-ce que tous les projets sont financés ?"
            content="Non, seuls les projets sélectionnés par le jury ou ayant obtenu suffisamment de votes seront financés."
          />
          <AccordionItem
            title="Quels types de projets peut-on proposer ?"
            content="Tous types de projets innovants ou à impact social sont les bienvenus, qu’ils soient technologiques, culturels ou sociaux."
          />
          <AccordionItem
            title="Le service est-il payant ?"
            content="Non, le dépôt de projet est entièrement gratuit."
          />
          <AccordionItem
            title="Qui peut voter ?"
            content="Toute personne inscrite sur la plateforme peut voter pour son projet favori."
          />
        </div>
        <div className="flex justify-center mt-16">
          <ColoredOutlineLink text="Contactez notre équipe" url="" />
        </div>
      </div>
    </section>
  );
}
