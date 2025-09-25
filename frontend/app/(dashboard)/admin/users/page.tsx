"use client";
import DashboardHeader from "@/app/(dashboard)/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import UserTable from "@/components/UserTable";

export default function page() {
  const users = useUserStore((state) => state.user);
  const getUsers = useUserStore((state) => state.getUsers);
  console.log(users, "usersss");

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="overflow-x-hidden">
      <DashboardHeader pageTitle="Utilisateurs inscrits" />
      <div className=" flex justify-end space-x-3  mb-5">
        <FilterBtn text="Date" />
        <FilterBtn text="Statut" />
      </div>
      {users.length > 0 ? (
        <div>
          <UserTable users={users} />
          <SwitchPageBtn />
        </div>
      ) : (
        <p className="text-center text-primary text-3xl font-medium">
          Vous n'avez ajouté personne pour le moment
        </p>
      )}
    </div>
  );
}
