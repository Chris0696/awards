import TextField from "@/app/(landing)/submit/forms/TextField";
import { AdminCategory, Category } from "@/app/common/types/category";
import Popover from "@/components/ui/Popover";
import { categorySchema } from "@/frontendlib/schemas";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

import { createCategory, updateCategory } from "@/services/categoryService";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  category?: AdminCategory;
};
type CategoryForm = z.infer<typeof categorySchema>;
export default function CreateCategoryModal({
  showModal,
  setShowModal,
  category,
}: Props) {
  const methods = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      category_name: "",
    },
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {},
  });
  const onSubmit = (data: CategoryForm) => {
    try {
      if (category) {
        updateMutation.mutate({
          category_id: category.id,
          category_name: data.category_name,
        });
      } else {
        createMutation.mutate(data.category_name);
      }

      setShowModal(false);
      reset();
    } catch (error) {
      const message = mapServerErrors(error, setError);
      toast.error(message);
    }
  };
  useEffect(() => {
    if (category) {
      reset({
        category_name: category.category_name,
      });
    }
  }, [reset, category]);
  return (
    <Popover
      title={`${category ? "Modification" : "Créer une catégorie"} `}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <FormProvider {...methods}>
        <form className="p-6 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Nom de la catégorie"
            placeholder="Entrer le nom"
            name="category_name"
          />
          <div className="mt-6">
            <button
              disabled={updateMutation.isPending || createMutation.isPending}
              type="submit"
              className="bg-secondary w-full  px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
            >
              {updateMutation.isPending || createMutation.isPending
                ? "En cours..."
                : "Enregistrer"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Popover>
  );
}
