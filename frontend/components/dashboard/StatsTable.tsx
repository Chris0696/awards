import { AdminProjectInfo } from "@/app/common/types/project";
import { fetchAdminCategories } from "@/services/categoryService";
import { getProjectsToRank } from "@/services/statsService";

import { useQuery } from "@tanstack/react-query";

export default function StatsTable({
  projects,
}: {
  projects: AdminProjectInfo[];
}) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchAdminCategories(),
  });

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
          {projects?.map((project, idx) => (
            <tr
              key={project.project_id}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                <p>{project.rank ? project.rank : 0} </p>
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.owner_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {
                  categories?.data?.find(
                    (cat) => cat.category_id === project.category_id
                  ).category_name
                }
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
