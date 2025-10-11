"use client";
import { Controller, useFormContext } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInputWithCountrySelect from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
};

export default function PhoneNumberField({ label, placeholder, name }: Props) {
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
            <PhoneInputWithCountrySelect
              {...field}
              international
              name={name}
              defaultCountry="BJ"
              placeholder={placeholder}
              countryCallingCodeEditable={false}
              rules={{
                validate: (val: string) =>
                  isValidPhoneNumber(val) || "Numéro invalide",
              }}
              className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full "
            />
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
