"use client";
import EmailField from "@/app/(landing)/submit/forms/EmailField";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import { userSchema } from "@/frontendlib/schemas";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

import { loginUser } from "@/services/authService";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const {
    handleSubmit,

    formState: { isSubmitting },
  } = methods;

  const router = useRouter();
  const mutateLogin = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data, "credentialsss");

      router.replace("/admin");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const onSubmit = async (data: AuthForm) => {
    mutateLogin.mutate(data);
    /*  try {
      await login(data.email, data.password);
      router.replace("/admin");
    } catch (error) {
      const message = mapServerErrors(error, setError);

      toast.error(message);
    } */
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
            <Link href={""} className="text-secondary">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={mutateLogin.isPending}
            className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-4 text-lg rounded-md w-full cursor-pointer disabled:bg-gray-200 disabled:text-gray-800"
          >
            {mutateLogin.isPending ? (
              "En cours..."
            ) : (
              <>
                <span>Se connecter</span>
                <ChevronRightIcon />
              </>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
