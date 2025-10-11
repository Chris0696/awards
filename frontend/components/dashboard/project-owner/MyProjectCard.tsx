"use client";
import CreateNewAuthProjectModal from "@/app/admin/projects/CreateNewAuthProjectModal";
import { formatDate } from "@/app/common/types/common";
import { ProjectInfo } from "@/app/common/types/project";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";
import {
  deleteProjectAsOwner,
  markProjectPublicAsOwner,
} from "@/services/projectService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontalIcon, MoreVerticalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  project: ProjectInfo;
}

export default function MyProjectCard({ project }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string>("");
  const [selectedproject, setSelectedProject] = useState<
    ProjectInfo | undefined
  >(undefined);
  const openEditModal = (project: ProjectInfo) => {
    setSelectedProject(project);
    setShowModal(true);
  };
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProjectAsOwner,
    onSuccess: () => {
      toast.success("Projet supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowConfirmationModal(false);
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const updateMutation = useMutation({
    mutationFn: markProjectPublicAsOwner,
    onSuccess: () => {
      toast.success("Projet publié avec succès");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const handleDelete = () => {
    if (projectToDelete) deleteMutation.mutate(projectToDelete);
  };
  const isAlreadyPublished = (project: ProjectInfo) => {
    return (
      project.owner_project_status === "publie" &&
      project.platform_status === "publie"
    );
  };
  const isAlreadyPublishedByOwner = (project: ProjectInfo) => {
    return project.owner_project_status === "publie";
  };
  return (
    <div className="bg-white p-4 rounded-2xl relative w-full max-w-xs space-y-4">
      <div className="flex justify-between">
        <h2 className="w-3/4">
          <span className="font-medium">Titre du projet : </span>{" "}
          <span className="text-gray-600">{project?.project_title}</span>{" "}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute top-5 right-0">
            <button
              onClick={() => {
                if (isAlreadyPublished(project)) {
                  return toast.error("Ce projet est déjà publié");
                }
              }}
            >
              <MoreVerticalIcon />
            </button>
          </DropdownMenuTrigger>
          {!isAlreadyPublished(project) && (
            <DropdownMenuContent>
              {project.platform_status !== "publie" && (
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
                  onClick={() => {
                    if (isAlreadyPublishedByOwner(project)) {
                      return toast.error(
                        "Votre projet est déjà en cours de validation"
                      );
                    }
                    updateMutation.mutate({
                      project_id: project.project_id,
                      owner_project_status: "publie",
                      category_id: project.category.category_id,
                    });
                  }}
                  className="cursor-pointer"
                >
                  Publier
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  onClick={() => {
                    setShowConfirmationModal(true);
                    setProjectToDelete(project.project_id);
                  }}
                  className="cursor-pointer"
                >
                  Supprimer
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      <p>
        <span className="font-semibold">Date de soumission:</span>{" "}
        <span className="text-gray-600">{formatDate(project.created_at)} </span>
      </p>
      <p>
        <span className="font-semibold">Nombre de vote reçus:</span>{" "}
        <span className="text-gray-600">{project.vote_count} </span>{" "}
      </p>
      <p>
        <span className="font-semibold">Statut du projet:</span>{" "}
        <span
          className={`${
            project.platform_status === "publie"
              ? "text-green-500 bg-green-100"
              : project.platform_status === "rejete"
              ? "text-red-500 bg-red-100"
              : "text-orange-500 bg-orange-100"
          } py-1 text-xs px-5 rounded-full`}
        >
          {project.owner_project_status === "publie" &&
          project.platform_status === "brouillon"
            ? "en cours..."
            : project.owner_project_status === "publie" &&
              project.platform_status === "publie"
            ? "publie"
            : "brouillon"}
        </span>
      </p>
      <CreateNewAuthProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        project={selectedproject}
      />
      <ConfirmDeleteModal
        title="Êtes-vous sûr de vouloir supprimer ce projet?"
        showDeleteModal={showConfirmationModal}
        setShowDeleteModal={setShowConfirmationModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
