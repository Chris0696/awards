"use client";
import AddGdChildModal from "@/components/modals/AddGdChildModal";
import DashboardHeader from "@/app/admin/DasboardHeader";

import SwitchPageBtn from "@/components/dashboard/SwitchPageBtn";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import AffiliateTable from "@/components/dashboard/AffiliateTable";
import { useQuery } from "@tanstack/react-query";
import { getAdminRelatedUsers } from "@/services/userService";

import { Team } from "../team/page";
import Loader from "@/components/Loader";

export default function page() {
  const [showModal, setShowModal] = useState(false);

  const { data: affiliates, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: () => getAdminRelatedUsers(),
  });

  const filteredList = affiliates?.data?.filter(
    (affiliate: Team) => affiliate.user_type !== "admin"
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
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
      {filteredList?.length > 0 ? (
        <div>
          <AffiliateTable affiliates={filteredList} />
          {/*           <SwitchPageBtn /> */}
        </div>
      ) : (
        <p className="text-center text-primary text-3xl font-medium">
          Vous n'avez ajouté aucun commercial pour le moment
        </p>
      )}
      <AddGdChildModal
        user_type="commercial"
        title="Affiliés"
        description="Créer un affilié (Commerciaux)"
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </section>
  );
}
