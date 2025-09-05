import { Controller, useFormContext } from "react-hook-form";
import FormCard from "../FormCard";
import Link from "next/link";

export default function Step4() {
  const {
    register,
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
      </div>
    </FormCard>
  );
}
