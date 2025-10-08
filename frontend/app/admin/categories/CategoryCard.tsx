"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";
import CreateCategoryModal from "./CreateCategoryModal";
import { AdminCategory } from "@/app/common/types/category";
import Popover from "@/components/ui/Popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/services/categoryService";
import { toast } from "sonner";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

export default function CategoryCard({
  color,
  category,
}: {
  color: string;
  category: AdminCategory;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number>();
  return (
    <div className="bg-gray-200/50 p-4 rounded-xl space-y-8 w-full md:max-w-[220px]">
      <div className="flex justify-between">
        <h4 className="text-lg text-gray-600  ">
          {category.category_name
            ? category.category_name
            : "Nombre total de projets validés"}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer">
              <MoreVerticalIcon size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <button
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                Modifier
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setCategoryToDelete(category.id);
                }}
                className="cursor-pointer"
              >
                Supprimer
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className={`text-4xl font-semibold text-center ${color}  `}>
        {category.project_count !== undefined ? category.project_count : 150}
      </p>
      <CreateCategoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        category={category}
      />
      <DeleteCategoryModal
        categoryId={categoryToDelete}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </div>
  );
}

const DeleteCategoryModal = ({
  showDeleteModal,
  setShowDeleteModal,
  categoryId,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  categoryId: number | undefined;
}) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Catégorie supprimée avec succès");
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const handleDelete = () => {
    if (categoryId) deleteMutation.mutate(categoryId);
  };
  return (
    <Popover
      title="Confirmation de suppression"
      visible={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
    >
      <div className="p-8  text-center space-y-4">
        <p className="text-xl ">
          Êtes-vous sûr de vouloir supprimer cette catégorie ?
        </p>
        <p className="space-x-5">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
          >
            Non
          </button>
          <button
            onClick={handleDelete}
            className="bg-secondary text-white px-6 py-2 rounded-md cursor-pointer"
          >
            Oui
          </button>
        </p>
      </div>
    </Popover>
  );
};
