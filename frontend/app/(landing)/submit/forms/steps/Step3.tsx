import { ChevronLeft } from "lucide-react";
import FormCard from "../FormCard";
import TextareaField from "../TextareaField";
import TextField from "../TextField";
import { useFormContext } from "react-hook-form";

export default function Step3({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const { trigger } = useFormContext();
  return (
    <FormCard step={3}>
      <div className="space-y-6">
        <TextareaField name="description" />
        <TextField
          name="main_objective"
          label="Objectif principal"
          placeholder="Quel est le but ultime de ce projet ? (Ex: Réduire le taux d'abandon scolaire)"
        />
        <TextField
          name="solution"
          label="Problème que votre projet resout"
          placeholder="Quel problème essayez-vous de résoudre ?"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            name="target_audience"
            label="Public cible"
            placeholder="À qui s'adresse le projet ?"
          />
          <TextField
            name="progress_report"
            label="État d'avancement"
            placeholder="Où en êtes-vous ?"
          />
        </div>
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mt-6">
          <button
            onClick={() => setStep(2)}
            className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
          >
            <ChevronLeft /> <span>Retourner</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const valid = await trigger([
                "description",
                "main_objective",
                "target_audience",
                "progress_report",
                "solution",
              ]);
              if (valid) setStep(4);
            }}
            className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
          >
            Continuer
          </button>
        </div>
      </div>
    </FormCard>
  );
}
