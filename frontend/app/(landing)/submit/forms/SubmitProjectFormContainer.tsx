"use client";
import Link from "next/link";
import EmailField from "./EmailField";
import FileInputField from "./FileInputField";
import FormCard from "./FormCard";
import NumberField from "./NumberField";
import PasswordField from "./PasswordField";
import PhoneNumberField from "./PhoneNumberField";
import SelectField from "./SelectField";
import TextareaField from "./TextareaField";
import TextField from "./TextField";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { projectSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type ProjectForm = z.infer<typeof projectSchema>;
export default function SubmitProjectFormContainer() {
  const methods = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      poFullname: "",
      poEmail: "",
      poPhonenumber: "",
      poProfession: "",
      poPassword: "",
      poAge: undefined,
      projectName: "",
      projectArea: "",
      projectCategory: "",
      projectBudget: undefined,
      projectDescription: "",
      projectGoal: "",
      projectInterest: "",
      projectTarget: "",
      projectLevel: "",
      acceptReformulation: false,
      acceptTerms: false,
    },
  });
  const [step, setStep] = useState(1);
  const onSubmit = (data: ProjectForm) => {
    console.log(data, "data");
  };
  return (
    <section className="pb-40 pt-28" id="submit-form">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 1 && (
            <FormCard step={1}>
              <div className="space-y-6">
                <TextField
                  name="poFullname"
                  label="Nom & prénom"
                  placeholder="Nom & prénom"
                />
                <EmailField
                  name="poEmail"
                  label="Adresse e-mail"
                  placeholder="Example@gmail.com"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneNumberField
                    name="poPhonenumber"
                    label="Numéro de téléphone"
                    placeholder="06 12 34 56 78"
                  />

                  <TextField
                    name="poProfession"
                    label="Profession ou statut actuel"
                    placeholder="Étudiant, entrepreneur, employé, etc"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordField
                    name="poPassword"
                    label="Mot de passe"
                    placeholder="xxxxxxxxxxxxxxxxx"
                  />
                  <NumberField name="poAge" label="Âge" placeholder="18" />
                </div>
              </div>
              <div className="mt-16">
                <button
                  type="button"
                  onClick={async () => {
                    const valid = await methods.trigger([
                      "poFullname",
                      "poEmail",
                      "poPhonenumber",
                      "poProfession",
                      "poPassword",
                      "poAge",
                    ]);
                    if (valid) setStep(2);
                  }}
                  className="bg-secondary px-4 py-2 rounded-md text-white w-full cursor-pointer"
                >
                  Soumettre
                </button>
              </div>
            </FormCard>
          )}

          {step === 2 && (
            <FormCard step={2}>
              <div className="space-y-6">
                <TextField
                  name="projectName"
                  label="Nom du projet"
                  placeholder="Titre clair et accrocheur pour présenter le projet"
                />
                <TextField
                  name="projectArea"
                  label="Zone géographique d'impact"
                  placeholder='Ex: "Cotonou", "Nord du Bénin", "Afrique francophone" '
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField name="projectCategory" />

                  <NumberField
                    name="projectBudget"
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
                    const valid = await methods.trigger([
                      "projectName",
                      "projectArea",
                      "projectCategory",
                      "projectBudget",
                    ]);
                    if (valid) setStep(3);
                  }}
                  className="bg-secondary px-10 w-full md:w-auto  py-2.5 cursor-pointer text-lg rounded-md text-white"
                >
                  Continuer
                </button>
              </div>
            </FormCard>
          )}
          {step === 3 && (
            <FormCard step={3}>
              <div className="space-y-6">
                <TextareaField name="projectDescription" />
                <TextField
                  name="projectGoal"
                  label="Objectif principal"
                  placeholder="Quel est le but ultime de ce projet ? (Ex: Réduire le taux d'abandon scolaire)"
                />
                <TextField
                  name="projectInterest"
                  label="Problème que votre projet resout"
                  placeholder="Quel problème essayez-vous de résoudre ?"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    name="projectTarget"
                    label="Public cible"
                    placeholder="À qui s'adresse le projet ?"
                  />
                  <TextField
                    name="projectLevel"
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
                      const valid = await methods.trigger([
                        "projectDescription",
                        "projectGoal",
                        "projectInterest",
                        "projectTarget",
                        "projectLevel",
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
          )}

          {step === 4 && (
            <FormCard step={4}>
              <div>
                <div className="flex flex-col space-y-10">
                  <label
                    htmlFor="acceptReformulation"
                    className="flex items-center space-x-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...methods.register("acceptReformulation", {
                        required: true,
                      })}
                      id="acceptReformulation"
                      className="w-8 h-8 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition cursor-pointer"
                    />{" "}
                    <span className="text-gray-900 text-xl font-medium">
                      J'accepte que mon projet soit reformulé par l'équipe
                      Project Awards selon les critères du site.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                    {methods.formState.errors.acceptReformulation && (
                      <span className="text-red-500 text-sm block">
                        {methods.formState.errors.acceptReformulation.message}
                      </span>
                    )}
                  </label>
                  <label
                    htmlFor="acceptTerms"
                    className="flex items-center space-x-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...methods.register("acceptTerms", { required: true })}
                      id="acceptTerms"
                      className="w-7 h-7 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition"
                    />
                    <span className="text-gray-900 text-xl font-medium">
                      J'ai lu et j'accepte{" "}
                      <Link href={""} className="text-secondary underline">
                        les conditions d'utilisation
                      </Link>
                    </span>
                    <span className="text-red-500">*</span>
                    {methods.formState.errors.acceptTerms && (
                      <span className="text-red-500 text-sm block">
                        {methods.formState.errors.acceptTerms.message}
                      </span>
                    )}
                  </label>
                </div>
                <div className="flex flex-col space-y-2 md:space-y-0 justify-between items-center mt-20">
                  <button
                    onClick={() => setStep(3)}
                    className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
                  >
                    <ChevronLeft /> <span>Retourner</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </FormCard>
          )}
        </form>
      </FormProvider>
    </section>
  );
}
