import React from "react";
import DashboardHeader from "../DasboardHeader";
import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import FilterBtn from "@/components/dashboard/FilterBtn";
import { VotesChart } from "@/components/dashboard/admin/VotesChart";
import { NewProjectsChart } from "@/components/dashboard/admin/NewProjectChart";
import { useQuery } from "@tanstack/react-query";
import {
  getAdmStats,
  getDashboardAnalytics,
  getProjectsEvolution,
} from "@/services/statsService";
import { useUserSessionStore } from "@/stores/useUserSessionStore";

export default function AdminHome() {
  const user = useUserSessionStore((state) => state.user);
  const {
    data: stats,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => getAdmStats(),
    enabled: user?.user_type === "user",
  });

  const { data: analytics, isLoading: isloadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => getDashboardAnalytics(),
    enabled: user?.user_type === "user",
  });
  const { data: projetEvolution, isLoading: isloadingProjectEvolution } =
    useQuery({
      queryKey: ["projects-evolution"],
      queryFn: () => getProjectsEvolution(),
      enabled: user?.user_type === "user",
    });
  return (
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
          title="Revenus générés(Paiment de vote) en Fcfa"
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
  );
}
