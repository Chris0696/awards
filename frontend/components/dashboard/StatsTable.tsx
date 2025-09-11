import { useProjectStore } from "@/stores/useProjectStore";

export default function StatsTable() {
  const adminProjects = useProjectStore((state) => state.adminProjects);
  const orderedProjects = adminProjects.sort(
    (a, b) => a.total_votes - b.total_votes
  );
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rang
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projet
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre de votes
            </th>
          </tr>
        </thead>
        <tbody>
          {orderedProjects.map((project, idx) => (
            <tr
              key={project.project_id}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                <p>{idx + 1} </p>
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.owner_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.category}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.project_title}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.total_votes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
