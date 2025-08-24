import Image from "next/image";
import Link from "next/link";

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside
      className={`bg-primary text-white pt-24 h-full rounded-lg min-w-72 max-w-72
        fixed top-0 left-0 z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0`}
    >
      <button
        className="md:hidden absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
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
            href={"/admin/users"}
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
          {/*  <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Catégories & tags
          </Link> */}
          <Link
            href={"/admin/membership"}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Affiliation
          </Link>
          {/* <Link
            href={""}
            className="w-full hover:bg-white/10 transition-colors px-3 py-2 rounded-md text-lg "
          >
            Pris/Récompenses
          </Link> */}
        </div>
      </nav>
    </aside>
  );
}
