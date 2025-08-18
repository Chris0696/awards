import { ArrowRightIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@/assets/facebook.svg";
import LinkedinIcon from "@/assets/linkedin.svg";
import TwitterIcon from "@/assets/twitter.svg";
import WhatsappIcon from "@/assets/whatsapp.svg";
import ArrowRight from "@/assets/arrowRight.svg";
import WhiteOutlineLink from "./WhiteOutlineLink";

export default function Footer() {
  return (
    <footer className="py-16 bg-primary text-white">
      <div>
        <div className="text-center  mx-auto space-y-3 mb-16 px-6">
          <h2 className="font-bold text-4xl">Prêt à populser votre idée ?</h2>
          <p className="mb-10">
            <span className="block">
              Lancez votre projet aujourd'hui et touchez des milliers de
              personnes.
            </span>{" "}
            Ne laissez pas vos idées dormir dans un cannet.
          </p>

          <WhiteOutlineLink text="Soumettre mon projet maintenant" url="" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-around items-center py-16  border-t border-b border-gray-50/35 md:px-56">
        <div className="space-y-6">
          <Image
            src={"/LOGO.svg"}
            alt="Project Awards Logo"
            width={200}
            height={200}
          />

          <p>Project Awards - Le tremplin des idées innovantes</p>
          <div className="flex space-x-4">
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Image src={FacebookIcon} alt="Icon facebook" />
            </button>
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Image src={LinkedinIcon} alt="Icon linkedin" />
            </button>
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Image src={TwitterIcon} alt="Icon twitter" />
            </button>
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <Image src={WhatsappIcon} alt="Icon whatsapp" />
            </button>
          </div>
        </div>

        <div className="pb-16 hidden md:block">
          <h3 className="font-bold text-3xl mb-10">Legal</h3>
          <div className="space-y-4 flex flex-col text-gray-300">
            <Link href={""}>Réclamation</Link>
            <Link href={""}>Confidentialité</Link>
            <Link href={""}>Mentions légales</Link>
          </div>
        </div>
        <div className="mb-10 hidden md:block">
          <h3 className="font-bold text-3xl mb-10">Ressources</h3>
          <div className="space-y-4 flex flex-col text-gray-300">
            <Link href={""}>Blog</Link>
            <Link href={""}>FAQ</Link>
            <Link href={""}>À propos</Link>
            <Link href={""}>Contact</Link>
          </div>
        </div>
        <div className="flex justify-around md:hidden mt-10  w-full">
          <div className="pb-16">
            <h3 className="font-bold text-3xl mb-10">Legal</h3>
            <div className="space-y-4 flex flex-col text-gray-300">
              <Link href={""}>Réclamation</Link>
              <Link href={""}>Confidentialité</Link>
              <Link href={""}>Mentions légales</Link>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="font-bold text-3xl mb-10">Ressources</h3>
            <div className="space-y-4 flex flex-col text-gray-300">
              <Link href={""}>Blog</Link>
              <Link href={""}>FAQ</Link>
              <Link href={""}>À propos</Link>
              <Link href={""}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:pl-48 py-16 border-b border-gray-50/35 px-4">
        <p className="md:w-1/2 ">
          Recevez directement dans votre boîte mail les projets en cours, les
          nouveautés de la plateforme et les projets lauréats. Pas de spam, que
          de l'inspiration.
        </p>
        <form className="flex flex-col md:flex-row items-center space-x-2">
          <input
            type="email"
            placeholder="Entrez votre adresse email"
            className="bg-white text-primary border-none outline-none py-3 px-2 rounded-md md:w-72"
          />
          <button className="flex items-center bg-secondary rounded-md px-5 py-3 hover:bg-white hover:text-secondary transition-colors">
            <span>Je m'abonne</span> <ChevronRight />
          </button>
        </form>
      </div>
      <div className="text-center pt-10 text-gray-300 font-normal">
        Copyright © {new Date().getFullYear()} PROJECT AWARDS. Designed by
        SCAR-SOFT
      </div>
    </footer>
  );
}
