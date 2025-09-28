"use client";
import React from "react";
import { Project } from "./page";
import MakeVoteModal from "@/components/modals/MakeVoteModal";

export default function CallToAction2({ project }: { project: Project }) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      {" "}
      <button
        onClick={() => setShowModal(true)}
        className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-secondary transition-colors cursor-pointer"
      >
        Voter pour ce projet-100 FCFA
      </button>
      <MakeVoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        project={project}
      />
    </>
  );
}
