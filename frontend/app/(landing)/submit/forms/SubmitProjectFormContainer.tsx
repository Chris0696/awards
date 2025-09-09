"use client";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { ProjectInput } from "@/app/common/types/project";
import ThanksNoteModal from "@/components/modals/ThanksNoteModal";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

import { toast } from "sonner";
import { formatPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { projectSchema } from "@/frontendlib/schemas";
import { projectService } from "@/frontendlib/services/projectService";
import { mapServerErrors } from "@/frontendlib/utils/mapServerErrors";

type ProjectForm = z.infer<typeof projectSchema>;
export default function SubmitProjectFormContainer() {
  const [showModal, setShowModal] = useState(false);

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
      category_id: "",
      //category_name: "",
      project_title: "",
      local_area_impact: "",
      estimated_budget: undefined,
      description: "",
      main_objective: "",
      solution: "",
      target_audience: "",
      progress_report: "",
      affiliate: "",
      owner_project_status: "brouillon",
      acceptReformulation: false,
      acceptTerms: false,
    },
  });
  const {
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [step, setStep] = useState(1);
  const onSubmit = async (data: ProjectForm) => {
    const payload: ProjectInput = {
      full_name: data.full_name,
      email: data.email,
      country_code: `+${parsePhoneNumber(data.phone)?.countryCallingCode}`,
      phone: formatPhoneNumber(data.phone).replaceAll(" ", ""),
      profession: data.profession,
      password: data.password,
      age: data.age,
      affiliate: "",
      accept_project_reformulation: data.acceptReformulation,
      accept_terms_of_use: data.acceptTerms,
      project: {
        category_id: data.category_id,
        //category_name: data.category_name,
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
    try {
      await projectService.createProject(payload);
      setShowModal(true);
      reset();
      setStep(1);
    } catch (error) {
      const message = mapServerErrors(error, setError);
      toast.error(message);
    }
  };
  return (
    <section className="pb-40 pt-28" id="submit-form">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && <Step1 setStep={setStep} />}

          {step === 2 && <Step2 setStep={setStep} />}
          {step === 3 && <Step3 setStep={setStep} />}

          {step === 4 && (
            <div>
              <Step4 />
              <div className="w-full px-5 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between items-center mt-20">
                  <button
                    onClick={() => setStep(3)}
                    className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
                  >
                    <ChevronLeft /> <span>Retourner</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "En cours..." : "Soumettre maintenant"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
      {showModal && (
        <ThanksNoteModal
          title="Soumission réussie"
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </section>
  );
}
