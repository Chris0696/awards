"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import NavLink from "./NavLink";
import { links } from "@/app/common/headerlinks";
import MobileMenu from "./MobileMenu";
import ColoredLink from "./ColoredLink";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
          {links.map((link, idx) => (
            <NavLink key={idx} href={link.url} text={link.page} />
          ))}
          <ColoredLink url="/login" text="Se connecter" />
        </div>
        <button
          className="text-white md:hidden"
          onClick={() => setShowMobileMenu(true)}
        >
          <MenuIcon size={30} />
        </button>
      </nav>

      <MobileMenu
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
    </header>
  );
}
