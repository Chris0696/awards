import { ChevronLeft } from "lucide-react";
import FileInputField from "../FileInputField";
import FormCard from "../FormCard";
import NumberField from "../NumberField";
import SelectField from "../SelectField";
import TextField from "../TextField";
import { useFormContext } from "react-hook-form";

export default function Step2({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const { trigger } = useFormContext();
  return (
    <FormCard step={2}>
      <div className="space-y-6">
        <TextField
          name="project_title"
          label="Nom du projet"
          placeholder="Titre clair et accrocheur pour présenter le projet"
        />
        <TextField
          name="local_area_impact"
          label="Zone géographique d'impact"
          placeholder='Ex: "Cotonou", "Nord du Bénin", "Afrique francophone" '
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField name="category_name" />

          <NumberField
            name="estimated_budget"
            label="Budget estimé"
            placeholder="Ex: 1 000 000"
          />
        </div>
      </div>
      <div className="mt-10">
        <FileInputField />
      </div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mt-6">
        <button
          onClick={() => setStep(1)}
          className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
        >
          <ChevronLeft /> <span>Retourner</span>
        </button>
        <button
          type="button"
          onClick={async () => {
            const valid = await trigger([
              "project_title",
              "local_area_impact",
              "category_name",
              "estimated_budget",
            ]);
            if (valid) setStep(3);
          }}
          className="bg-secondary px-10 w-full md:w-auto  py-2.5 cursor-pointer text-lg rounded-md text-white"
        >
          Continuer
        </button>
      </div>
    </FormCard>
  );
}
