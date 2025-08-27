import { links } from "@/app/common/headerlinks";
import { X } from "lucide-react";
import React from "react";
import NavLink from "./NavLink";
import Link from "next/link";
import ColoredLink from "./ColoredLink";

export default function MobileMenu({
  showMobileMenu,
  setShowMobileMenu,
}: {
  showMobileMenu: boolean;
  setShowMobileMenu: (showMobileMenu: boolean) => void;
}) {
  return (
    <aside
      style={{
        pointerEvents: showMobileMenu ? "auto" : "none",
        opacity: showMobileMenu ? 1 : 0,
      }}
      className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden transition-opacity duration-300"
    >
      <div
        className={` ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        } bg-primary text-white w-3/4 max-w-xs h-full p-8 flex flex-col space-y-6 
            transition-transform duration-600 top-0 right-0 `}
      >
        <button
          className="self-end text-3xl mb-6 p-3 rounded-full bg-white/20"
          onClick={() => setShowMobileMenu(false)}
        >
          <X />
        </button>
        {links.map((link, idx) => (
          <span key={idx} onClick={() => setShowMobileMenu(false)}>
            <NavLink href={link.url} text={link.page} />
          </span>
        ))}
        <ColoredLink
          url={"/login"}
          text="Se connecter"
          onClick={() => {
            setShowMobileMenu(false);
          }}
        />
      </div>
    </aside>
  );
}
