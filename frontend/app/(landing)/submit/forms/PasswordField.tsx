"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
};

export default function PasswordField({ label, placeholder, name }: Props) {
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative">
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            <p className="text-sm text-red-500">{error?.message} </p>
          </>
        )}
      />
    </div>
  );
}
