import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import Table from "@/components/dashboard/Table";
import UserAvatar from "@/assets/user_avatar.svg";
import SearchIcon from "@/assets/searchicon.svg";
import Image from "next/image";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useForm } from "react-hook-form";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCommercialStats } from "@/services/statsService";

type PersonnalInfo = {
  fullname: string;
  email: string;
  phone: string | null;
};
export default function CommercialHome() {
  const user = useUserSessionStore((state) => state.user);
  const userInfo = useUserSessionStore((state) => state.additionalInfo);

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

  return (
    <section className="w-full overflow-x-hidden">
      <h2 className="text-2xl font-semibold">Détails {userInfo?.full_name} </h2>
      <div className="bg-gray-200/50 rounded-2xl px-6 pt-12 pb-3 mt-8">
        <h3 className="text-xl font-medium">Informations personnelles</h3>
        <div className="xl:flex space-x-4 xl:space-x-24 mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <Image
                src={fixBackendUrl(userInfo?.image) ?? UserAvatar}
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
        <Table projects={[]} />
      </div>
      <div>
        <SwitchPageBtn />
      </div>
    </section>
  );
}
