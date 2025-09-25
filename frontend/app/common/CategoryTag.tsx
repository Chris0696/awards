export default function CategoryTag({
  handleClick,
  title,
  isActive,
}: {
  handleClick: () => void;
  title: string;
  isActive: boolean;
}) {
  return (
    <button
      onClick={handleClick}
      className={` ${
        isActive
          ? "bg-primary text-white"
          : "border border-primary text-primary hover:bg-primary hover:text-white"
      }  px-5 py-2.5 rounded-full  cursor-pointer transition-colors mt-6 md:mt-0`}
    >
      {title}
    </button>
  );
}
