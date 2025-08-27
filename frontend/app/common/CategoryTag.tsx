export default function CategoryTag({
  tagname,
  title,
}: {
  tagname: string;
  title: string;
}) {
  const isActive = tagname == "education";
  return (
    <button
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
