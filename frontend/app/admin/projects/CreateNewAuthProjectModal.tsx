import Step2 from "@/app/(landing)/submit/forms/steps/Step2";
import Step3 from "@/app/(landing)/submit/forms/steps/Step3";
import Step4 from "@/app/(landing)/submit/forms/steps/Step4";
import Step5 from "@/app/(landing)/submit/forms/steps/Step5";

import { AdminProjectInfo, ProjectInfo } from "@/app/common/types/project";
import Popover from "@/components/ui/Popover";
import { authProjectSchema } from "@/frontendlib/schemas";

import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

import { useImagePreview } from "@/hooks/useImagePreview";
import {
  submitNewProject,
  updateProjectAsAdmin,
  updateProjectAsOwner,
} from "@/services/projectService";

import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const methods = useForm<AuthProjectInput>({
    resolver: zodResolver(authProjectSchema),
    mode: "onChange",
    defaultValues: {
      category_id: "",
      custom_category_name: "",
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
  const user = useUserSessionStore((state) => state.user);
  const { handleSubmit, reset, setError, watch } = methods;
  const [step, setStep] = useState(2);
  const imageFile: FileList | null = watch("image");

  const acceptTerms = watch("acceptTerms");

  const preview = useImagePreview(imageFile);

  const queryClient = useQueryClient();

  const adminUpdateMutation = useMutation({
    mutationFn: updateProjectAsAdmin,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      toast.success("Projet mis à jour");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const ownerUpdateMutation = useMutation({
    mutationFn: updateProjectAsOwner,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ["ownerProjects"] });
      toast.success("Projet mis à jour");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const submissionMutation = useMutation({
    mutationFn: submitNewProject,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      reset();
      queryClient.invalidateQueries({ queryKey: ["ownerProjects"] });
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const onSubmit = async (data: AuthProjectInput) => {
    const formData = new FormData();
    formData.append(
      "accept_project_reformulation",
      data.acceptReformulation ? "1" : "0"
    );
    formData.append("accept_terms_of_use", acceptTerms ? "1" : "0");
    formData.append("accept_terms_of_use", data.acceptTerms ? "1" : "0");
    formData.append(
      "category_id",
      data.custom_category_name ? "" : String(data.category_id)
    );
    formData.append("custom_category_name", String(data.custom_category_name));
    formData.append("project_title", String(data.project_title));
    formData.append("local_area_impact", String(data.local_area_impact));
    formData.append("estimated_budget", String(data.estimated_budget));
    formData.append("description", String(data.description));
    formData.append("main_objective", String(data.main_objective));
    formData.append("solution", String(data.solution));
    formData.append("target_audience", String(data.target_audience));
    formData.append("progress_report", String(data.progress_report));
    formData.append("affiliate", "");
    formData.append("owner_project_status", String(data.owner_project_status));

    if (data.image && data.image.length > 0) {
      formData.append("project.image", data.image[0]);
    }

    if (project) {
      ownerUpdateMutation.mutate({
        project: formData,
        id: String(project.project_id),
      });
    } else if (adminProject) {
      adminUpdateMutation.mutate({
        project: formData,
        id: String(adminProject.project_id),
      });
    } else {
      submissionMutation.mutate(formData);
    }
  };
  useEffect(() => {
    if (project) {
      reset({
        category_id: project.category.category_id ?? "",
        project_title: project.project_title ?? "",
        local_area_impact: project.local_area_impact ?? "",
        estimated_budget: Number(project.estimated_budget ?? undefined),
        description: project.description ?? "",
        main_objective: project.main_objective ?? "",
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

  useEffect(() => {
    if (adminProject) {
      reset({
        category_id: adminProject.category_id ?? "",
        project_title: adminProject.project_title ?? "",
        local_area_impact: adminProject.local_area_impact ?? "Agla",
        estimated_budget: Number(adminProject.estimated_budget ?? undefined),
        description: adminProject.description ?? "",
        main_objective: adminProject.main_objective ?? "Main objective edited",
        solution: adminProject.solution ?? "Solution edited",
        target_audience: adminProject.target_audience ?? "Jeune edited",
        progress_report: adminProject.progress_report ?? "Début edited",
        affiliate: adminProject.affiliate ?? "",
        owner_project_status: adminProject.owner_project_status ?? "publie",
        acceptReformulation: true,
        acceptTerms: true,
      });
    }
  }, [adminProject, reset]);

  return (
    <Popover
      title={project ? "Réformuler le projet" : "Créer un nouveau projet"}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="p-6 lg:h-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 2 && (
              <Step2
                adminProject={adminProject}
                project={project}
                preview={preview}
                setStep={setStep}
              />
            )}
            {step === 3 && (
              <Step3
                adminProject={adminProject}
                project={project}
                setStep={setStep}
              />
            )}
            {step === 4 && (
              <Step4
                adminProject={adminProject}
                project={project}
                setStep={setStep}
              />
            )}

            {step === 4 && (
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
                  Enregistrer
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </Popover>
  );
}
