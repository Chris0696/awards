import Image from "next/image";
import Link from "next/link";
import { dashboardlinks } from "../common/navigationlinks";
import NavLink from "../common/NavLink";
import ProfilImg from "@/assets/defaultProfil.png";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/services/authService";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { extractBackendErrors } from "@/frontendlib/utils/extractBackendErrors";
import { toast } from "sonner";

export default function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const {
    user,
    additionalInfo: userInfo,
    setUserSession,
    setAdditionalInfo,
  } = useUserSessionStore();
  const router = useRouter();

  const mutateLogout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push("/");
      setUserSession(null);
      if (setAdditionalInfo) setAdditionalInfo(null);
    },
    onError: (err) => {
      const msg = extractBackendErrors(err);
      toast.error(msg);
    },
  });

  const filteredLinks = dashboardlinks.filter((link) => {
    if (user?.user_type === "owner") {
      return !link.isRequireAdmin;
    } else if (user?.user_type === "commercial") {
      return link.canCommercialAccess;
    } else {
      return dashboardlinks;
    }
  });

  return (
    <aside
      className={`bg-primary text-white pt-24 h-full rounded-xl  min-w-72 max-w-72
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
      <nav className="flex flex-col h-7/8 mt-auto space-y-8 px-6">
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
          <div className="flex space-x-2 items-center">
            <Image
              src={fixBackendUrl(userInfo?.image) ?? ProfilImg}
              alt="Profil image"
              className=" rounded-full w-10 h-10"
              width={80}
              height={80}
            />
            <p className="inline-block w-min text-xl">{user?.full_name}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <MoreVerticalIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <button
                  className="cursor-pointer"
                  onClick={() => mutateLogout.mutate()}
                >
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
