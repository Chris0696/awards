"use client";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import ThanksNoteModal from "@/components/modals/ThanksNoteModal";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

import { toast } from "sonner";
import { formatPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { projectSchema } from "@/frontendlib/schemas";

import { useImagePreview } from "@/hooks/useImagePreview";
import Step5 from "./steps/Step5";
import { FedaCheckoutContainer } from "fedapay-reactjs";
import Popover from "@/components/ui/Popover";
import { useMutation } from "@tanstack/react-query";
import { submitFirstProject } from "@/services/projectService";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

type ProjectForm = z.infer<typeof projectSchema>;
export default function SubmitProjectFormContainer() {
  const [showModal, setShowModal] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>();
  const [urlOptionnalPart, SetUrlOptionnalPart] = useState<string>();
  const [step, setStep] = useState(1);

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
      custom_category_name: "",
      progress_report: "",
      affiliate: "",
      owner_project_status: "brouillon",
      acceptReformulation: false,
      acceptTerms: false,
    },
  });
  const {
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
  const acceptTerms = watch("acceptTerms");
  const acceptReformulation = watch("acceptReformulation");
  const category_id = watch("category_id");
  const project_title = watch("project_title");
  const local_area_impact = watch("local_area_impact");
  const estimated_budget = watch("estimated_budget");
  const description = watch("description");
  const main_objective = watch("main_objective");
  const solution = watch("solution");
  const target_audience = watch("target_audience");
  const progress_report = watch("progress_report");
  const custom_category_name = watch("custom_category_name");
  const image: FileList | null = watch("image");

  const submissionMutation = useMutation({
    mutationFn: submitFirstProject,
    onSuccess: () => {
      setIsWidgetOpen(false);

      reset();
      setStep(1);
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const checkoutEmbedOptions = {
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    transaction: {
      amount: 2000,
      description: "Soummission de projet sur Project Awards",
      custom_metadata: {
        context: "soumissionProjet",
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
        toast.error("Paiement annulé");
        setIsWidgetOpen(false);

        const transactionId = resp.transaction.id;
        const status = resp.transaction.status;
        const paymentReference = resp.transaction.reference;
        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append(
          "country_code",
          `+${parsePhoneNumber(phone)?.countryCallingCode}`
        );
        formData.append("phone", formatPhoneNumber(phone).replaceAll(" ", ""));
        formData.append("profession", profession);
        formData.append("password", password);
        formData.append("age", String(age));
        formData.append(
          "affiliate",
          urlOptionnalPart ? String(currentUrl) : ""
        );
        formData.append(
          "accept_project_reformulation",
          acceptReformulation ? "1" : "0"
        );
        formData.append("accept_terms_of_use", acceptTerms ? "1" : "0");
        formData.append(
          "project",
          JSON.stringify({
            category_id: custom_category_name ? "" : category_id,
            custom_category_name: custom_category_name,
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
          "project_payment",
          JSON.stringify({
            payer_name: fullName,
            payer_email: email,
            payer_phone: phone,
            payment_reference: paymentReference,
            payment_status: status,
            payment_method: "pending",
            external_transaction_id: String(transactionId),
          })
        );
        submissionMutation.mutate(formData);
      } else {
        const transactionId = resp.transaction.id;
        const status = resp.transaction.status;
        const paymentReference = resp.transaction.reference;
        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append(
          "country_code",
          `+${parsePhoneNumber(phone)?.countryCallingCode}`
        );
        formData.append("phone", formatPhoneNumber(phone).replaceAll(" ", ""));
        formData.append("profession", profession);
        formData.append("password", password);
        formData.append("age", String(age));
        formData.append(
          "affiliate",
          urlOptionnalPart ? String(currentUrl) : ""
        );
        formData.append(
          "accept_project_reformulation",
          acceptReformulation ? "1" : "0"
        );
        formData.append("accept_terms_of_use", acceptTerms ? "1" : "0");
        formData.append(
          "project",
          JSON.stringify({
            category_id: custom_category_name ? "" : category_id,
            custom_category_name: custom_category_name,
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
          "project_payment",
          JSON.stringify({
            payer_name: fullName,
            payer_email: email,
            payer_phone: phone,
            payment_reference: paymentReference,
            payment_status: status,
            payment_method: "pending",
            external_transaction_id: String(transactionId),
          })
        );
        setShowModal(true);
        submissionMutation.mutate(formData);
        setStep(1);
      }
    },
  };

  const preview = useImagePreview(image);
  useEffect(() => {
    const currentUrl = window.location.href;
    const search = window.location.search;
    setCurrentUrl(currentUrl);
    SetUrlOptionnalPart(search);
  }, []);

  const onSubmit = async (data: ProjectForm) => {};
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

export const CheckoutModal = ({
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
      <div className="relative min-h-[500px] flex items-center justify-center">
        {/* {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary"></span>
            <span className="ml-4 text-secondary">
              Chargement du paiement...
            </span>
          </div>
        )} */}
        <FedaCheckoutContainer
          options={checkoutEmbedOptions}
          style={{ height: 500, width: "100%" }}
        />
      </div>
    </Popover>
  );
};
