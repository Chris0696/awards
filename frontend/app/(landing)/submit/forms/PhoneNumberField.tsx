import { Controller, useFormContext } from "react-hook-form";
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
      {/*  <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              type="tel"
              placeholder={placeholder}
              className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full"
            />
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      /> */}
      <PhoneInputWithCountrySelect
        control={control}
        international
        name={name}
        defaultCountry="BJ"
        placeholder={placeholder}
        countryCallingCodeEditable={false}
        className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full "
      />
    </div>
  );
}
