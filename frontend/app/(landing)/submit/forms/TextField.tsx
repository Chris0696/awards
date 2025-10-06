import { Undo2Icon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  showSpecialIcon?: boolean;
  onClick?: () => void;
};

export default function TextField({
  showSpecialIcon,
  label,
  placeholder,
  name,
  onClick,
}: Props) {
  const { control } = useFormContext();
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-gray-800 text-lg font-medium "
      >
        <span className="flex">
          {" "}
          <span>{label}</span> <span className="text-red-500">*</span>
          {showSpecialIcon && (
            <span onClick={onClick} className="cursor-pointer mr-2">
              <Undo2Icon />
            </span>
          )}
        </span>
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              type="text"
              name={label}
              id={label}
              placeholder={placeholder}
              className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full "
            />
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
