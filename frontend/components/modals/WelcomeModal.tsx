"use client";
import Image from "next/image";

import Link from "next/link";
import LightBulbIcon from "@/assets/lightbulb.svg";
import OrangeCircle from "@/assets/orangecircle.svg";
import Popover from "../ui/Popover";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pathname === "/") {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [pathname, mounted]);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  if (!mounted) return null;

  /* useEffect(() => {
    setMounted(true);
    const closed = sessionStorage.getItem("hasClosedModal") === "true";
    setShowModal(!closed);
  }, []);

  if (!mounted) return null;
  const handleCloseModal = () => {
    sessionStorage.setItem("hasClosedModal", "true");
    setShowModal(false);
  }; */
  return (
    <Popover
      title="Date importante à retenir-Project Awards 2025 !"
      visible={showModal}
      onClose={handleCloseModal}
    >
      <div className="w-4/5 mx-auto mt-10 mb-5 ">
        <Image
          src={LightBulbIcon}
          alt="Material Icon"
          className="mx-auto w-12 h-12"
        />
        <div className="text-xl my-8 font-medium space-y-4 w-[85%] mx-auto ">
          <p className="flex space-x-2">
            <Image src={OrangeCircle} alt="bullet-point" className="w-4 h-4" />
            <span>
              Soumission des projets : du 6 Octombre au 20 Novembre 2025
            </span>
          </p>
          <p className="flex space-x-2">
            <Image src={OrangeCircle} alt="bullet-point" className="w-4 h-4" />
            <span>
              Votes en ligne : du 1er Décembre 2025 au 31 Janvier 2026
            </span>
          </p>
          <p className="flex space-x-2">
            <Image src={OrangeCircle} alt="bullet-point" className="w-4 h-4" />
            <span>Annonce des gagnants : Février 2026</span>
          </p>
        </div>
        <p>
          Ne manquez aucune annonce, suivez-nous sur nos réseaux sociaux et
          vivez l’aventure en direct
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            href={"/submit"}
            onClick={handleCloseModal}
            className="border border-secondary mt-10 bg-secondary text-white px-6 py-3 rounded-md transition-colors"
          >
            Soumettre mon projet
          </Link>
        </div>
      </div>
    </Popover>
  );
}
