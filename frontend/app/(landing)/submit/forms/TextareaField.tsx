import { Controller, useFormContext } from "react-hook-form";

export default function TextareaField({ name }: { name: string }) {
  const { control } = useFormContext();
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>Description du projet</span>{" "}
        <span className="text-red-500">*</span>
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              rows={7}
              {...field}
              className="border-none outline-none bg-gray-100 p-2  rounded-md w-full"
              placeholder="Que voulez-vous réaliser ? Pourquoi ? Comment ?(1500 à 2000 caractères max)"
            />
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
