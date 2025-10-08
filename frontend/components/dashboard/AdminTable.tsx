"use client";
import { formatDate } from "@/app/common/types/common";
import { AdminProjectInfo } from "@/app/common/types/project";

import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CreateNewAuthProjectModal from "@/app/admin/projects/CreateNewAuthProjectModal";
import { useState } from "react";

import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rejectProjectAsAdmin,
  validateProjectAsAdmin,
} from "@/services/projectService";
import { toast } from "sonner";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

type Props = {
  projects: AdminProjectInfo[];
};

export default function AdminTable({ projects }: Props) {
  const [showModal, setShowModal] = useState(false);
  const user = useUserSessionStore((state) => state.user);
  const [project, setProject] = useState<AdminProjectInfo | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const validateMutation = useMutation({
    mutationFn: validateProjectAsAdmin,
    onSuccess: () => {
      toast.success("Projet validé");
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const rejectMutation = useMutation({
    mutationFn: rejectProjectAsAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      toast.success("Projet rejeté");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
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
          {projects.length > 0 ? (
            projects.map((project) => (
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
                  {project.active_votes_count}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {project.rank ? project.rank : 0}{" "}
                </td>
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
                              validateMutation.mutate(project.project_id)
                            }
                            className="cursor-pointer"
                          >
                            Valider
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button
                            onClick={() =>
                              rejectMutation.mutate({
                                id: project.project_id,
                                admin_comment: "Inapproprié",
                              })
                            }
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
            ))
          ) : (
            <tr>
              <td
                colSpan={user?.user_type === "user" ? 7 : 6}
                className="text-center py-4 text-xl font-semibold text-red-500"
              >
                Aucun projet trouvé
              </td>
            </tr>
          )}
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
