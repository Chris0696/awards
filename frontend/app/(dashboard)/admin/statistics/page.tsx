import DashboardHeader from "@/components/dashboard/DasboardHeader";
import SynthesisCard from "@/components/dashboard/project-owner/SynthesisCard";
import Link from "next/link";
import React from "react";

export default function StatisticPage() {
  return (
    <div className="">
      <DashboardHeader pageTitle="Statistiques" />
      <div className=" grid grid-cols-4 ">
        <div className=" col-span-3  ">
          <div className="h-min bg-gray-200/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-medium text-gray-800">
              Synthèse globale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 pl-5">
              <SynthesisCard />
              <SynthesisCard />
              <SynthesisCard />
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-gray-200/50 rounded-lg p-3 w-[80%] mx-auto ">
            <h4 className="font-medium text-xl">
              Un simple partage peut faire la différence !
            </h4>
            <p className="text-gray-700 my-4">
              Vous êtes actuellement 4ᵉ dans la catégorie “Tech & Innovation”.
              Encouragez votre communauté à voter pour améliorer votre position
              et maximiser vos chances de financement.
            </p>
            <div className="space-y-6 pt-3">
              <Link
                href={""}
                className="text-lg border border-primary text-primary px-2 py-3 rounded-lg w-full block"
              >
                <span>Partages facebook</span>
              </Link>
              <Link
                href={""}
                className="text-lg border border-green-500 text-green-500 px-2 py-3 rounded-lg w-full block"
              >
                <span>Partages whatsapp</span>
              </Link>
              <Link
                href={""}
                className="text-lg border border-gray-800 text-gray-800 px-2 py-3 rounded-lg w-full block"
              >
                <span>Partage via lien</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
