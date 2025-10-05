"use client";
import EmailField from "@/app/(landing)/submit/forms/EmailField";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import Popover from "@/components/ui/Popover";
import { resetPasswordSchema, userSchema } from "@/frontendlib/schemas";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

import { loginUser, resetPassword } from "@/services/authService";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronRightIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export type AuthForm = z.infer<typeof userSchema>;
export default function LoginForm() {
  const methods = useForm<AuthForm>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    handleSubmit,

    formState: { isSubmitting },
  } = methods;

  const router = useRouter();
  const mutateLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setIsNavigating(true);
      router.replace("/admin");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const onSubmit = async (data: AuthForm) => {
    mutateLogin.mutate(data);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl mx-auto bg-white space-y-4 "
      >
        <div className="flex justify-center flex-col items-center">
          <h2 className="text-4xl font-bold">Bienvenu!</h2>
          <p>Connectez vous à votre espace</p>
        </div>
        <div className="space-y-4">
          <EmailField name="email" label="Adresse email" placeholder="Email" />
          <div>
            <PasswordField
              name="password"
              label="Mot de passe"
              placeholder="Mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-secondary cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={mutateLogin.isPending || isNavigating}
            className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-4 text-lg rounded-md w-full cursor-pointer disabled:bg-gray-200 disabled:text-gray-800"
          >
            {mutateLogin.isPending || isNavigating ? (
              <>
                <span>Connexion en cours...</span>
                <Loader2 className="animate-spin ml-2" size={18} />
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ChevronRightIcon />
              </>
            )}
          </button>
        </div>
      </form>
      <ResetPasswordModal showModal={showModal} setShowModal={setShowModal} />
    </FormProvider>
  );
}
type ResetForm = z.infer<typeof resetPasswordSchema>;
export const ResetPasswordModal = ({
  setShowModal,
  showModal,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) => {
  const methods = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      reset();
      setShowModal(false);
      toast.success("Un message vous a été envoyé dans votre boite email");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const onSubmit = (data: ResetForm) => {
    resetMutation.mutate(data.email);
  };

  return (
    <Popover
      title={"Récupération mot de passe"}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-10">
          <EmailField
            name="email"
            label="Entrez votre adresse email"
            placeholder="Adresse email"
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
