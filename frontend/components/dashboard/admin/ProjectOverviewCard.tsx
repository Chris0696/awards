export default function ProjectOverviewCard({
  color,
  title,
  total,
}: {
  color: string;
  title?: string;
  total?: number;
}) {
  return (
    <div className="bg-gray-200/50 flex flex-col p-4 rounded-xl space-y-8 w-full md:max-w-[220px] text-center">
      <h4 className="text-lg text-gray-600  ">
        {title ? title : "Nombre total de projets validés"}
      </h4>
      <p className={`text-4xl font-semibold mt-auto pb-16 ${color}  `}>
        {total ?? 0}
      </p>
    </div>
  );
}
