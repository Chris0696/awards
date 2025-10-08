import AccordionItem from "../../../components/Accordion";
import ColoredOutlineLink from "../../../components/ui/ColoredOutlineLink";

export default function FaqSection({ title }: { title: string }) {
  return (
    <section className="py-16 bg-gray-100">
      <div className="md:w-2/5 mx-auto">
        <div className="text-center space-y-4">
          <h2 className="font-bold text-primary text-4xl px-3 md:px-0">
            {title}{" "}
          </h2>
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
            content="Pour la toute première soumission de projet, des frais de 2000 FCFA sont requis."
          />
          <AccordionItem
            title="Qui peut voter ?"
            content="Toute personne ayant accès à la plateforme peut exprimer son vote pour le projet de son choix."
          />
        </div>
        <div className="flex justify-center mt-16">
          <ColoredOutlineLink text="Contactez notre équipe" url="/contact-us" />
        </div>
      </div>
    </section>
  );
}
