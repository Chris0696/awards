import Link from "next/link";
import ColoredLink from "./ColoredLink";

export default function ProjectsListPageHero() {
  return (
    <section className="bg-primary py-28 text-white">
      <div className="md:w-2/6 mx-auto text-center px-8 md:px-0">
        <h2 className="font-bold text-4xl ">
          Découvrez les projets qui vont changer le monde
        </h2>
        <p className="mt-3 mb-12">
          Sur cette page, vous trouverez tous les projets actuellement en cours
          de vote. Chaque idée a été reformulée par notre équipe pour
          présentation claire et percutante. Votez pour vos coups de coeur et
          contribuez au financement du projet gagnant.
        </p>
        <ColoredLink text="Soumettre mon projet" url="" />
      </div>
    </section>
  );
}
