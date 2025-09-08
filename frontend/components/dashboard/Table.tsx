"use client";
import { formatDate } from "@/app/common/types/common";
import { ProjectInfo } from "@/app/common/types/project";
import { useAuthStore } from "@/stores/useAuthStore";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreateNewAuthProjectModal from "@/app/(dashboard)/admin/projects/CreateNewAuthProjectModal";
import { useState } from "react";

type Props = {
  projects: ProjectInfo[];
};

export default function Table({ projects }: Props) {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [project, setProject] = useState<ProjectInfo | undefined>(undefined);
  const openEditModal = (project: ProjectInfo) => {
    setProject(project);
    setShowModal(true);
  };
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre du projet
            </th>
            {user?.user_type === "user" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auteur
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date de soumission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Votes reçus
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position actuelle
            </th>
            {user?.user_type === "user" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.project_id}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                <p>{project.project_title} </p>
              </td>
              {user?.user_type === "user" && (
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {project.owner.full_name}
                </td>
              )}
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.category.category_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {formatDate(project.created_at)}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <span className="text-green-500 bg-green-100 px-10 py-0.5 rounded-full">
                  {project.platform_status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.owner.total_votes_received}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">1</td>
              {user?.user_type === "user" && (
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <MoreVerticalIcon />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <button
                          className="cursor-pointer"
                          onClick={() => openEditModal(project)}
                        >
                          Reformuler et publier
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <button className="cursor-pointer">Publié</button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <button className="cursor-pointer">Rejeter</button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <CreateNewAuthProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        project={project}
      />
    </div>
  );
}
