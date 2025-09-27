"use client";
import { NewProjectsChart } from "@/components/dashboard/admin/NewProjectChart";
import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import { VotesChart } from "@/components/dashboard/admin/VotesChart";
import DashboardHeader from "@/app/(dashboard)/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import InfobulleCard from "@/components/dashboard/project-owner/InfobulleCard";
import MyProjectCard from "@/components/dashboard/project-owner/MyProjectCard";
import OverviewCard from "@/components/dashboard/project-owner/OverviewCard";

import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";

import { useProjectStore } from "@/stores/useProjectStore";
import { useDashboardStatsStore } from "@/stores/useDashboardStatsStore";
import { useQuery } from "@tanstack/react-query";
import { getAdmStats } from "@/services/statsService";

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const projects = useProjectStore((state) => state.projects);
  const { getAdminStats, adminStats, getOwnerStats, ownerStats } =
    useDashboardStatsStore();

  useEffect(() => {
    if (user && user?.user_type === "user") {
      getAdminStats();
    }
    if (user && user?.user_type === "owner") {
      getOwnerStats();
    }
  }, [user]);
  const {
    data: stats,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => getAdmStats(),
  });

  if (isLoading) {
    console.log("loading");
  }

  return (
    <>
      {user?.user_type === "owner" ? (
        <section className="space-y-24">
          <DashboardHeader
            pageTitle={`Bienvenu sur votre espace personnel, ${user?.full_name} `}
          />
          <div className="flex  space-x-14">
            <div className="flex space-x-4">
              <OverviewCard
                color="text-[#34C759]"
                title="Projets soumis et validés par Project Awards"
                total={ownerStats?.project_stats.validated}
              />
              <OverviewCard
                color="text-[#CECE2C]"
                title="Projets soumis en cours de validation par Project Awards"
                total={ownerStats?.project_stats.pending}
              />
              <OverviewCard
                color="text-[#FF7F00]"
                title="Total des votes reçus"
                showThumb
                total={ownerStats?.vote_stats.total_votes}
              />
            </div>
            <InfobulleCard />
          </div>
          <div className="pt-6 pb-20 bg-gray-100 rounded-lg space-y-6 px-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Mes projets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects?.map((project) => (
                <MyProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section>
          <DashboardHeader pageTitle="Tableau de bord global" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
            <ProjectOverviewCard
              title="Nombre total de projets soumis"
              total={stats?.general_stats.total}
              color="text-[#CECE2C]"
            />
            <ProjectOverviewCard
              title="Nombre total de projets validés"
              total={stats?.general_stats.validated}
              color="text-[#34C759]"
            />
            <ProjectOverviewCard
              title="Nombre total de projets rejetés"
              total={stats?.general_stats.rejected}
              color="text-[#FF3B30]"
            />
            <ProjectOverviewCard
              title="Total des votes enregistrés"
              total={stats?.vote_stats.total_votes}
              color="text-[#0026B0]"
            />
            <ProjectOverviewCard
              title="Total utilisateurs"
              total={stats?.user_stats.total_users}
              color="text-[#2C2C2E]"
            />
            <ProjectOverviewCard
              title="Revenus générés(Paiment de vote)"
              total={stats?.vote_stats.total_revenue}
              color="text-[#FF7F00]"
            />
          </div>
          <div className="grid  grid-cols-7 gap-4">
            <div className="col-span-7 lg:col-span-4 flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl max-w-sm md:max-w-full overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                {" "}
                <h2 className="text-xl font-medium">Évolution des votes</h2>
                <div className="space-x-2">
                  <FilterBtn text="Mois" />
                  <FilterBtn text="Semain" />
                </div>
              </div>
              <div className="bg-white  rounded-xl md:relative">
                <div className=" mt-10 overflow-x-auto  md:max-w-lg ">
                  <VotesChart />
                </div>
                <button className="md:absolute right-12 top-10 flex items-center text-sm space-x-3">
                  <span className="block h-2 w-6  bg-[#FF7F00] rounded-full "></span>{" "}
                  <span>Revenus généré</span>
                </button>
                <button className="md:absolute right-9 top-16 flex items-center text-sm space-x-3">
                  <span className="block h-2 w-6  bg-[#0026B0] rounded-full "></span>{" "}
                  <span>Nombres de votes</span>
                </button>
              </div>
            </div>
            <div className="col-span-7 lg:col-span-3 flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl max-w-sm md:max-w-full overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-center">
                {" "}
                <h2 className="text-xl text-wrap font-medium w-[200px] ">
                  Nouveau projets publiés par semaine
                </h2>
                <div className="space-x-2">
                  <FilterBtn text="Semaine" />
                  <FilterBtn text="Mois" />
                </div>
              </div>
              <div className="bg-white rounded-xl">
                <div className=" mt-10 max-w-sm md:max-w-lg ">
                  <NewProjectsChart />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
