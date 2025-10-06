"use client";
import MakeVoteModal from "@/components/modals/MakeVoteModal";
import { useState } from "react";
import { Project } from "./page";
import { toast } from "sonner";

export default function CallToVoteAction({ project }: { project: Project }) {
  const [showModal, setShowModal] = useState(false);
  const isVotesTime = false;
  return (
    <>
      <button
        onClick={() => {
          if (!isVotesTime) {
            return toast.error("Les votes ne sont pas encore lancés");
          }
          setShowModal(true);
        }}
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
