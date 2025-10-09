import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import Table from "@/components/dashboard/Table";
import UserAvatar from "@/assets/user_avatar.svg";
import SearchIcon from "@/assets/searchicon.svg";
import Image from "next/image";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useForm } from "react-hook-form";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCommercialStats } from "@/services/statsService";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { formatDate } from "@/app/common/types/common";

type PersonnalInfo = {
  fullname: string;
  email: string;
  phone: string | null;
};
interface Projects {
  category: string;
  created_at: string;
  id: string;
  owner: string;
  status: string;
  title: string;
  votes: number;
}
export default function CommercialHome() {
  const user = useUserSessionStore((state) => state.user);
  const userInfo = useUserSessionStore((state) => state.additionalInfo);
  const { handleCopy, copied } = useCopyToClipboard();
  const [searcTerm, setSearchTerm] = useState("");

  const { register, reset } = useForm<PersonnalInfo>({
    defaultValues: {
      fullname: userInfo?.full_name ?? "",
      email: user?.email ?? "",
      phone: userInfo?.phone ?? "",
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["commercialStats"],
    queryFn: () => getCommercialStats(),
  });

  useEffect(() => {
    reset({
      fullname: userInfo?.full_name ?? "",
      email: user?.email ?? "",
      phone: userInfo?.phone ?? "",
    });
  }, [userInfo, user, reset]);
  const filteredProjects =
    stats?.recent_projects?.filter((project: Projects) =>
      project.owner.toLowerCase().includes(searcTerm.toLowerCase())
    ) ?? [];

  return (
    <section className="w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row space-y-3 md: space-y- justify-between ">
        <h2 className="text-2xl font-semibold">
          Détails {userInfo?.full_name}{" "}
        </h2>
        <p className="space-x-3">
          <span className="text-lg font-bold">Votre lien d'affiliation:</span>
          <span>
            {" "}
            {stats?.profile.affiliate_link.slice(0, 8)}
            ...
            {stats?.profile.affiliate_link.slice(-6)}
          </span>
          <button
            onClick={() => handleCopy(stats?.profile.affiliate_link)}
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
              <Image
                src={`${fixBackendUrl(userInfo?.image)}`}
                alt="User avatar"
                width={180}
                height={180}
              />
            </div>
            <h3 className="text-xl text-gray-800">{userInfo?.full_name}</h3>
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
      <div className="flex flex-col md:flex-row justify-between mt-8 mb-3">
        <h3 className="text-2xl font-bold">Liste des fileuls</h3>
        <div className="flex items-center space-x-2">
          <p className="text-[#4f69c8] bg-[#e6eaf8] px-4 py-1 rounded-md font-bold text-lg">
            {stats?.financial_stats?.total_votes_generated} Votes{" "}
          </p>
          <p className="text-[#f48a1a] bg-[#fef3e6] px-4 py-1 rounded-md font-bold text-lg">
            {stats?.financial_stats?.total_revenue_generated} XOF
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
      <div>
        <CommercialTable projects={filteredProjects} />
      </div>
      <div>{/*  <SwitchPageBtn /> */}</div>
    </section>
  );
}

export const CommercialTable = ({ projects }: { projects: Projects[] }) => {
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre du projet
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auteur
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date de soumission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Votes reçus
            </th>
            {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position actuelle
            </th> */}
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => (
            <tr
              key={idx}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                <p>{project.title} </p>
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.owner}
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.category}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {formatDate(project.created_at)}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <span
                  className={` ${
                    project.status === "publie"
                      ? "text-green-500 bg-green-100"
                      : project.status === "rejete"
                      ? "text-red-500 bg-red-100"
                      : "text-orange-500 bg-orange-100"
                  }   px-10 py-0.5 rounded-full`}
                >
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {project.votes}
              </td>
              {/*  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">1</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
