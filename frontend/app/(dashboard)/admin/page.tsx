import { NewProjectsChart } from "@/components/dashboard/admin/NewProjectChart";
import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import { VotesChart } from "@/components/dashboard/admin/VotesChart";
import DashboardHeader from "@/components/dashboard/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import InfobulleCard from "@/components/dashboard/project-owner/InfobulleCard";
import MyProjectCard from "@/components/dashboard/project-owner/MyProjectCard";
import OverviewCard from "@/components/dashboard/project-owner/OverviewCard";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  const isAdmin = true;
  return (
    <>
      {!isAdmin ? (
        <section className="space-y-24">
          <DashboardHeader pageTitle="Bienvenu sur votre espace personnel, Mireille" />
          <div className="flex  space-x-14">
            <div className="flex space-x-4">
              <OverviewCard />
              <OverviewCard />
              <OverviewCard />
            </div>
            <InfobulleCard />
          </div>
          <div className="pt-6 pb-20 bg-gray-100 rounded-lg space-y-6 px-3">
            <h2 className="text-2xl font-semibold text-gray-900">
              Mes projets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <MyProjectCard />
              <MyProjectCard />
              <MyProjectCard />
              <MyProjectCard />
            </div>
          </div>
        </section>
      ) : (
        <section>
          <DashboardHeader pageTitle="Tableau de bord global" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-10 gap-4">
            <ProjectOverviewCard color="text-[#CECE2C]" />
            <ProjectOverviewCard color="text-[#34C759]" />
            <ProjectOverviewCard color="text-[#FF3B30]" />
            <ProjectOverviewCard color="text-[#0026B0]" />
            <ProjectOverviewCard color="text-[#2C2C2E]" />
            <ProjectOverviewCard color="text-[#FF7F00]" />
          </div>
          <div className="grid  md:grid-cols-7 gap-4">
            <div className=" md:col-span-4 flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl ">
              <div className="flex flex-col md:flex-row justify-between items-center">
                {" "}
                <h2 className="text-xl font-medium">Évolution des votes</h2>
                <div className="space-x-2">
                  <FilterBtn text="Mois" />
                  <FilterBtn text="Semain" />
                </div>
              </div>
              <div className="bg-white rounded-xl relative">
                <div className=" mt-10 max-w-sm md:max-w-lg ">
                  <VotesChart />
                </div>
                <button className="absolute right-12 top-10 flex items-center text-sm space-x-3">
                  <span className="block h-2 w-6  bg-[#FF7F00] rounded-full "></span>{" "}
                  <span>Revenus généré</span>
                </button>
                <button className="absolute right-9 top-16 flex items-center text-sm space-x-3">
                  <span className="block h-2 w-6  bg-[#0026B0] rounded-full "></span>{" "}
                  <span>Nombres de votes</span>
                </button>
              </div>
            </div>
            <div className=" md:col-span-3 flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl">
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
                <div className=" mt-10 max-w-lg ">
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
