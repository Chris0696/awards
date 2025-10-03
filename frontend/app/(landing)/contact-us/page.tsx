import CallBackIcon from "@/assets/phonecallback.svg";
import LocationSearch from "@/assets/locationSearching.svg";
import MailboxIcon from "@/assets/mailbox.svg";

import ContactUsHero from "./ContactUsHero";
import Image from "next/image";

export default function page() {
  return (
    <section>
      <ContactUsHero />
      <div className="py-16 space-y-12">
        <div className="flex justify-center space-x-10">
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
        <div className="bg-gray-200/50 rounded-md grid grid-cols-2 w-[80%] mx-auto px-60 gap-4 py-24">
          <div className="w-full">
            <input
              type="text"
              name=""
              placeholder="Nom complet"
              id=""
              className="h-full w-full p-4 bg-white"
            />
          </div>
          <div className="w-full">
            <input
              type="email"
              name=""
              placeholder="Email Adresse"
              id=""
              className="h-full w-full p-4 bg-white"
            />
          </div>

          <div className="w-full">
            <input
              type="tel"
              name=""
              placeholder="Téléphone"
              id=""
              className="h-full w-full p-4 bg-white"
            />
          </div>
          <div className="w-full">
            <input
              type="text"
              name=""
              placeholder="Objet"
              id=""
              className="h-full w-full p-4 bg-white"
            />
          </div>
          <div className="col-span-2 pt-6">
            <textarea
              cols={10}
              rows={4}
              className="h-full w-full p-4 bg-white"
              name=""
              id=""
              placeholder="Écrivez votre message ici"
            ></textarea>
          </div>
          <div className="col-span-2">
            <button className="bg-secondary text-white cursor-pointer hover:bg-white hover:border hover:border-secondary hover:text-secondary transition-colors rounded-md px-6 py-3">
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
