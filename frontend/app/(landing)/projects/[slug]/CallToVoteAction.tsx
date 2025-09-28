"use client";
import MakeVoteModal from "@/components/modals/MakeVoteModal";
import { useState } from "react";
import { Project } from "./page";

export default function CallToVoteAction({ project }: { project: Project }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="border bg-gray-50 text-secondary border-secondary px-5 py-2 rounded-md cursor-pointer hover:bg-secondary hover:text-gray-100 transition-colors"
      >
        Je vote pour ce projet
      </button>
      <MakeVoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        project={project}
      />
    </>
  );
}
