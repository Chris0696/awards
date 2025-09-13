"use client";
import { formatDate } from "@/app/common/types/common";
import { AdminProjectInfo } from "@/app/common/types/project";
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
import { projectService } from "@/frontendlib/services/projectService";

type Props = {
  projects: AdminProjectInfo[];
};

export default function AdminTable({ projects }: Props) {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [project, setProject] = useState<AdminProjectInfo | undefined>(
    undefined
  );
  const openEditModal = (project: AdminProjectInfo) => {
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
                  {project.owner_name}
                </td>
              )}

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {formatDate(project.created_at)}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <span
                  className={`${
                    project.platform_status === "publie"
                      ? "text-green-500 bg-green-100"
                      : project.platform_status === "rejete"
                      ? "bg-red-100 text-red-500"
                      : "text-orange-500 bg-orange-100"
                  }  px-10 py-0.5 rounded-full`}
                >
                  {project.platform_status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.total_votes}
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
                      {project.platform_status !== "rejete" && (
                        <DropdownMenuItem>
                          <button
                            className="cursor-pointer"
                            onClick={() => openEditModal(project)}
                          >
                            Reformuler
                          </button>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <button
                          onClick={() =>
                            projectService.validateProject(project)
                          }
                          className="cursor-pointer"
                        >
                          Valider
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <button
                          onClick={() => projectService.rejectProject(project)}
                          className="cursor-pointer"
                        >
                          Rejeter
                        </button>
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
        adminProject={project}
      />
    </div>
  );
}
