export default function ProjectOverviewCard({ color }: { color: string }) {
  return (
    <div className="bg-gray-200/50 p-4 rounded-xl space-y-8 w-full max-w-[220px] text-center">
      <h4 className="text-lg text-gray-600  ">
        Nombre total de projets validés
      </h4>
      <p className={`text-4xl font-semibold ${color}  `}>150</p>
    </div>
  );
}
