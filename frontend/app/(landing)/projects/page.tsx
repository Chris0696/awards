import ProjectsList from "@/app/(landing)/projects/ProjectsList";
import ProjectsListCTAsection from "@/app/(landing)/projects/ProjectsListCTAsection";

import ProjectsListPageHero from "./ProjectsListPageHero";

export default function page() {
  return (
    <section className=" ">
      <ProjectsListPageHero />
      <ProjectsList />
      <ProjectsListCTAsection />
    </section>
  );
}
