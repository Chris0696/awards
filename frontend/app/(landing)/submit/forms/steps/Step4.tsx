import { Controller, useFormContext } from "react-hook-form";
import FormCard from "../FormCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Step4({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const {
    register,
    trigger,
    formState: { errors },
    control,
  } = useFormContext();
  return (
    <FormCard step={4}>
      <div>
        <div className="flex flex-col space-y-10">
          <label
            htmlFor="acceptReformulation"
            className="flex items-center space-x-4 cursor-pointer"
          >
            <Controller
              name="acceptReformulation"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    type="checkbox"
                    id="acceptReformulation"
                    className="w-8 h-8 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition cursor-pointer"
                  />
                  <span className="text-gray-900 text-xl font-medium">
                    J'accepte que mon projet soit reformulé par l'équipe Project
                    Awards selon les critères du site.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  {errors.acceptReformulation && (
                    <span className="text-red-500 text-sm block">
                      {error?.message}
                    </span>
                  )}
                </>
              )}
            />
          </label>
          <label
            htmlFor="acceptTerms"
            className="flex items-center space-x-4 cursor-pointer"
          >
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    type="checkbox"
                    id="acceptTerms"
                    className="w-7 h-7 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition"
                  />
                  <span className="text-gray-900 text-xl font-medium">
                    J'ai lu et j'accepte{" "}
                    <Link href={""} className="text-secondary underline">
                      les conditions d'utilisation
                    </Link>
                  </span>
                  <span className="text-red-500">*</span>
                  {errors.acceptTerms && (
                    <span className="text-red-500 text-sm block">
                      {error?.message}
                    </span>
                  )}
                </>
              )}
            />
          </label>
        </div>
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mt-6">
          <button
            onClick={() => setStep(3)}
            className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
          >
            <ChevronLeft /> <span>Retourner</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const valid = await trigger([
                "acceptReformulation",
                "acceptTerms",
              ]);
              if (valid) setStep(5);
            }}
            className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
          >
            Continuer
          </button>
        </div>
      </div>
    </FormCard>
  );
}
