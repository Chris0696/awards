import { MoreHorizontalIcon, MoreVerticalIcon } from "lucide-react";

export default function MyProjectCard() {
  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-xs space-y-4">
      <div className="flex justify-between">
        <h2 className="w-3/4">
          <span className="font-medium">Titre du projet : </span>{" "}
          <span className="text-gray-600">
            Solar'Net - Réseau d'énergie solaire pour zone rurale
          </span>{" "}
        </h2>
        <MoreVerticalIcon />
      </div>
      <p>
        <span className="font-semibold">Date de soumission:</span>{" "}
        <span className="text-gray-600">10/04/2025</span>
      </p>
      <p>
        <span className="font-semibold">Nombre de vote reçus:</span>{" "}
        <span className="text-gray-600">1200</span>{" "}
      </p>
      <p>
        <span className="font-semibold">Statut du projet:</span>{" "}
        <span className="text-green-500 bg-green-100 py-1 text-xs px-5 rounded-full">
          Validé
        </span>
      </p>
    </div>
  );
}
