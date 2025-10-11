"use client";
import OverviewCard from "@/components/dashboard/project-owner/OverviewCard";
import DashboardHeader from "./DasboardHeader";
import InfobulleCard from "@/components/dashboard/project-owner/InfobulleCard";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useQuery } from "@tanstack/react-query";
import { getProjectsAsOwner } from "@/services/projectService";
import { getOwnerStats } from "@/services/statsService";
import MyProjectCard from "@/components/dashboard/project-owner/MyProjectCard";
import Loader from "@/components/Loader";
import { ProjectInfo } from "../common/types/project";

export default function OwnerHome() {
  const user = useUserSessionStore((state) => state.user);

  const {
    data: projects,
    isLoading: isLoadingProjects,
    isPending: isPendingProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsAsOwner(),
    enabled: user?.user_type === "owner",
  });

  const {
    data: ownerStats,
    isLoading: isLoadingOwnerStats,
    isPending: isPendingOwnerStats,
  } = useQuery({
    queryKey: ["ownerStats"],
    queryFn: () => getOwnerStats(),
    enabled: user?.user_type === "owner",
  });

  const isLoading =
    isLoadingProjects ||
    isPendingProjects ||
    isLoadingOwnerStats ||
    isPendingOwnerStats;

  if (isLoading) {
    return <Loader message="Chargement de votre tableau de bord..." />;
  }

  return (
    <section className="space-y-24">
      <DashboardHeader
        pageTitle={`Bienvenue sur votre espace personnel, ${user?.full_name} `}
      />
      <div className="space-y-10 lg:space-y-24">
        <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0  lg:space-x-14">
          <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0  lg:space-x-4">
            <OverviewCard
              color="text-[#34C759]"
              title="Projets soumis et validés par Project Awards"
              total={ownerStats?.project_stats.validated}
            />
            <OverviewCard
              color="text-[#CECE2C]"
              title="Projets soumis en cours de validation par Project Awards"
              total={ownerStats?.project_stats.draft}
            />
            <OverviewCard
              color="text-[#FF7F00]"
              title="Total des votes reçus"
              showThumb
              total={ownerStats?.vote_stats.total_votes_purchased}
            />
          </div>
          <InfobulleCard />
        </div>
        <div className="pt-6 pb-20 bg-gray-100 rounded-lg space-y-6 px-3">
          <h2 className="text-2xl font-semibold text-gray-900">Mes projets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects?.map((project: ProjectInfo) => (
              <MyProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
