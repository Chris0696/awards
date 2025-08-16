import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

export default function Header() {
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
            className="rounded-md hover:bg-white/10 transition-colors px-3 py-2"
          >
            Accueil
          </Link>
          <Link
            href={"#"}
            className="rounded-md hover:bg-white/10 transition-colors px-3 py-2"
          >
            Découvrir les projets
          </Link>
          <Link
            href={"#"}
            className="rounded-md hover:bg-white/10 transition-colors px-3 py-2"
          >
            Soumettre un projet
          </Link>
          <Link
            href={"#"}
            className="rounded-md hover:bg-white/10 transition-colors px-3 py-2"
          >
            Comment ça marche
          </Link>
        </div>
        <Button variant="filled">Se connecter</Button>
      </nav>
    </header>
  );
}
