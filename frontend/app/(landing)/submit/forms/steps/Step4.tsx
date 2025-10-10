import { Controller, useFormContext } from "react-hook-form";
import FormCard from "../FormCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useUserSessionStore } from "@/stores/useUserSessionStore";

export default function Step4({
  setStep,
  project,
  adminProject,

  isOnEditMode,
}: {
  setStep: (step: number) => void;
  project?: any;
  adminProject?: any;

  isOnEditMode?: boolean;
}) {
  const {
    register,
    trigger,
    formState: { errors },
    control,
  } = useFormContext();
  const user = useUserSessionStore((state) => state.user);
  const showStepUpBtns = !Boolean(user);

  return (
    <FormCard isOnEditMode={isOnEditMode} step={4}>
      <div>
        <div className="flex flex-col space-y-10">
          <label
            htmlFor="acceptReformulation"
            className="flex items-center space-x-4 cursor-pointer relative"
          >
            <Controller
              name="acceptReformulation"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    type="checkbox"
                    disabled={project || adminProject}
                    checked={project || adminProject}
                    id="acceptReformulation"
                    className="w-20 h-7 md:w-8 md:h-7 rounded-sm border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition cursor-pointer"
                  />
                  <span className="text-gray-900 text-xl font-medium">
                    J'accepte que mon projet soit reformulé par l'équipe Project
                    Awards selon les critères du site.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  {errors.acceptReformulation && (
                    <span className="text-red-500 text-sm block absolute -top-5">
                      {error?.message}
                    </span>
                  )}
                </>
              )}
            />
          </label>
          <label
            htmlFor="acceptTerms"
            className="flex items-center space-x-4 cursor-pointer relative"
          >
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    type="checkbox"
                    disabled={project || adminProject}
                    checked={project || adminProject}
                    id="acceptTerms"
                    className="w-10 h-7 md:w-7 md:h-7 rounded-sm border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition"
                  />
                  <span className="text-gray-900 text-xl font-medium">
                    J'ai lu et j'accepte{" "}
                    <Link href={""} className="text-secondary underline">
                      les conditions d'utilisation
                    </Link>
                  </span>
                  {/* <span className="text-red-500">*</span> */}
                  {errors.acceptTerms && (
                    <span className="text-red-500 text-sm block absolute -top-7">
                      {error?.message}
                    </span>
                  )}
                </>
              )}
            />
          </label>
        </div>

        {/* {showStepUpBtns && (
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
        )} */}
      </div>
    </FormCard>
  );
}
