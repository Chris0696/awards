"use client";
import DashboardHeader from "@/app/admin/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import UserTable from "@/components/UserTable";
import { useQuery } from "@tanstack/react-query";
import { getOwnersList } from "@/services/userService";
import Loader from "@/components/Loader";

export default function page() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getOwnersList(),
  });

  if (isLoading) {
    return <Loader message="Chargement des utilisateurs..." />;
  }

  return (
    <div className="overflow-x-hidden">
      <DashboardHeader pageTitle="Utilisateurs inscrits" />
      <div className=" flex justify-end space-x-3  mb-5">
        {/* <FilterBtn defaultText="Date" options={["Date"]} />
        <FilterBtn defaultText="Statut" options={["Statut"]} /> */}
      </div>
      {users?.results.length > 0 ? (
        <div>
          <UserTable users={users.results} />
          {/* <SwitchPageBtn /> */}
        </div>
      ) : (
        <p className="text-center text-primary text-3xl font-medium">
          Personne n'est encore inscrit.
        </p>
      )}
    </div>
  );
}
