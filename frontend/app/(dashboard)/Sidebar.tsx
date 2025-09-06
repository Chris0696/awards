import Image from "next/image";
import Link from "next/link";
import { dashboardlinks } from "../common/navigationlinks";
import NavLink from "../common/NavLink";
import { useAuthStore } from "@/stores/useAuthStore";
import ProfilImg from "@/assets/profil.png";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const { user, logout } = useAuthStore();

  const filteredLinks = dashboardlinks.filter((link) => {
    if (user?.user_type !== "admin") {
      return !link.isRequireAdmin;
    }
  });

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
          {filteredLinks.map((link, idx) => (
            <NavLink key={idx} text={link.page} href={link.url} />
          ))}
        </div>
        <div className="flex justify-between mt-auto">
          <div>
            <Image
              src={ProfilImg}
              alt="Profil image"
              className=" rounded-full"
              width={50}
              height={50}
            />
            <p>{user?.full_name}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <MoreVerticalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button className="cursor-pointer" onClick={logout}>
                  Se déconnecter
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </aside>
  );
}
