import { ChevronDown } from "lucide-react";

export default function SelectField() {
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>Catégorie du projet</span>
        <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select className="appearance-none border-none outline-none bg-gray-100 px-2 py-2 rounded-md w-full text-gray-500 text-lg">
          <option value="">Sélectionnez une catégorie</option>
          <option value="categorie1">Catégorie 1</option>
          <option value="categorie2">Catégorie 2</option>
          <option value="categorie3">Catégorie 3</option>
        </select>
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <ChevronDown size={20} />
        </span>
      </div>
    </div>
  );
}
