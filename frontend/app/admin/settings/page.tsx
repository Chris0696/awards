"use client";
import DashboardHeader from "@/app/admin/DasboardHeader";
import SettingsCard from "@/components/dashboard/project-owner/SettingsCard";
import LanguageIcon from "@/assets/language.svg";
import ClockIcon from "@/assets/clock.svg";
import LockpadIcon from "@/assets/lockpad.svg";
import NotifIcon from "@/assets/white_ring_bell.svg";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";
import { toast } from "sonner";
import Popover from "@/components/ui/Popover";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import { changePasswordSchema } from "@/frontendlib/schemas";
import z from "zod";
import { changePassword } from "@/services/authService";

const settingsText = [
  /*  {
    title: "Langues",
    description: "Choisissez votre langue d'affichage",
    icon: LanguageIcon,
  },
  {
    title: "Notifications",
    description: "Gérez vos préférences de notification",
    icon: NotifIcon,
  }, */
  {
    title: "Sécurité",
    description: "Mettez à jour vos paramètres de sécurité",
    icon: LockpadIcon,
  },
  /* {
    title: "Temps",
    description: "Ajustez vos paramètres de temps",
    icon: ClockIcon,
  }, */
];

export default function page() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <DashboardHeader pageTitle="Mes paramètres" />
      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 mt-24">
        {settingsText.map((setting, idx) => (
          <SettingsCard
            key={idx}
            title={setting.title}
            description={setting.description}
            icon={setting.icon}
            handleClick={() => setShowModal(true)}
          />
        ))}
      </div>
      <ChangePasswordModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
export type ChangePwForm = z.infer<typeof changePasswordSchema>;
export const ChangePasswordModal = ({
  setShowModal,
  showModal,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) => {
  const methods = useForm<ChangePwForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const changePwMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset();
      setShowModal(false);
      toast.success("Mot de passe mis à jour avec succès");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const onSubmit = (data: ChangePwForm) => {
    const payload = {
      old_password: data.old_password,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    };
    changePwMutation.mutate(payload);
  };

  return (
    <Popover
      title={"Changement de mot de passe"}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-10">
          <PasswordField
            label="Ancien mot de passe"
            placeholder="Entrez votre ancien mot de passe"
            name="old_password"
          />
          <PasswordField
            label="Nouveau mot de passe"
            placeholder="Entrez votre nouveau mot de passe"
            name="new_password"
          />
          <PasswordField
            label="Confirmation mot de passe"
            placeholder="Confirmez votre nouveau mot de passe"
            name="confirm_password"
          />
          <button
            type="submit"
            className="w-full cursor-pointer hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-colors text-center py-2 bg-secondary text-white rounded-md"
          >
            Valider
          </button>
        </form>
      </FormProvider>
    </Popover>
  );
};
