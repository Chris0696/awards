import DashboardHeader from "@/app/(dashboard)/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import SynthesisCard from "@/components/dashboard/project-owner/SynthesisCard";
import { VotesChart } from "@/components/dashboard/project-owner/VotesChart";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import Link from "next/link";
import React from "react";
import FacebookIcon from "@/assets/facebook.svg";
import LinkIcon from "@/assets/linkIcon.svg";
import WhatsappIcon from "@/assets/whatsapp.svg";
import Image from "next/image";

export default function StatisticPage() {
  const isAdmin = false;
  return !isAdmin ? (
    <section className="">
      <DashboardHeader pageTitle="Statistiques" />
      <div className=" grid grid-cols-4 ">
        <div className="col-span-4 xl:col-span-3 space-y-4  ">
          <div className="h-min bg-gray-200/50 rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-medium text-gray-800">
              Synthèse globale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 md:pl-5 gap-2">
              <SynthesisCard />
              <SynthesisCard />
              <SynthesisCard />
            </div>
          </div>
          <div className=" flex flex-col space-y-3 bg-gray-200/50 px-4 py-8 rounded-xl">
            <div>
              {" "}
              <h2 className="text-xl text-wrap font-medium w-[200px] ">
                Évolution des votes
              </h2>
            </div>
            <div className="bg-white rounded-xl">
              <div className=" mt-10 max-w-xl ">
                <VotesChart />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 mt-5 xl:mt-0 xl:col-span-1">
          <div className="bg-gray-200/50 rounded-lg p-3 w-full xl:w-[80%] mx-auto ">
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
                className="text-lg border border-primary text-primary p-2 rounded-lg w-full flex items-center justify-center space-x-3"
              >
                <span>Partages facebook</span>{" "}
                <span className="bg-primary w-9 h-9 flex items-center justify-center rounded-full ">
                  <Image
                    src={FacebookIcon}
                    alt="Facebook icon"
                    className="w-5 h-5"
                  />
                </span>
              </Link>
              <Link
                href={""}
                className="text-lg border border-green-500 text-green-500 p-2 rounded-lg w-full flex items-center justify-center space-x-3"
              >
                <span>Partages whatsapp</span>
                <span className="bg-green-500 w-9 h-9 flex items-center justify-center rounded-full ">
                  <Image
                    src={WhatsappIcon}
                    alt="Whatsapp icon"
                    className="w-5 h-5"
                  />
                </span>
              </Link>
              <Link
                href={""}
                className="text-lg border border-gray-800 text-gray-800 p-2 rounded-lg w-full flex items-center justify-center space-x-3"
              >
                <span>Partage via lien</span>
                <span className="bg-gray-800 w-9 h-9 flex items-center justify-center rounded-full ">
                  <Image src={LinkIcon} alt="Link icon" className="w-5 h-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section>
      <DashboardHeader pageTitle="Votes & Statistiques" />
      <div className=" flex justify-end space-x-3  mb-5">
        <FilterBtn text="Catégorie" />
      </div>
      <div>
        <Table />
      </div>
      <SwitchPageBtn />
    </section>
  );
}
