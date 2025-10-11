"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import NavLink from "../../common/NavLink";
import MobileMenu from "./MobileMenu";
import ColoredLink from "../../../components/ui/ColoredLink";
import { landingpagelinks } from "@/app/common/navigationlinks";
import { useUserSessionStore } from "@/stores/useUserSessionStore";

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = useUserSessionStore((state) => state.user);

  return (
    <header className="bg-primary py-5 px-10">
      <nav className="flex justify-between">
        <Link href={"/"}>
          <Image
            src={"/LOGO.svg"}
            alt="Project Awards Logo"
            className="object-cover"
            width={100}
            height={100}
          />
        </Link>
        <div className=" hidden md:flex space-x-6 items-center text-white  ">
          {landingpagelinks.map((link, idx) => (
            <NavLink key={idx} href={link.url} text={link.page} />
          ))}
          {!user ? (
            <ColoredLink url="/login" text="Se connecter" />
          ) : (
            <ColoredLink url="/admin" text="Dashboard" />
          )}
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
