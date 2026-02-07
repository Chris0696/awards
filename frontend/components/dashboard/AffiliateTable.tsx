"use client";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import AddGdChildModal from "../modals/AddGdChildModal";
import { useState } from "react";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

import { Team } from "@/app/admin/team/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminRelatedUser } from "@/services/userService";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";
import { toast } from "sonner";
import Link from "next/link";
interface Props {
  affiliates: Team[];
}
export default function AffiliateTable({ affiliates }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Team>();
  const { handleCopy } = useCopyToClipboard();

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminRelatedUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setShowConfirmModal(false);
      toast.success("Utilisateur supprimé avec succès");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const handleDelete = () => {
    if (selectedMember) deleteUserMutation.mutate(selectedMember?.id);
  };
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du commercial
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liens d'affiliation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre de cliques
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidats inscrit via le lien
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projet soumis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {affiliates?.map((affiliate, idx) => (
            <tr
              key={idx}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.full_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.email}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate.phone ? affiliate.phone : "-"}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.affiliate_link?.slice(0, 4)}
                ...
                {affiliate?.affiliate_link?.slice(-5)}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.total_clicks}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.affiliates_count}
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.total_projects}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <MoreVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleCopy(affiliate.affiliate_link)}
                    >
                      Copier le lien
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/membership/details/${affiliate.commercial_id}`}
                      >
                        Voir détails
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowConfirmModal(true);
                        setSelectedMember(affiliate);
                      }}
                      className="cursor-pointer"
                    >
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddGdChildModal
        user_type="commercial"
        title="Affiliés"
        description="Mettre à jour un affilié (Ambassadeurs)"
        showModal={showModal}
        setShowModal={setShowModal}
        member={selectedMember}
      />
      <ConfirmDeleteModal
        title="Êtes-vous sûr de vouloir supprimer ce commercial ?"
        showDeleteModal={showConfirmModal}
        setShowDeleteModal={setShowConfirmModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
