import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function NumberField({
  label,
  placeholder,
  name,
  disabled,
}: Props) {
  const { control } = useFormContext();
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>{label}</span> <span className="text-red-500">*</span>
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              disabled={disabled}
              type="number"
              value={field.value ?? ""}
              placeholder={placeholder}
              className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full"
            />
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
