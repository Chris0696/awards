import Step1 from "@/app/(landing)/submit/forms/steps/Step1";
import Step2 from "@/app/(landing)/submit/forms/steps/Step2";
import Step3 from "@/app/(landing)/submit/forms/steps/Step3";
import Step4 from "@/app/(landing)/submit/forms/steps/Step4";
import { AdminProjectInfo, ProjectInfo } from "@/app/common/types/project";
import Popover from "@/components/ui/Popover";
import { authProjectSchema } from "@/frontendlib/schemas";
import { projectService } from "@/frontendlib/services/projectService";
import { mapServerErrors } from "@/frontendlib/utils/mapServerErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  project?: ProjectInfo;
  adminProject?: AdminProjectInfo;
};

type AuthProjectInput = z.infer<typeof authProjectSchema>;

export default function CreateNewAuthProjectModal({
  showModal,
  setShowModal,
  project,
  adminProject,
}: Props) {
  console.log(project, "projectsss");
  const methods = useForm<AuthProjectInput>({
    resolver: zodResolver(authProjectSchema),
    mode: "onChange",
    defaultValues: {
      category_id: "",
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
  const { handleSubmit, reset, setError } = methods;
  const [step, setStep] = useState(2);

  const onSubmit = async (data: AuthProjectInput) => {
    const payload = {
      project_id: project?.project_id,
      affiliate: "",
      accept_project_reformulation: data.acceptReformulation,
      accept_terms_of_use: data.acceptTerms,
      category_id: data.category_id,
      project_title: data.project_title,
      local_area_impact: data.local_area_impact,
      main_objective: data.main_objective,
      solution: data.solution,
      description: data.description,
      estimated_budget: data.estimated_budget,
      target_audience: data.target_audience,
      progress_report: data.progress_report,
      owner_project_status: "brouillon",
    };
    try {
      if (project) {
        await projectService.updateProject(payload);
        setShowModal(false);
        reset();
      }
      await projectService.addNewProject(payload);
      setShowModal(false);
      reset();
    } catch (error) {
      const message = mapServerErrors(error, setError);
      toast.error(message);
    }
  };
  useEffect(() => {
    if (project) {
      reset({
        category_id: project.category.category_id ?? "",
        project_title: project.project_title ?? "",
        local_area_impact: project.local_area_impact ?? "Agla",
        estimated_budget: Number(project.estimated_budget ?? undefined),
        description: project.description ?? "",
        main_objective: project.main_objective ?? "Main objective edited",
        solution: project.solution ?? "Solution edited",
        target_audience: project.target_audience ?? "Jeune edited",
        progress_report: project.progress_report ?? "Début edited",
        affiliate: project.affiliate ?? "",
        owner_project_status: project.owner_project_status ?? "publie",
        acceptReformulation: true,
        acceptTerms: true,
      });
    }
  }, [project, reset]);

  return (
    <Popover
      title={project ? "Réformuler le projet" : "Créer un nouveau projet"}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="p-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 2 && <Step2 setStep={setStep} />}
            {step === 3 && <Step3 setStep={setStep} />}
            {step === 4 && (
              <>
                <Step4 />{" "}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between items-center mt-20">
                  <button
                    onClick={() => setStep(3)}
                    className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
                  >
                    <ChevronLeft /> <span>Retourner</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white disabled:cursor-not-allowed"
                  >
                    Soumettre
                  </button>
                </div>
              </>
            )}
          </form>
        </FormProvider>
      </div>
    </Popover>
  );
}
