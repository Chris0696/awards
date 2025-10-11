"use client";
import CallBackIcon from "@/assets/phonecallback.svg";
import LocationSearch from "@/assets/locationSearching.svg";
import MailboxIcon from "@/assets/mailbox.svg";

import ContactUsHero from "./ContactUsHero";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";
import { messageFormSchema } from "@/frontendlib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/services/messageService";
import { toast } from "sonner";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";

type MessageForm = z.infer<typeof messageFormSchema>;

export default function Page() {
  const methods = useForm<MessageForm>({
    resolver: zodResolver(messageFormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods;

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success("Message envoyé avec succes");
      reset();
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const onSubmit = (data: MessageForm) => {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone.startsWith("+229") ? data.phone : `+229 ${data.phone}`,
      subject: data.subject,
      message: data.message,
    };
    sendMessageMutation.mutate(payload);
  };
  return (
    <section>
      <ContactUsHero />
      <div className="py-16 space-y-12">
        <div className="flex flex-col items-center space-y-10 md:space-y-0 md:flex-row md:justify-center md:space-x-10">
          <div className="pt-4 pl-5  rounded-md bg-gray-200/50 h-40 w-52">
            <div className="pl-2">
              <Image
                width={23}
                height={23}
                className=""
                src={CallBackIcon}
                alt="phone call icon"
              />
            </div>
            <p className="my-3 font-normal">Téléphone</p>
            <div className="leading-6 text-lg font-medium text-black">
              <p>+229 0163875811</p>
              <p>+229 0163875774</p>
            </div>
          </div>
          <div className="pt-4 pl-5  rounded-md bg-gray-200/50 h-40 w-52">
            <div className="">
              <Image
                width={23}
                height={23}
                className=""
                src={LocationSearch}
                alt="phone call icon"
              />
            </div>
            <p className="my-3 font-normal">Adresse</p>
            <div className=" text-lg font-medium text-black">
              <p>Cotonou, Bénin</p>
            </div>
          </div>
          <div className="pt-4 pl-5  rounded-md bg-gray-200/50 h-40 w-52">
            <div className="">
              <Image
                width={23}
                height={23}
                className=""
                src={MailboxIcon}
                alt="phone call icon"
              />
            </div>
            <p className="my-3 font-normal">Mail</p>
            <div className=" text-lg font-medium text-black">
              <p>contact@scarsoft.net</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200/50 rounded-md grid grid-cols-2 w-[80%] mx-auto px-5 md:px-15 lg:px-60 gap-4 py-24"
        >
          <div className="w-full col-span-2 md:col-span-1">
            <p>
              {" "}
              <input
                type="text"
                {...register("full_name")}
                placeholder="Nom complet"
                id=""
                className="h-full w-full p-4 bg-white"
              />
            </p>
            {errors.full_name && (
              <span className="text-red-500 text-sm">
                {errors.full_name.message}
              </span>
            )}
          </div>
          <div className="w-full col-span-2 md:col-span-1">
            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Email Adresse"
                id=""
                className="h-full w-full p-4 bg-white"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="w-full col-span-2 md:col-span-1">
            <p>
              <input
                type="tel"
                {...register("phone")}
                placeholder="Téléphone"
                id=""
                className="h-full w-full p-4 bg-white"
              />
            </p>
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div className="w-full col-span-2 md:col-span-1">
            <p>
              <input
                type="text"
                {...register("subject")}
                placeholder="Objet"
                id=""
                className="h-full w-full p-4 bg-white"
              />
            </p>
            {errors.subject && (
              <span className="text-red-500 text-sm">
                {errors.subject.message}
              </span>
            )}
          </div>
          <div className="col-span-2 pt-6">
            <p>
              <textarea
                cols={10}
                rows={4}
                className="h-full w-full p-4 bg-white"
                {...register("message")}
                id=""
                placeholder="Écrivez votre message ici"
              ></textarea>
            </p>
            {errors.message && (
              <span className="text-red-500 text-sm">
                {errors.message.message}
              </span>
            )}
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-secondary text-white cursor-pointer hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-colors rounded-md px-6 py-3"
            >
              Contactez-nous
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
