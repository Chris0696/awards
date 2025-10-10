"use client";
import { useEffect, useRef, useState } from "react";
import CategoryTag from "../../common/CategoryTag";

import ColoredLink from "../../../components/ui/ColoredLink";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProjectCard from "@/app/(landing)/projects/ProjectCard";

import { useQuery } from "@tanstack/react-query";
import { getPublicProjects } from "@/services/projectService";
import { fetchPublicCategories } from "@/services/categoryService";

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
  category_name: string;
  owner_image: string | null;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - clientWidth
            : scrollLeft + clientWidth,
        behavior: "smooth",
      });
    }
  };

  const checkScrollable = () => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    setCanScroll(scrollWidth > clientWidth + 5);
  };

  const { data: categories } = useQuery({
    queryKey: ["publicCategories"],
    queryFn: () => fetchPublicCategories(),
  });

  const { data: projects } = useQuery({
    queryKey: ["publicProject"],
    queryFn: () => getPublicProjects(),
  });

  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [categories]);
  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects?.filter((project) => project.category_name === activeTab);

  return (
    <section className="py-16 bg-gray-100  ">
      <div className="flex justify-center md:px-8 items-center">
        {canScroll && (
          <button
            type="button"
            className="p-2 rounded-full bg-white shadow mr-2 mt-6 md:mt-0"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex mx-auto space-x-3 overflow-x-auto flex-nowrap scrollbar-hide"
          style={{ scrollBehavior: "smooth", maxWidth: "80vw" }}
        >
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all"
                ? "bg-primary text-white"
                : "border border-primary text-primary hover:bg-primary hover:text-white"
            } px-5 py-2.5 rounded-full cursor-pointer transition-colors mt-6 md:mt-0`}
          >
            Tout
          </button>
          {categories?.map((category, idx) => (
            <CategoryTag
              isActive={activeTab === category.category_name}
              key={idx}
              title={category.category_name}
              handleClick={() => setActiveTab(category.category_name)}
            />
          ))}
        </div>

        {canScroll && (
          <button
            type="button"
            className="p-2 rounded-full bg-white  shadow mt-6 md:mt-0 ml-2"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        )}
      </div>
      <p className="text-gray-500 md:w-3xl mx-auto text-center my-20 leading-5 text-[16px] px-8 md:px-0">
        Ces projets visent à améliorer l'accès à l'éducation, créer des outils
        pédagogiques innovants ou former les jeunes aux compétences de demain.
      </p>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-8 justify-center w-5/6">
          {filteredProjects?.length ? (
            filteredProjects?.map((project, idx) => (
              <ProjectCard project={project} key={idx} />
            ))
          ) : (
            <p className="text-red-500 text-xl">Aucun projet trouvé</p>
          )}
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <ColoredLink text="Soumettre un projet maintenant" url="/submit" />
      </div>
    </section>
  );
}
