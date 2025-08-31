import Image from "next/image";

import { ChevronRightIcon } from "lucide-react";
import ArtworkImg from "@/assets/artworklight.jpg";
import Popover from "../ui/Popover";
import PhoneNumberField from "@/app/(landing)/submit/forms/PhoneNumberField";
import NumberField from "@/app/(landing)/submit/forms/NumberField";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};
export default function MakeVoteModal({ showModal, setShowModal }: Props) {
  const methods = useForm();
  return (
    <Popover
      title="Je vote pour le projet “Kit Solaire Mobile”"
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
              <span>Mireile Assaba</span>
            </h4>
            <h4>
              <span>Votes actuels: </span>
              <span>248 votes</span>
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
        <FormProvider {...methods}>
          <form className="mt-12 md:space-y-4">
            <PhoneNumberField
              name="voterPhoneNumber"
              label="Numéro"
              placeholder="Ex:0161000000"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberField
                name="voteCount"
                label="Nombre de vote"
                placeholder="2"
              />

              <NumberField
                name="voteAmount"
                label="Montant(XOF)"
                placeholder="200"
              />
            </div>
            <div className="mt-10">
              <button className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md w-full cursor-pointer">
                <span>Se connecter</span>
                <ChevronRightIcon />
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Popover>
  );
}
