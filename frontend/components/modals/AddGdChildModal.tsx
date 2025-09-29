import React, { useEffect } from "react";
import Popover from "../ui/Popover";
import TextField from "../../app/(landing)/submit/forms/TextField";
import EmailField from "../../app/(landing)/submit/forms/EmailField";
import PhoneNumberField from "../../app/(landing)/submit/forms/PhoneNumberField";
import { FormProvider, useForm } from "react-hook-form";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAffiliateSchema,
  createUserSchema,
  updateAffiliateSchema,
} from "@/frontendlib/schemas";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAdminRelatedUser,
  updateAdminRelatedUser,
} from "@/services/userService";
import { Team } from "@/app/(dashboard)/admin/team/page";
import axios, { AxiosError } from "axios";
import { BackendError } from "@/services/apiClient";
import { toast } from "sonner";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  title: string;
  description: string;
  user_type: "commercial" | "admin";
  member?: Team;
};
export type CreateAffiliateForm = z.infer<typeof createAffiliateSchema>;
export type UpdateAffiliateForm = z.infer<typeof updateAffiliateSchema>;
export type AffiliateForm = CreateAffiliateForm | UpdateAffiliateForm;
export type User = z.infer<typeof createUserSchema>;

export type UpdateTeamMemberForm = {
  id: number;
  username: string;
  email: string;
  password: string;
  user_type: "admin" | "commercial";
  phone: string;
};
export default function AddGdChildModal({
  showModal,
  setShowModal,
  title,
  description,
  user_type,
  member,
}: Props) {
  const methods = useForm<AffiliateForm>({
    resolver: zodResolver(
      member ? updateAffiliateSchema : createAffiliateSchema
    ),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      user_type: user_type,
      phone: "",
    },
  });

  const queryClient = useQueryClient();
  const { handleSubmit, reset } = methods;
  const createMutation = useMutation({
    mutationFn: addAdminRelatedUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setShowModal(false);
      reset();
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminRelatedUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (error) => {},
  });
  const onSubmit = (data: AffiliateForm) => {
    if (user_type === "commercial") {
      if (member) {
        const payload = {
          id: member.id,
          ...data,
        };
        updateMutation.mutate(payload as User);
      } else {
        createMutation.mutate(data as User);
      }
    } else {
      if (member) {
        const payload = {
          id: member.id,
          ...data,
        };
        updateMutation.mutate(payload as User);
      } else {
        createMutation.mutate(data as User);
      }
    }
  };

  useEffect(() => {
    if (member) {
      reset({
        username: member?.full_name,
        email: member?.email,
        user_type: member.user_type,
        phone: member?.phone ?? "",
      });
    }
  }, [reset, member]);
  return (
    <Popover
      visible={showModal}
      onClose={() => setShowModal(false)}
      title=""
      isLogin
    >
      <FormProvider {...methods}>
        <form className="px-16 pb-16 pt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center text-center mb-8">
            <div>
              <h2 className="text-4xl font-bold">{title} </h2>
              <p className="text-xl">{description} </p>
            </div>
          </div>
          <div className="space-y-4">
            <TextField
              name="username"
              label="Nom complet"
              placeholder="Nom & prénoms"
            />
            <EmailField name="email" label="Adresse mail" placeholder="Email" />
            {!member && (
              <PasswordField
                name="password"
                label="Mot de passe"
                placeholder="Mot de passe"
              />
            )}
            <PhoneNumberField
              name="phone"
              label="Téléphone"
              placeholder="+229 01xxxxxxxx"
            />
          </div>
          <div className="mt-12">
            <button
              type="submit"
              className="bg-primary w-full py-4 px-4 text-white rounded-lg text-lg flex items-center justify-center cursor-pointer hover:bg-white hover:border hover:border-primary hover:text-primary
        "
            >
              {member ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Popover>
  );
}
