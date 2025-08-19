type Props = {
  label: string;
  placeholder?: string;
};

export default function TextField({ label, placeholder }: Props) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-gray-800 text-lg font-medium"
      >
        <span>{label}</span> <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name={label}
        id={label}
        placeholder={placeholder}
        className="border-none outline-none bg-gray-100 px-2 py-3 rounded-md w-full"
      />
    </div>
  );
}
