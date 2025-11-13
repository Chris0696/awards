"use client";
import ProjectCard from "@/app/(landing)/projects/ProjectCard";
import ColoredLink from "../../../components/ui/ColoredLink";

import { useQuery } from "@tanstack/react-query";
import { getPublicProjects } from "@/services/projectService";

export default function DiscoverProjects() {
  const { data: projects } = useQuery({
    queryKey: ["publicProject"],
    queryFn: () => getPublicProjects(),
  });
  return (
    <section className="mt-[340px] sm:mt-80 mb-16 md:my-20 bg-gray-50">
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
          {projects?.slice(0, 6).map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>
      </div>

      <div className="flex justify-center py-12 md:pt-24  md:pb-20">
        <ColoredLink text="Voir tous les projets en cours" url="/projects" />
      </div>
    </section>
  );
}
