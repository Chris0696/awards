import ProjectOverviewCard from "@/components/dashboard/admin/ProjectOverviewCard";
import DashboardHeader from "@/components/dashboard/DasboardHeader";
import InfobulleCard from "@/components/dashboard/project-owner/InfobulleCard";
import MyProjectCard from "@/components/dashboard/project-owner/MyProjectCard";
import OverviewCard from "@/components/dashboard/project-owner/OverviewCard";

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <ProjectOverviewCard color="text-[#CECE2C]" />
            <ProjectOverviewCard color="text-[#34C759]" />
            <ProjectOverviewCard color="text-[#FF3B30]" />
            <ProjectOverviewCard color="text-[#0026B0]" />
            <ProjectOverviewCard color="text-[#2C2C2E]" />
            <ProjectOverviewCard color="text-[#FF7F00]" />
          </div>
          <div className="grid grid-cols-7">
            <div className="col-span-4 "></div>
            <div className="col-span-3 "></div>
          </div>
        </section>
      )}
    </>
  );
}
