import { formatDate } from "@/app/common/types/common";
import { ProjectInfo } from "@/app/common/types/project";
import { MoreHorizontalIcon, MoreVerticalIcon } from "lucide-react";

interface Props {
  project: ProjectInfo;
}

export default function MyProjectCard({ project }: Props) {
  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-xs space-y-4">
      <div className="flex justify-between">
        <h2 className="w-3/4">
          <span className="font-medium">Titre du projet : </span>{" "}
          <span className="text-gray-600">{project?.project_title}</span>{" "}
        </h2>
        <MoreVerticalIcon />
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
    </div>
  );
}
