"use client";
import ProfilImg from "@/assets/profil.png";
import ArrowRightIcon from "@/assets/arrowRight.svg";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import ColoredOutlineBtn from "@/components/ui/ColoredOutlineBtn";
import MakeVoteModal from "@/components/modals/MakeVoteModal";

export default function ProjectCard() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-white rounded-2xl w-xl  p-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-3">
          <Image
            src={ProfilImg}
            alt="Project owner profil image"
            className="w-12 h-12 rounded-full object-cover border border-gray-400"
          />
          <span className="text-xl text-gray-600">Femi Sessi</span>
        </div>
        <p className="md:text-xl text-gray-600 ml-auto">Janvier 2025</p>
      </div>
      <div className="mt-8 mb-8 md:mb-16 space-y-3">
        <h2 className="font-semibold text-primary text-xl">Titre du projet</h2>
        <p className="text-gray-800 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum
          vitae, inventore saepe temporibus quod exercitationem quibusdam ipsa
          accusantium aliquam dolorem dolorum tempore aspernatur sint
          perferendis fuga, quia repudiandae quas? Minima tenetur, nemo
          laudantium nisi in iure nobis ipsa est architecto inventore
          voluptatibus culpa reiciendis necessitatibus tempora accusantium nihil
          quia labore quae. Neque totam beatae mollitia aperiam, animi quia
          culpa. Ad, voluptatum vel, sunt natus impedit optio neque unde
          distinctio molestias reprehenderit, iusto expedita necessitatibus vero
          assumenda ab vitae quibusdam beatae quia? Pariatur in dolores quasi
          accusantium non officiis neque!
        </p>
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
