import DashboardHeader from "@/components/dashboard/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/SwitchPageBtn";
import {
  ArrowRight,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
} from "lucide-react";

export default function AdminProjectList() {
  const hasProjects = false;
  const isAdmin = true;
  return !isAdmin ? (
    <section>
      <DashboardHeader pageTitle="Mes projets" />
      {hasProjects ? (
        <div>
          <Table />
          <div className="mt-2">
            <button className="bg-primary px-4 py-5 rounded-lg text-gray-50 flex items-center space-x-2 mt-6 text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors ml-auto">
              <span>Soumettre un nouveau projet</span> <ChevronRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-28 text-center space-y-6">
          <h2 className="text-6xl font-bold">
            Vous n'avez encore soumis aucun projet.
          </h2>
          <p className="text-xl text-gray-900">
            Cliquez sur le bouton ci-dessous pour proposer votre première idée
            et participer à l'aventure Project Awards
          </p>
          <div>
            <button className="bg-primary p-4 rounded-lg text-gray-50 flex items-center space-x-2 mt-6 text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors mx-auto">
              <span>Soumettre un nouveau projet</span> <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  ) : (
    <section>
      <DashboardHeader pageTitle="Projets" />
      <div>
        <div className=" flex justify-end space-x-3  mb-5">
          <FilterBtn text="Date" />
          <FilterBtn text="Statut" />
          <FilterBtn text="Catégorie" />
        </div>
        <div className="overflow-x-auto">
          <Table />
        </div>
        <SwitchPageBtn />
      </div>
    </section>
  );
}
