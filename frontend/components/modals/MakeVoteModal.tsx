"use client";
import Image from "next/image";
import { FedaCheckoutContainer } from "fedapay-reactjs";

import { ChevronRightIcon } from "lucide-react";
import ArtworkImg from "@/assets/artworklight.jpg";
import Popover from "../ui/Popover";
import PhoneNumberField from "@/app/(landing)/submit/forms/PhoneNumberField";
import NumberField from "@/app/(landing)/submit/forms/NumberField";
import { FormProvider, useForm } from "react-hook-form";
import { PublicProject } from "@/app/(landing)/projects/ProjectsList";
import { useEffect, useState } from "react";
import EmailField from "@/app/(landing)/submit/forms/EmailField";
import z from "zod";
import { voteFormSchema } from "@/frontendlib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@/app/(landing)/submit/forms/TextField";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  project: PublicProject;
};
type VoteForm = z.infer<typeof voteFormSchema>;
export default function MakeVoteModal({
  showModal,
  setShowModal,
  project,
}: Props) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const methods = useForm<VoteForm>({
    resolver: zodResolver(voteFormSchema),
    mode: "onChange",
    defaultValues: {
      vote_count: undefined,
      email: "",
      amount: 0,
      full_name: "",
    },
  });
  const { trigger, watch, setValue, getValues, reset } = methods;
  const voteCount = watch("vote_count");
  const email = getValues("email");
  const amount = getValues("amount");
  const fullname = getValues("full_name");

  useEffect(() => {
    if (voteCount) {
      setValue("amount", voteCount * 100, { shouldValidate: true });
    }
  }, [voteCount, setValue]);
  useEffect(() => {
    if (!showModal) setIsWidgetOpen(false);
  }, [showModal]);

  const checkoutEmbedOptions = {
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
    transaction: {
      amount: amount,
      description: "Vote sur Project Awards",
      custom_metadata: {
        context: "voteProjet",
        projectId: project.project_id,
        voteCount: voteCount,
      },
    },
    customer: {
      email: email ? email : "",
      firstname: fullname ? fullname : "",
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

  return (
    <Popover
      title={`Je vote pour le projet “${project.project_title.slice(
        0,
        10
      )}...”`}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="w-4/5 h-96 overflow-y-auto py-5 md:h-auto md:py-0 mx-auto md:mt-10 md:mb-20  ">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-200 p-4 w-[85%] mx-auto rounded-lg">
          <div>
            <h4>
              <span>Catégorie: </span>
              <span>Énergie</span>
            </h4>
            <h4>
              <span>Auteur: </span>
              <span>{project.owner_name} </span>
            </h4>
            <h4>
              <span>Votes actuels: </span>
              <span>{project.total_votes} votes</span>
            </h4>
          </div>
          <div>
            <Image
              src={ArtworkImg}
              alt="Project image"
              className="w-[85%] md:mx-auto rounded-lg h-20 object-cover"
            />
          </div>
        </div>
        {!isWidgetOpen ? (
          <FormProvider {...methods}>
            <form className="mt-12 md:space-y-4">
              {/* <PhoneNumberField
                name="phone"
                label="Numéro"
                placeholder="Ex:0161000000"
              /> */}
              <TextField
                label="Nom complet"
                name="full_name"
                placeholder="Ex:Toto Junior "
              />
              <EmailField placeholder="Email" label="Email" name="email" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  name="vote_count"
                  label="Nombre de vote"
                  placeholder="2"
                />

                <NumberField
                  name="amount"
                  label="Montant(XOF)"
                  placeholder="200"
                />
              </div>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={async () => {
                    const valid = await trigger([
                      "vote_count",
                      "amount",
                      "email",
                      "full_name",
                    ]);
                    if (valid) setIsWidgetOpen(true);
                  }}
                  className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md w-full cursor-pointer"
                >
                  <span>Payer maintenant</span>
                  <ChevronRightIcon />
                </button>
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="pt-16 bg-primary">
            <FedaCheckoutContainer
              options={checkoutEmbedOptions}
              style={{ height: 500, width: 500 }}
            />
          </div>
        )}
      </div>
    </Popover>
  );
}
