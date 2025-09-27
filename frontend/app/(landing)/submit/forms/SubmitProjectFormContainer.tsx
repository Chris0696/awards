"use client";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useImagePreview } from "@/hooks/useImagePreview";
import Step5 from "./steps/Step5";
import { FedaCheckoutContainer } from "fedapay-reactjs";
import Popover from "@/components/ui/Popover";

type ProjectForm = z.infer<typeof projectSchema>;
export default function SubmitProjectFormContainer() {
  const [showModal, setShowModal] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

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
    watch,
    formState: { isSubmitting },
  } = methods;
  const email = watch("email");
  const fullName = watch("full_name");
  const phone = watch("phone");
  const profession = watch("profession");
  const password = watch("password");
  const age = watch("age");
  const affiliate = watch("affiliate");
  const acceptReformulation = watch("acceptReformulation");
  const acceptTerm = watch("acceptTerms");
  const category_id = watch("category_id");
  const project_title = watch("project_title");
  const local_area_impact = watch("local_area_impact");
  const main_objective = watch("main_objective");
  const solution = watch("solution");
  const description = watch("description");
  const estimated_budget = watch("estimated_budget");
  const target_audience = watch("target_audience");
  const progress_report = watch("progress_report");
  const owner_project_status = "brouillon";
  const image = watch("image");

  const checkoutEmbedOptions = {
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    transaction: {
      amount: 5000,
      description: "Soummission de projet sur Project Awards",
      custom_metadata: {
        context: "soumissionProjet",
        fullname: fullName,
        email: email,
        countryCode: `+${parsePhoneNumber(phone)?.countryCallingCode}`,
        phone: formatPhoneNumber(phone).replaceAll(" ", ""),
        profession: profession,
        password: password,
        age: age,
        affiliate: affiliate ? affiliate : "",
        accept_project_reformulation: acceptReformulation,
        accept_terms_of_use: acceptTerm,
        image: image ? image[0] : null,
        project: {
          category_id: category_id,
          project_title: project_title,
          local_area_impact: local_area_impact,
          main_objective: main_objective,
          solution: solution,
          description: description,
          estimated_budget: estimated_budget,
          target_audience: target_audience,
          progress_report: progress_report,
          owner_project_status: owner_project_status,
        },
      },
    },
    customer: {
      email: email ? email : "",
      firstname: fullName ? fullName : "",
    },
    currency: {
      iso: "XOF",
    },
    onComplete(resp) {
      const FedaPay = window["FedaPay"];
      if (resp.reason === FedaPay.DIALOG_DISMISSED) {
        setIsWidgetOpen(false);
        console.log(resp, "modal fermé");
      } else {
        setIsWidgetOpen(false);
        setShowModal(false);
        reset();
        console.log("Transaction terminée: " + resp.reason);
        console.log(resp, "resultat");
      }
    },
  };

  const imageFile: FileList | null = watch("image");
  const preview = useImagePreview(imageFile);

  const [step, setStep] = useState(1);
  const onSubmit = async (data: ProjectForm) => {
    const formData = new FormData();
  };
  return (
    <section className="pb-40 pt-28" id="submit-form">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && <Step1 setStep={setStep} />}

          {step === 2 && <Step2 preview={preview} setStep={setStep} />}
          {step === 3 && <Step3 setStep={setStep} />}
          {step === 4 && <Step4 setStep={setStep} />}

          {step === 5 && (
            <div>
              <Step5 />
              <div className="w-full px-5 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between items-center mt-20">
                  <button
                    onClick={() => setStep(4)}
                    className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
                  >
                    <ChevronLeft /> <span>Retourner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWidgetOpen(true)}
                    className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "En cours..." : "Payer pour valider"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
      <CheckoutModal
        setShowModal={setIsWidgetOpen}
        showModal={isWidgetOpen}
        checkoutEmbedOptions={checkoutEmbedOptions}
      />
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

const CheckoutModal = ({
  showModal,
  setShowModal,
  checkoutEmbedOptions,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  checkoutEmbedOptions: any;
}) => {
  return (
    <Popover
      visible={showModal}
      title="Paiement soumission de projet"
      onClose={() => setShowModal(false)}
    >
      <FedaCheckoutContainer
        options={checkoutEmbedOptions}
        style={{ height: 500, width: 500 }}
      />
    </Popover>
  );
};
