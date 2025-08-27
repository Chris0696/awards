"use client";
import AddGdChildModal from "@/components/modals/AddGdChildModal";
import DashboardHeader from "@/app/(dashboard)/DasboardHeader";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import UserAvatar from "@/assets/user_avatar.svg";
import Image from "next/image";
import SearchIcon from "@/assets/searchicon.svg";

export default function page() {
  const [showModal, setShowModal] = useState(false);
  const isAdmin = true;
  return !isAdmin ? (
    <section>
      <DashboardHeader pageTitle="Affiliation" />
      <div className="mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary py-4 px-4 text-white rounded-lg text-lg flex items-center cursor-pointer hover:bg-white hover:border hover:border-primary hover:text-primary
        "
        >
          <span>Créer un affilié (Commerciaux)</span> <ChevronRightIcon />
        </button>
      </div>
      <div>
        <Table />
      </div>
      <div>
        <SwitchPageBtn />
      </div>
      <AddGdChildModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  ) : (
    <section className="w-full overflow-x-hidden">
      <h2 className="text-2xl font-semibold">Détails Ines TOTINON</h2>
      <div className="bg-gray-200/50 rounded-2xl px-6 pt-12 pb-3 mt-8">
        <h3 className="text-xl font-medium">Informations personnelles</h3>
        <div className="xl:flex space-x-4 xl:space-x-24 mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <Image src={UserAvatar} alt="User avatar" />
            </div>
            <h3 className="text-xl text-gray-800">Ines Totinon</h3>
          </div>
          <div className="flex flex-col space-y-4 xl:space-y-0 xl:flex-row xl:space-x-8">
            <div>
              {" "}
              <label htmlFor="fullname" className="block">
                {" "}
                Nom & prénoms
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Nom & prénom"
                className="border border-gray-600 bg-white rounded-lg p-2"
              />
            </div>

            <div>
              <label htmlFor="email" className="block">
                Adresse e-mail
              </label>
              <input
                type="email"
                name=""
                id="email"
                placeholder="email"
                className="border border-gray-600 bg-white rounded-lg p-2"
              />
            </div>
            <div>
              <label htmlFor="tel" className="block">
                Téléphone
              </label>
              <input
                type="tel"
                name=""
                id="tel"
                placeholder="Télephone"
                className="border border-gray-600 bg-white rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between mt-8 mb-3">
        <h3 className="text-2xl font-bold">Liste des fileuls</h3>
        <div className="flex items-center bg-gray-100 rounded-md relative h-10">
          <Image
            src={SearchIcon}
            alt="Search"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 "
          />
          <input
            type="text"
            name="search"
            placeholder="Rechercher"
            id="search"
            className="pl-10 pr-2 py-1 placeholder:text-black rounded-md h-full w-full outline-none border-none"
          />
        </div>
      </div>
      <div>
        <Table />
      </div>
      <div>
        <SwitchPageBtn />
      </div>
    </section>
  );
}
