import ProjectsList from "@/components/ProjectsList";
import ProjectsListCTAsection from "@/components/ProjectsListCTAsection";
import ProjectsListPageHero from "@/components/ProjectsListPageHero";
import { ChevronRight, Image } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <section className=" ">
      <ProjectsListPageHero />
      <ProjectsList />
      <ProjectsListCTAsection />
    </section>
  );
}
