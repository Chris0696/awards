"use client";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, useUserStore } from "@/stores/useUserStore";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOwner, toggleOwnerAccountAsAdmin } from "@/services/userService";

export default function UserTable({ users }: { users: User[] }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number>();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: () => {},
  });
  const updateMutation = useMutation({
    mutationFn: toggleOwnerAccountAsAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: () => {},
  });
  const handleDelete = () => {
    if (selectedUser) deleteMutation.mutate(selectedUser);
  };
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom et prénoms
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profession
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projets validés
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projets rejetés
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total projets soumis
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total votes reçus
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-normal max-w-[100px] ">
                <p>{user.full_name} </p>
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.age}
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.country_code + user.phone}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.profession}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.published_projects}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.rejected_projects}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.total_projects}{" "}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {user.total_votes_received}{" "}
              </td>

              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <MoreVerticalIcon />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => updateMutation.mutate(user.id)}
                    >
                      Désactiver
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user.id);
                        setShowConfirmationModal(true);
                      }}
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
      {/*  <CreateNewAuthProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        project={project}
      />*/}
      <ConfirmDeleteModal
        title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        setShowDeleteModal={setShowConfirmationModal}
        showDeleteModal={showConfirmationModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
