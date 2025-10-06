"use client";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "../submit/forms/PasswordField";
import HeroSection from "./HeroSection";
import { useRouter, useSearchParams } from "next/navigation";
import z from "zod";
import { confirmResetSchema } from "@/frontendlib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { confirmPasswordReseting } from "@/services/authService";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";
import { toast } from "sonner";

type Form = z.infer<typeof confirmResetSchema>;
export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const route = useRouter();

  const otp = searchParams.get("otp");
  const uuidb64 = searchParams.get("uuidb64");
  const refreshToken = searchParams.get("refresh_token");
  const methods = useForm<Form>({
    resolver: zodResolver(confirmResetSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: confirmPasswordReseting,
    onSuccess: () => {
      route.replace("/login");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const { handleSubmit, reset } = methods;
  const onSubmit = (data: Form) => {
    if (otp && uuidb64 && refreshToken && data.password) {
      const payload = {
        otp: otp,
        password: data.password,
        uuidb64: uuidb64,
      };
      saveMutation.mutate(payload);
    }
  };
  return (
    <div>
      <HeroSection />
      <div className="py-60 ">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto md:w-1/2 space-y-6"
          >
            <PasswordField
              label="Mot de passe"
              placeholder="xxxxxxxxxxxxxxxxx"
              name="password"
            />
            <button
              type="submit"
              className="w-full cursor-pointer hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-colors text-center py-2 bg-secondary text-white rounded-md"
            >
              Valider
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
