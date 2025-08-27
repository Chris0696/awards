"use client";
import { useState } from "react";
import CategoryTag from "../../common/CategoryTag";
import Link from "next/link";
import ColoredLink from "../../../components/ui/ColoredLink";
import { ChevronRight } from "lucide-react";
import HappymanImg from "@/assets/happyman.png";
import Image from "next/image";
import ProjectCard from "@/app/(landing)/projects/ProjectCard";

type Category = {
  tagname: string;
  title: string;
};
const categories: Category[] = [
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
];

export default function ProjectsList() {
  const [activeTab, setActiveTab] = useState<string>("");
  return (
    <section className="py-16 bg-gray-100  ">
      <div className="flex justify-center px-8">
        <div className=" mx-auto space-x-3">
          {categories.map((category, idx) => (
            <CategoryTag
              key={idx}
              tagname={category.tagname}
              title={category.title}
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
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <ColoredLink text="Soumettre un projet maintenant" url="/submit" />
      </div>
    </section>
  );
}
