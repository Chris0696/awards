"use client";
import ProfilImg from "@/assets/profil.png";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import { useImagePreview } from "@/hooks/useImagePreview";
import { updateUserInfo } from "@/services/userService";

import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type UserForms = {
  full_name: string;
  image: FileList | null;
  phone: string | null;
  profession: string | null;
};
export interface IUserInfo {
  id: number;
  image: string;
  full_name: string;
  phone: string | null;
  profession: string | null;
  date?: string;
  user: number;
}

export default function page() {
  const userInfo = useUserSessionStore((state) => state.additionalInfo);

  const updateMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      toast.success("Informations mises à jour");
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const methods = useForm<UserForms>({
    defaultValues: {
      full_name: "",
      phone: "",
      profession: "",
    },
  });
  const { register, handleSubmit, setValue, watch } = methods;
  const image: FileList | null = watch("image");
  const preview = useImagePreview(image);

  useEffect(() => {
    if (userInfo) {
      setValue("full_name", userInfo.full_name);

      setValue("phone", userInfo.phone);
      setValue("profession", userInfo.profession);
    }
  }, [userInfo, setValue]);

  const onSubmit = async (data: UserForms) => {
    const formData = new FormData();
    formData.append("user_id", String(userInfo?.id));
    formData.append("full_name", data.full_name);
    formData.append("phone", data.phone || "");
    formData.append("profession", data.profession || "");
    formData.append("user", String(userInfo?.user));

    const fileInput = data.image as unknown as FileList;
    if (fileInput && fileInput.length > 0) {
      formData.append("image", fileInput[0]);
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-16">
      <h2 className="text-2xl font-bold">Gérer mon compte</h2>
      <div className="bg-gray-500/5 w-full max-w-xl p-7 rounded-md">
        <h3 className="text-xl text-gray-800 font-semibold">
          Informations personnelles
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          <div className="flex items-center space-x-3">
            {!preview ? (
              <Image
                src={fixBackendUrl(userInfo?.image) ?? ""}
                alt="Photo de profil"
                width={100}
                height={100}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <Image
                src={preview}
                alt="Photo de profil"
                width={100}
                height={100}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div className="space-y-1">
              <h4 className="text-xl text-gray-800">{userInfo?.full_name} </h4>
              <label htmlFor="profil" className="underline">
                <input
                  type="file"
                  id="profil"
                  {...register("image")}
                  className="hidden"
                />{" "}
                <span>Modifier l'image</span>
              </label>
            </div>
          </div>
          <div className="space-y-6 mt-6">
            <div>
              <label htmlFor="fullname" className="text-gray-700 text-sm block">
                Nom & prénom
              </label>
              <input
                type="text"
                id="fullname"
                {...register("full_name")}
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            {/*  <div>
              <label htmlFor="email" className="text-gray-700 text-sm block">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div> */}
            <div>
              <label htmlFor="tel" className="text-gray-700 text-sm block">
                Téléphone / Whatsapp
              </label>
              <input
                type="tel"
                id="tel"
                {...register("phone")}
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div>
              <label
                htmlFor="profession"
                className="text-gray-700 text-sm block"
              >
                Profession ou statut actuel
              </label>
              <input
                type="text"
                id="profession"
                {...register("profession")}
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div className="">
              <button
                type="submit"
                className="bg-primary text-white px-2 py-2 cursor-pointer rounded-md"
              >
                {updateMutation.isPending
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
