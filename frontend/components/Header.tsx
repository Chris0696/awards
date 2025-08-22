"use client";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Header() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  return (
    <header className="bg-primary py-5 px-10">
      <nav className="flex justify-between">
        <Link href={"/"}>
          <Image
            src={"/LOGO.svg"}
            alt="Project Awards Logo"
            width={100}
            height={100}
          />
        </Link>
        <div className=" hidden md:flex space-x-6 items-center text-white  ">
          <Link
            href={"/"}
            className={`${
              pathname === "/" ? "bg-white/10" : ""
            } rounded-md hover:bg-white/10 transition-colors px-3 py-2`}
          >
            Accueil
          </Link>
          <Link
            href={"/projects"}
            className={`${
              pathname === "/projects" ? "bg-white/10" : ""
            } rounded-md hover:bg-white/10 transition-colors px-3 py-2`}
          >
            Découvrir les projets
          </Link>
          <Link
            href={"/submit"}
            className={`${
              pathname === "/submit" ? "bg-white/10" : ""
            } rounded-md hover:bg-white/10 transition-colors px-3 py-2`}
          >
            Soumettre un projet
          </Link>
          <Link
            href={"/how-it-works"}
            className={`${
              pathname === "/how-it-works" ? "bg-white/10" : ""
            } rounded-md hover:bg-white/10 transition-colors px-3 py-2`}
          >
            Comment ça marche
          </Link>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-secondary px-8 cursor-pointer py-3 rounded-md text-white hover:bg-white hover:text-secondary transition-colors"
        >
          Se connecter
        </button>
      </nav>
      <LoginModal showModal={showModal} setShowModal={setShowModal} />
    </header>
  );
}
