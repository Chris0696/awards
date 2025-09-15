"use client";
import ProfilImg from "@/assets/profil.png";
import ArrowRightIcon from "@/assets/arrowRight.svg";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import ColoredOutlineBtn from "@/components/ui/ColoredOutlineBtn";
import MakeVoteModal from "@/components/modals/MakeVoteModal";
import { ProjectInfo } from "@/app/common/types/project";
import { UserCircle2 } from "lucide-react";
import { PublicProject } from "./ProjectsList";
import { dateToMonth } from "@/app/common/types/common";

export default function ProjectCard({ project }: { project: PublicProject }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-white rounded-2xl w-xl  p-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-3">
          {project.image ? (
            <Image
              src={ProfilImg}
              alt="Project owner profil image"
              className="w-12 h-12 rounded-full object-cover border border-gray-400"
            />
          ) : (
            <UserCircle2 size={52} />
          )}

          <span className="text-xl text-gray-600">{project.owner_name} </span>
        </div>
        <p className="md:text-xl text-gray-600 ml-auto">
          {dateToMonth(project.created_at)}{" "}
        </p>
      </div>
      <div className="mt-8 mb-8 md:mb-16 space-y-3">
        <h2 className="font-semibold text-primary text-xl">
          {project.project_title}{" "}
        </h2>
        <p className="text-gray-800 min-h-64">{project.description}</p>
      </div>
      <div className="flex  flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between">
        <ColoredOutlineBtn
          text="Je vote pour ce projet"
          onClick={() => setShowModal(true)}
        />
        <Link
          href={"/projects/1"}
          className="flex items-center space-x-3 text-lg"
        >
          <span className="underline">En savoir plus</span>
          <Image src={ArrowRightIcon} alt="Arrow Right" />
        </Link>
      </div>
      <MakeVoteModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
