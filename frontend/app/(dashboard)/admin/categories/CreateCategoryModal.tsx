import TextField from "@/app/(landing)/submit/forms/TextField";
import { AdminCategory, Category } from "@/app/common/types/category";
import Popover from "@/components/ui/Popover";
import { categorySchema } from "@/frontendlib/schemas";
import { mapServerErrors } from "@/frontendlib/utils/mapServerErrors";

import { useCategoryStore } from "@/stores/useCategoryStore";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const onSubmit = (data: CategoryForm) => {
    try {
      if (category) {
        updateCategory(data.category_name, category.id);
      } else {
        addCategory(data.category_name);
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
              type="submit"
              className="bg-secondary w-full  px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
            >
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Popover>
  );
}
