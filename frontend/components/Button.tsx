type Props = {
  children: React.ReactNode;
  variant: "outline" | "filled";
  bgcolor?: string;
  textcolor?: string;
  outlinebordercolor?: string;
  color?: "white" | "secondary";
};

export default function Button({
  children,
  variant,
  bgcolor,
  textcolor,
  outlinebordercolor,
  color,
}: Props) {
  return (
    <button
      className={` ${
        variant === "filled"
          ? `${
              bgcolor
                ? `bg-${bgcolor} text-${color} hover:text-${bgcolor} hover:bg-${textcolor}`
                : "bg-secondary hover:bg-gray-100 hover:text-secondary text-gray-100"
            } `
          : `border ${
              color
                ? `border-${color} text-${color} hover:bg-${color} hover:text-${textcolor}`
                : "border-secondary text-secondary hover:bg-secondary hover:text-gray-100"
            } `
      }   px-8 py-3 rounded-md  cursor-pointer  transition-colors hidden md:block`}
    >
      {children}
    </button>
  );
}
