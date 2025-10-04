"use client";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "../submit/forms/PasswordField";
import HeroSection from "./HeroSection";
import { useSearchParams } from "next/navigation";
import z from "zod";
import { confirmResetSchema } from "@/frontendlib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type Form = z.infer<typeof confirmResetSchema>;
export default function page() {
  const searchParams = useSearchParams();

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

  const { handleSubmit, reset } = methods;
  const onSubmit = (data: Form) => {
    if (otp && uuidb64 && refreshToken && data.password) {
      console.log("All");
    }
  };
  return (
    <div>
      <HeroSection />
      <div className="py-20 ">
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
