import React from "react";
import Popover from "./Popover";
import TextField from "./TextField";
import EmailField from "./EmailField";
import PhoneNumberField from "./PhoneNumberField";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};
export default function AddGdChildModal({ showModal, setShowModal }: Props) {
  return (
    <Popover
      visible={showModal}
      onClose={() => setShowModal(false)}
      title=""
      isLogin
    >
      <div className="px-16 pb-16 pt-8">
        <div className="flex justify-center text-center mb-8">
          <div>
            <h2 className="text-4xl font-bold">Affiliés</h2>
            <p className="text-xl">Créer un affilié (Commerciaux)</p>
          </div>
        </div>
        <div className="space-y-4">
          <TextField label="Nom complet" placeholder="Nom & prénoms" />
          <EmailField label="Adresse mail" placeholder="Email" />
          <PhoneNumberField label="Téléphone" placeholder="+229 01xxxxxxxx" />
        </div>
        <div className="mt-12">
          <button
            className="bg-primary w-full py-4 px-4 text-white rounded-lg text-lg flex items-center justify-center cursor-pointer hover:bg-white hover:border hover:border-primary hover:text-primary
        "
          >
            Créer
          </button>
        </div>
      </div>
    </Popover>
  );
}
