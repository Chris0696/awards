import Step1 from "@/app/(landing)/submit/forms/steps/Step1";
import Step2 from "@/app/(landing)/submit/forms/steps/Step2";
import Step3 from "@/app/(landing)/submit/forms/steps/Step3";
import Step4 from "@/app/(landing)/submit/forms/steps/Step4";
import Step5 from "@/app/(landing)/submit/forms/steps/Step5";
import { CheckoutModal } from "@/app/(landing)/submit/forms/SubmitProjectFormContainer";
import { AdminProjectInfo, ProjectInfo } from "@/app/common/types/project";
import Popover from "@/components/ui/Popover";
import { authProjectSchema } from "@/frontendlib/schemas";
import { projectService } from "@/frontendlib/services/projectService";
import { mapServerErrors } from "@/frontendlib/utils/mapServerErrors";
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
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [step, setStep] = useState(2);
  const imageFile: FileList | null = watch("image");
  const category_id = watch("category_id");
  const project_title = watch("project_title");
  const local_area_impact = watch("local_area_impact");
  const estimated_budget = watch("estimated_budget");
  const description = watch("description");
  const main_objective = watch("main_objective");
  const solution = watch("solution");
  const target_audience = watch("target_audience");
  const progress_report = watch("progress_report");
  const acceptReformulation = watch("acceptReformulation");
  const acceptTerms = watch("acceptTerms");
  const image = watch("image");

  const preview = useImagePreview(imageFile);

  const queryClient = useQueryClient();

  const adminUpdateMutation = useMutation({
    mutationFn: updateProjectAsAdmin,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
    },
    onError: () => {},
  });
  const ownerUpdateMutation = useMutation({
    mutationFn: updateProjectAsOwner,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      queryClient.invalidateQueries({ queryKey: ["ownerProjects"] });
    },
    onError: () => {},
  });
  const submissionMutation = useMutation({
    mutationFn: submitNewProject,
    onSuccess: () => {
      setShowModal(false);
      setStep(2);
      reset();
      queryClient.invalidateQueries({ queryKey: ["ownerProjects"] });
    },
    onError: () => {},
  });
  const checkoutEmbedOptions = {
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    transaction: {
      amount: 5000,
      description: "Soummission de projet sur Project Awards",
      custom_metadata: {
        context: "soumissionProjet",
      },
    },
    customer: {
      email: user?.email ? user.email : "",
      firstname: user?.full_name ? user.full_name : "",
    },
    currency: {
      iso: "XOF",
    },
    onComplete(resp) {
      const FedaPay = window["FedaPay"];
      if (resp.reason === FedaPay.DIALOG_DISMISSED) {
        setIsWidgetOpen(false);
        const transactionId = resp.transaction.id;
        const status = resp.transaction.status;
        const paymentReference = resp.transaction.reference;
        const formData = new FormData();

        formData.append("affiliate", "");
        formData.append(
          "accept_project_reformulation",
          acceptReformulation ? "1" : "0"
        );
        formData.append("accept_terms_of_use", acceptTerms ? "1" : "0");
        formData.append(
          "project",
          JSON.stringify({
            category_id: category_id,
            project_title: project_title,
            local_area_impact: local_area_impact,
            main_objective: main_objective,
            solution: solution,
            description: description,
            estimated_budget: estimated_budget,
            target_audience: target_audience,
            progress_report: progress_report,
            owner_project_status: "brouillon",
          })
        );

        if (image && image.length > 0) {
          formData.append("project.image", image[0]);
        }

        formData.append(
          "payment",
          JSON.stringify({
            payer_name: user?.full_name,
            payer_email: user?.email,
            payer_phone: "+2290161112233",
            payment_reference: paymentReference,
            payment_status: status,
            payment_method: "pending",
            external_transaction_id: String(transactionId),
          })
        );
        submissionMutation.mutate(formData);
      } else {
        setIsWidgetOpen(false);
        const transactionId = resp.transaction.id;
        const status = resp.transaction.status;
        const paymentReference = resp.transaction.reference;
        const formData = new FormData();

        formData.append("affiliate", "");
        formData.append(
          "accept_project_reformulation",
          acceptReformulation ? "1" : "0"
        );
        formData.append("accept_terms_of_use", acceptTerms ? "1" : "0");
        formData.append(
          "project",
          JSON.stringify({
            category_id: category_id,
            project_title: project_title,
            local_area_impact: local_area_impact,
            main_objective: main_objective,
            solution: solution,
            description: description,
            estimated_budget: estimated_budget,
            target_audience: target_audience,
            progress_report: progress_report,
            owner_project_status: "brouillon",
          })
        );

        if (image && image.length > 0) {
          formData.append("project.image", image[0]);
        }

        formData.append(
          "payment",
          JSON.stringify({
            payer_name: user?.full_name,
            payer_email: user?.email,
            payer_phone: "+2290161112233",
            payment_reference: paymentReference,
            payment_status: status,
            payment_method: "pending",
            external_transaction_id: String(transactionId),
          })
        );
        submissionMutation.mutate(formData);
      }
    },
  };

  const onSubmit = async (data: AuthProjectInput) => {
    const formData = new FormData();
    formData.append(
      "accept_project_reformulation",
      data.acceptReformulation ? "1" : "0"
    );
    formData.append("accept_terms_of_use", data.acceptTerms ? "1" : "0");
    formData.append(
      "project",
      JSON.stringify({
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
      })
    );

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

  const showStep5 = user?.user_type === "owner" && step === 5;
  const showActionButtonsForAdmin =
    (user?.user_type === "user" && step === 4) ||
    (user?.user_type === "owner" && project && step === 4);

  return (
    <Popover
      title={project ? "Réformuler le projet" : "Créer un nouveau projet"}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="p-6">
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
            {showStep5 && (
              <>
                <Step5 />
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between items-center mt-20">
                  <button
                    onClick={() => setStep(4)}
                    className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
                  >
                    <ChevronLeft /> <span>Retourner</span>
                  </button>
                  <button
                    onClick={() => setIsWidgetOpen(true)}
                    type="button"
                    className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white disabled:cursor-not-allowed"
                  >
                    Payer et valider
                  </button>
                </div>
              </>
            )}
            {showActionButtonsForAdmin && (
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
        <CheckoutModal
          showModal={isWidgetOpen}
          setShowModal={setIsWidgetOpen}
          checkoutEmbedOptions={checkoutEmbedOptions}
        />
      </div>
    </Popover>
  );
}
