"use client";
import DashboardHeader from "@/app/admin/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import UserTable from "@/components/UserTable";
import { useQuery } from "@tanstack/react-query";
import { getOwnersList } from "@/services/userService";
import Loader from "@/components/Loader";
import { useState } from "react";
import { Calendar22 } from "@/components/Calendar";

export default function page() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: users, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: () => getOwnersList(),
  });

  const filteredUsers = users?.results?.filter((user) => {
    if (
      search &&
      !user.full_name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (selectedDate && user.created_at) {
      const createdDate = new Date(user.created_at);
      const sameDay =
        createdDate.getFullYear() === selectedDate.getFullYear() &&
        createdDate.getMonth() === selectedDate.getMonth() &&
        createdDate.getDate() === selectedDate.getDate();

      if (!sameDay) return false;
    }
    return true;
  });

  if (isLoading) {
    return <Loader message="Chargement des utilisateurs..." />;
  }

  return (
    <div className="overflow-x-hidden">
      <DashboardHeader
        search={search}
        setSearch={setSearch}
        pageTitle="Utilisateurs inscrits"
      />
      <div className=" flex justify-end space-x-3  mb-5">
        <Calendar22
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        {/* <FilterBtn defaultText="Date" options={["Date"]} /> */}
        {/*  <FilterBtn defaultText="Statut" options={["Statut"]} /> */}
      </div>
      {users?.results.length > 0 ? (
        <div>
          <UserTable users={filteredUsers} />
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
