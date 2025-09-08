import React from "react";
import Popover from "../ui/Popover";
import TextField from "../../app/(landing)/submit/forms/TextField";
import EmailField from "../../app/(landing)/submit/forms/EmailField";
import PhoneNumberField from "../../app/(landing)/submit/forms/PhoneNumberField";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import z from "zod";
import { affiliateSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAffiliateStore } from "@/stores/affiliateStore";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};
type AffiliateForm = z.infer<typeof affiliateSchema>;
export default function AddGdChildModal({ showModal, setShowModal }: Props) {
  const methods = useForm<AffiliateForm>({
    resolver: zodResolver(affiliateSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      user_type: "commercial",
    },
  });
  const addAfiiliate = useAffiliateStore((state) => state.addAffiliate);

  const { handleSubmit, reset } = methods;
  const onSubmit = (data: AffiliateForm) => {
    console.log(data);
    try {
      addAfiiliate(data);
      setShowModal(false);
      reset();
    } catch (error) {}
  };
  return (
    <Popover
      visible={showModal}
      onClose={() => setShowModal(false)}
      title=""
      isLogin
    >
      <FormProvider {...methods}>
        <form className="px-16 pb-16 pt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center text-center mb-8">
            <div>
              <h2 className="text-4xl font-bold">Affiliés</h2>
              <p className="text-xl">Créer un affilié (Commerciaux)</p>
            </div>
          </div>
          <div className="space-y-4">
            <TextField
              name="username"
              label="Nom complet"
              placeholder="Nom & prénoms"
            />
            <EmailField name="email" label="Adresse mail" placeholder="Email" />
            <PasswordField
              name="password"
              label="Mot de passe"
              placeholder="Mot de passe"
            />
            {/* <PhoneNumberField
              name="affiliatePhoneNumber"
              label="Téléphone"
              placeholder="+229 01xxxxxxxx"
            /> */}
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="bg-primary w-full py-4 px-4 text-white rounded-lg text-lg flex items-center justify-center cursor-pointer hover:bg-white hover:border hover:border-primary hover:text-primary
        "
            >
              Créer
            </button>
          </div>
        </form>
      </FormProvider>
    </Popover>
  );
}
