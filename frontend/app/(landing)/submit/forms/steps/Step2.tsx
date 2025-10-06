"use client";
import { ChevronLeft } from "lucide-react";
import FileInputField from "../FileInputField";
import FormCard from "../FormCard";
import NumberField from "../NumberField";
import SelectField from "../SelectField";
import TextField from "../TextField";
import { useFormContext } from "react-hook-form";

import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useEffect, useState } from "react";

export default function Step2({
  setStep,
  preview,
  project,
  adminProject,
}: {
  setStep: (step: number) => void;
  preview: string | null;
  project?: any;
  adminProject?: any;
}) {
  const { trigger, watch, setValue } = useFormContext();
  const user = useUserSessionStore((state) => state.user);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const isOnEditMode = Boolean(project) || Boolean(adminProject);
  const cat = watch("category_id");
  useEffect(() => {
    if (cat === "other") setShowCustomCategory(true);
  }, [cat]);

  return (
    <FormCard isOnEditMode={isOnEditMode} step={2}>
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
          {showCustomCategory && (
            <div>
              <TextField
                showSpecialIcon
                onClick={() => {
                  setShowCustomCategory(false);
                  setValue("category_id", "");
                }}
                name="custom_category_name"
                label="Nom de votre catégorie"
                placeholder="Saisissez le nom de la catégorie qui correspond le mieux à votre projet "
              />
            </div>
          )}

          {!showCustomCategory && <SelectField name="category_id" />}

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
        {!user && (
          <button
            onClick={() => setStep(1)}
            className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
          >
            <ChevronLeft /> <span>Retourner</span>
          </button>
        )}
        <button
          type="button"
          onClick={async () => {
            const fields = [
              "project_title",
              "local_area_impact",
              "category_id",
              "estimated_budget",
            ];
            if (cat === "other") {
              fields.push("custom_category_name");
            }
            const valid = await trigger(fields);
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
