"use client";
import { useEffect, useState } from "react";
import CategoryTag from "../../common/CategoryTag";
import Link from "next/link";
import ColoredLink from "../../../components/ui/ColoredLink";
import { ChevronRight } from "lucide-react";
import HappymanImg from "@/assets/happyman.png";
import Image from "next/image";
import ProjectCard from "@/app/(landing)/projects/ProjectCard";
import { useProjectStore } from "@/stores/useProjectStore";
import { useCategories } from "@/hooks/useCategories";

type Category = {
  tagname: string;
  title: string;
};
export type PublicProject = {
  project_id: string;
  slug: string;
  project_title: string;
  description: string;
  estimated_budget: string;
  featured: boolean;
  created_at: string;
  validated_at: string;
  owner_name: string;
  image: string | null;
  image_url: string | null;
  average_rating: number;
  total_votes: number;
};
/* const categories: Category[] = [
  {
    tagname: "education",
    title: "Éducation & Formation",
  },
  {
    tagname: "health",
    title: "Santé & Bien-être",
  },
  {
    tagname: "culture",
    title: "Art & Culture",
  },
  {
    tagname: "agro",
    title: "Agriculture & Agroalimentaire",
  },
]; */

export default function ProjectsList() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const getProjects = useProjectStore((state) => state.setPublicProjects);
  const projects = useProjectStore((state) => state.publicProjects);

  const { categories, loading } = useCategories();

  useEffect(() => {
    getProjects();
  }, []);
  return (
    <section className="py-16 bg-gray-100  ">
      <div className="flex justify-center px-8">
        <div className=" mx-auto space-x-3">
          <button
            onClick={() => setActiveTab("all")}
            className={` ${
              activeTab === "all"
                ? "bg-primary text-white"
                : "border border-primary text-primary hover:bg-primary hover:text-white"
            }  px-5 py-2.5 rounded-full  cursor-pointer transition-colors mt-6 md:mt-0`}
          >
            Tout
          </button>
          {categories.map((category, idx) => (
            <CategoryTag
              isActive={activeTab === category.category_name}
              key={idx}
              title={category.category_name}
              handleClick={() => setActiveTab(category.category_name)}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-500 md:w-3xl mx-auto text-center my-20 leading-5 text-[16px] px-8 md:px-0">
        Ces projets visent à améliorer l'accès à l'éducation, créer des outils
        pédagogiques innovants ou former les jeunes aux compétences de demain.
      </p>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-8 justify-center w-5/6">
          {projects.map((project, idx) => (
            <ProjectCard project={project} key={idx} />
          ))}
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <ColoredLink text="Soumettre un projet maintenant" url="/submit" />
      </div>
    </section>
  );
}
