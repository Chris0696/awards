import { MoreVerticalIcon } from "lucide-react";

export default function Table() {
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-white hover:rounded-full transition-colors">
            <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
              <p>Solar'Net - Réseau d'énergie solaire pour zone rurale</p>
            </td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
              Énergie
            </td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
              10/04/2025
            </td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">1200</td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
              <span className="text-green-500 bg-green-100 px-10 py-0.5 rounded-full">
                Validé
              </span>
            </td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">1</td>
            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
              <MoreVerticalIcon />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
