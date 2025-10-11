import React from "react";

export default function FilterBtn({
  defaultText,
  options,
  onChange,
}: {
  defaultText: string;
  options: { value: string; text: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="px-6 py-2 text-lg font-medium rounded-lg border border-primary text-primary max-w-[150px] cursor-pointer"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{defaultText}</option>
      {options?.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
}
