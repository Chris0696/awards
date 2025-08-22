import DashboardHeader from "@/components/dashboard/DasboardHeader";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function AdminProjectList() {
  const hasProjects = false;
  return (
    <div>
      <DashboardHeader pageTitle="Mes projets" />
      {hasProjects ? (
        <div>
          <div className="bg-gray-50 px-4 py-8 rounded-xl mt-24">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre du projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de soumission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes reçus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position actuelle
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 text-gray-00 whitespace-normal max-w-[100px] ">
                    <p>Solar'Net - Réseau d'énergie solaire pour zone rurale</p>
                  </td>
                  <td className="px-6 py-4 text-gray-00 whitespace-nowrap">
                    Énergie
                  </td>
                  <td className="px-6 py-4 text-gray-00 whitespace-nowrap">
                    10/04/2025
                  </td>
                  <td className="px-6 py-4 text-gray-00 whitespace-nowrap">
                    1200
                  </td>
                  <td className="px-6 py-4 text-gray-00 whitespace-nowrap">
                    <span className="text-green-500">Validé</span>
                  </td>
                  <td className="px-6 py-4 text-gray-00 whitespace-nowrap">
                    1
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
