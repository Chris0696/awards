"use client";
import ProfilImg from "@/assets/defaultProfil.png";
import ArrowRightIcon from "@/assets/arrowRight.svg";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import ColoredOutlineBtn from "@/components/ui/ColoredOutlineBtn";
import MakeVoteModal from "@/components/modals/MakeVoteModal";
import { PublicProject } from "./ProjectsList";
import { dateToMonth } from "@/app/common/types/common";
import { toast } from "sonner";

export default function ProjectCard({ project }: { project: PublicProject }) {
  const [showModal, setShowModal] = useState(false);
  const isVotesTime = false;
  return (
    <div className="bg-white rounded-2xl w-xl  p-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-3">
          {project?.owner_image ? (
            <Image
              src={project?.owner_image}
              width={12}
              height={12}
              alt="Project owner profil image"
              className="w-12 h-12 rounded-full object-cover border border-gray-400"
            />
          ) : (
            <Image
              src={ProfilImg}
              width={12}
              height={12}
              alt="Project owner profil image"
              className="w-12 h-12 rounded-full object-cover border border-gray-400"
            />
          )}

          <span className="text-xl text-gray-600">{project?.owner_name} </span>
        </div>
        <p className="md:text-xl text-gray-600 ml-auto">
          {dateToMonth(project?.created_at)}{" "}
        </p>
      </div>
      <div className="mt-8 mb-8 md:mb-16 space-y-3">
        <h2 className="font-semibold text-primary text-xl">
          {project?.project_title}{" "}
        </h2>
        <p className="text-gray-800 min-h-64">{project?.description}</p>
      </div>
      <div className="flex  flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between">
        <ColoredOutlineBtn
          text="Je vote pour ce projet"
          onClick={() => {
            if (!isVotesTime) {
              return toast.error("Les votes ne sont pas encore lancés");
            }
            setShowModal(true);
          }}
        />
        <Link
          href={`/projects/${project?.slug}`}
          className="flex items-center space-x-3 text-lg"
        >
          <span className="underline">En savoir plus</span>
          <Image src={ArrowRightIcon} alt="Arrow Right" />
        </Link>
      </div>
      <MakeVoteModal
        project={project}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}
