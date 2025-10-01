"use client";
import { Team } from "@/app/admin/team/page";
import { MoreVerticalIcon } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AddGdChildModal from "../modals/AddGdChildModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { AffiliateInfo } from "@/app/common/types/affiliate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminRelatedUser } from "@/services/userService";

export default function TeamTable({ teams }: { teams: AffiliateInfo[] }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AffiliateInfo>();
  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: deleteAdminRelatedUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setShowConfirmModal(false);
    },
  });

  const handleDelete = () => {
    if (selectedMember) deleteUserMutation.mutate(selectedMember.id);
  };
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom & prénoms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {teams?.map((team, idx) => (
            <tr
              key={idx}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {team?.full_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {team?.email}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {team.phone ? team.phone : "-"}
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setShowConfirmModal(true);
                        setSelectedMember(team);
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
        user_type="admin"
        title="Affiliés"
        description="Mettre à jour les infos du membre"
        showModal={showModal}
        setShowModal={setShowModal}
        member={selectedMember}
      />
      <ConfirmDeleteModal
        title="Êtes-vous sûr de vouloir supprimer ce membre ?"
        showDeleteModal={showConfirmModal}
        setShowDeleteModal={setShowConfirmModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
