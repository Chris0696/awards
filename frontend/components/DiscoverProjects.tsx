import Link from "next/link";
import ProjectCard from "./ProjectCard";

export default function DiscoverProjects() {
  return (
    <section className="my-20 bg-gray-50">
      <div className="w-4/5 md:w-2/5 mx-auto text-center py-12">
        {" "}
        <h4 className="text-lg text-gray-500 font-medium">
          PROJETS EN COURS DE VOTE
        </h4>
        <h2 className="text-primary text-3xl font-semibold mt-5 mb-2">
          Découvrez les projets en lice actuellement
        </h2>
        <p className="text-lg text-gray-500">
          Explorez, soutenez et votez pour les idées les plus inspirantes de la
          communauté. Chaque vote compte. C'est grâce à vous que ces projets
          peuvent voir le jour.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap gap-8 justify-center w-5/6">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>

      <div className="flex justify-center pt-24 pb-20">
        <Link
          href={""}
          className="bg-secondary hover:bg-gray-100 hover:text-secondary text-gray-100 px-8 py-3 rounded-md  cursor-pointer  transition-colors"
        >
          Voir tous les projets en cours{" "}
        </Link>
      </div>
    </section>
  );
}
