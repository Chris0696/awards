"use client";

import { CommercialTable } from "@/app/admin/CommercialHome";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { getAffiliateDetails } from "@/services/userService";
import AvatarImg from "@/assets/avatar.svg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import SearchIcon from "@/assets/searchicon.svg";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { formatDate } from "@/app/common/types/common";

type PersonnalInfo = {
  fullname: string;
  email: string;
  phone: string | null;
};

export default function page() {
  const { id } = useParams();
  console.log(id, "id");
  const { data: affiliates, isLoading } = useQuery({
    queryKey: ["affiliateDetails", id],
    queryFn: () => getAffiliateDetails(Number(id)),
    enabled: id !== undefined,
  });
  const [searcTerm, setSearchTerm] = useState("");
  const { register, reset } = useForm<PersonnalInfo>({
    defaultValues: {
      fullname: affiliates?.data?.full_name ?? "",
      email: affiliates?.data?.user_email ?? "",
      phone: affiliates?.data?.phone ?? "",
    },
  });

  useEffect(() => {
    reset({
      fullname: affiliates?.data?.full_name ?? "",
      email: affiliates?.data?.user_email ?? "",
      phone: affiliates?.data?.phone ?? "",
    });
  }, [affiliates, reset]);

  const { handleCopy } = useCopyToClipboard();

  const affiliate = affiliates?.data;

  const filteredlist =
    affiliate?.affiliates?.filter((user) =>
      user.full_name.toLowerCase().includes(searcTerm.toLowerCase())
    ) ?? [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row space-y-3 md: space-y- justify-between ">
        <h2 className="text-2xl font-semibold">
          Détails {affiliate?.full_name}{" "}
        </h2>
        <p className="space-x-3">
          <span className="text-lg font-bold">Votre lien d'affiliation:</span>
          <span> {affiliate?.affiliate_link}</span>
          <button
            onClick={() => handleCopy(affiliate?.affiliate_link)}
            className="bg-secondary text-white px-3 py-2 rounded-lg cursor-pointer"
          >
            Copier
          </button>
        </p>
      </div>
      <div className="bg-gray-200/50 rounded-2xl px-6 pt-12 pb-3 mt-8">
        <h3 className="text-xl font-medium">Informations personnelles</h3>
        <div className="xl:flex space-x-4 xl:space-x-24 mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              {affiliate?.image ? (
                <Image
                  src={`${fixBackendUrl(affiliate?.image)}`}
                  alt="User avatar"
                  width={180}
                  height={180}
                />
              ) : (
                <Image
                  width={120}
                  height={120}
                  src={AvatarImg}
                  alt="User Avatar"
                />
              )}
            </div>
            <h3 className="text-xl text-gray-800">{affiliate?.full_name}</h3>
          </div>
          <div className="flex flex-col space-y-4 xl:space-y-0 xl:flex-row xl:space-x-8">
            <div>
              {" "}
              <label htmlFor="fullname" className="block">
                {" "}
                Nom & prénoms
              </label>
              <input
                disabled
                type="text"
                id="fullname"
                {...register("fullname")}
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
                disabled
                id="email"
                {...register("email")}
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
                disabled
                {...register("phone")}
                id="tel"
                placeholder="Télephone"
                className="border border-gray-600 bg-white rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row justify-between mt-8 mb-3">
        <h3 className="text-2xl font-bold">Liste des fileuls</h3>
        <div className="flex items-center space-x-2">
          <p className="text-[#4f69c8] bg-[#e6eaf8] px-4 py-1 rounded-md font-bold text-lg">
            {affiliate?.total_votes} Votes{" "}
          </p>
          <p className="text-[#f48a1a] bg-[#fef3e6] px-4 py-1 rounded-md font-bold text-lg">
            {affiliate?.total_revenue} XOF
          </p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-md relative h-10">
          <Image
            src={SearchIcon}
            alt="Search"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 "
          />
          <input
            type="text"
            name="search"
            placeholder="Rechercher par nom d'auteur"
            id="search"
            value={searcTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-2 py-1 placeholder:text-black rounded-md h-full w-full outline-none border-none"
          />
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
        <table className=" w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom & prénoms
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre du projet
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de soumission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de vote
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenus générés
              </th>
            </tr>
          </thead>
          <tbody>
            {affiliate?.affiliates.length > 0 ? (
              filteredlist.map((aff, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white hover:rounded-full transition-colors"
                >
                  <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                    <p>{aff?.user?.full_name} </p>
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {aff.projects[0]?.project_title}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {aff.projects[0]?.category.category_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(aff.projects[0]?.created_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {aff.projects[0]?.vote_count}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {aff.projects[0]?.total_revenue}
                  </td>
                  {/*  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">1</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-4 text-gray-600 whitespace-nowrap text-lg font-semibold"
                >
                  Aucun fileul pour le moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>{/*  <SwitchPageBtn /> */}</div>
    </section>
  );
}
