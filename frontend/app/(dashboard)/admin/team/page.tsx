"use client";
import { useEffect, useState } from "react";
import DashboardHeader from "../../DasboardHeader";
import { getTeam } from "@/frontendlib/services/teamService";
import TeamTable from "@/components/dashboard/TeamTable";
import AddGdChildModal from "@/components/modals/AddGdChildModal";
import { AffiliateInfo } from "@/app/common/types/affiliate";
import { useQuery } from "@tanstack/react-query";
import { getAdminRelatedUsers } from "@/services/userService";

export type Team = {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  is_active: boolean;
  commission_rate: string;
  affiliate_link: string;
  total_projects: number;
  total_published_projects: number;
  total_rejected_projects: number;
  total_votes: number;
  total_revenue: string;
  commission_earned: string;
};
export default function page() {
  const [showModal, setShowModal] = useState(false);
  const { data: teams } = useQuery({
    queryKey: ["team"],
    queryFn: () => getAdminRelatedUsers(),
  });

  const filteredList = teams?.data?.filter(
    (member: Team) => member.user_type !== "commercial"
  );
  return (
    <section>
      <DashboardHeader pageTitle="Mon équipe" />
      <div className="mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary py-4 px-4 text-white rounded-lg text-lg flex items-center cursor-pointer hover:bg-white hover:border hover:border-primary hover:text-primary ml-auto
        "
        >
          Ajouter un membre
        </button>
      </div>
      {filteredList?.length > 0 ? (
        <TeamTable teams={filteredList} />
      ) : (
        <p className="text-center text-primary text-3xl font-medium">
          Vous n'avez ajouté personne pour le moment
        </p>
      )}

      <AddGdChildModal
        user_type="admin"
        title="Membre"
        description="Ajouter un membre en tant qu'admin"
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </section>
  );
}
