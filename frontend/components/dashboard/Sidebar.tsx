import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-primary text-white  pt-24 h-full rounded-lg min-w-72 max-w-72 -translate-x-full md:translate-x-0">
      <nav className="flex flex-col space-y-8 px-6">
        <Link href="/" className="p-3">
          <Image
            src={"/LOGO.svg"}
            alt="Project Awards Logo"
            width={150}
            height={150}
          />
        </Link>
        <div className=" flex flex-col space-y-8 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <Link
            href={"/admin"}
            className="w-full bg-white/10 px-3 py-2 rounded-md text-lg "
          >
            Accueil
          </Link>
          <Link
            href={"/admin/projects"}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Projets
          </Link>
          <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Utilisateurs
          </Link>
          <Link
            href={"/admin/statistics"}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Votes & statistiques
          </Link>
          <Link
            href={"/admin/account"}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Mon compte
          </Link>
          <Link
            href={"/admin/settings"}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Paramètres
          </Link>
          <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Catégories & tags
          </Link>
          <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Affiliation
          </Link>
          <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Pris/Récompenses
          </Link>
          <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Paramètres
          </Link>
        </div>
      </nav>
    </aside>
  );
}
