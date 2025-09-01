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
import { projectService } from "@/lib/services/projectService";
import { ProjectInput } from "@/app/common/types/project";

type ProjectForm = z.infer<typeof projectSchema>;
export default function SubmitProjectFormContainer() {
  const methods = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      profession: "",
      password: "",
      age: undefined,
      //category_id: undefined,
      category_name: "",
      project_title: "",
      local_area_impact: "",
      estimated_budget: undefined,
      description: "",
      main_objective: "",
      solution: "",
      target_audience: "",
      progress_report: "",
      /* acceptReformulation: false,
      acceptTerms: false, */
    },
  });
  const [step, setStep] = useState(1);
  const onSubmit = async (data: ProjectForm) => {
    console.log(data, "data");

    const payload: ProjectInput = {
      full_name: data.full_name,
      email: data.email,
      country_code: "+229",
      phone: data.phone,
      profession: data.profession,
      password: data.password,
      age: data.age,
      affiliate: "data.affiliate",
      project: {
        //category_id: data.category_id,
        category_name: data.category_name,
        project_title: data.project_title,
        local_area_impact: data.local_area_impact,
        main_objective: data.main_objective,
        solution: data.solution,
        description: data.description,
        estimated_budget: data.estimated_budget,
        target_audience: data.target_audience,
        progress_report: data.progress_report,
        owner_project_status: "brouillon",
      },
    };
    projectService.createProject(payload);
  };
  return (
    <section className="pb-40 pt-28" id="submit-form">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {step === 1 && (
            <FormCard step={1}>
              <div className="space-y-6">
                <TextField
                  name="full_name"
                  label="Nom & prénom"
                  placeholder="Nom & prénom"
                />
                <EmailField
                  name="email"
                  label="Adresse e-mail"
                  placeholder="Example@gmail.com"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhoneNumberField
                    name="phone"
                    label="Numéro de téléphone"
                    placeholder="06 12 34 56 78"
                  />

                  <TextField
                    name="profession"
                    label="Profession ou statut actuel"
                    placeholder="Étudiant, entrepreneur, employé, etc"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordField
                    name="password"
                    label="Mot de passe"
                    placeholder="xxxxxxxxxxxxxxxxx"
                  />
                  <NumberField name="age" label="Âge" placeholder="18" />
                </div>
              </div>
              <div className="mt-16">
                <button
                  type="button"
                  onClick={async () => {
                    const valid = await methods.trigger([
                      "full_name",
                      "email",
                      "phone",
                      "profession",
                      "age",
                      "password",
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
                    const valid = await methods.trigger([
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
          )}
          {step === 3 && (
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
                      const valid = await methods.trigger([
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
          )}

          {step === 4 && (
            <FormCard step={4}>
              <div>
                <div className="flex flex-col space-y-10">
                  {/*  <label
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
                  </label> */}
                  {/* <label
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
                  </label> */}
                  <p>yup</p>
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
