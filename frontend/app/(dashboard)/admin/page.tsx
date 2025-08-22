import DashboardHeader from "@/components/dashboard/DasboardHeader";
import InfobulleCard from "@/components/dashboard/project-owner/InfobulleCard";
import MyProjectCard from "@/components/dashboard/project-owner/MyProjectCard";
import OverviewCard from "@/components/dashboard/project-owner/OverviewCard";

export default function AdminPage() {
  return (
    <section className="space-y-24">
      <DashboardHeader pageTitle="Tableau de bord général" />
      <div className="flex  space-x-14">
        <div className="flex space-x-4">
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
        </div>
        <InfobulleCard />
      </div>
      <div className="pt-6 pb-20 bg-gray-100 rounded-lg space-y-6 px-3">
        <h2 className="text-2xl font-semibold text-gray-900">Mes projets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <MyProjectCard />
          <MyProjectCard />
          <MyProjectCard />
          <MyProjectCard />
        </div>
      </div>
    </section>
  );
}
