export default function TextareaField() {
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>Description du projet</span>{" "}
        <span className="text-red-500">*</span>
      </label>
      <textarea
        className="border-none outline-none bg-gray-100 p-2 h-24 rounded-md w-full"
        placeholder="Que voulez-vous réaliser ? Pourquoi ? Comment ?(1500 à 2000 caractères max)"
      />
    </div>
  );
}
