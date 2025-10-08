import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  text,
  href,
  onClose,
}: {
  text: string;
  href: string;
  onClose: (() => void) | undefined;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      onClick={onClose}
      href={href}
      className={`${
        isActive ? "bg-white/10" : ""
      } rounded-md hover:bg-white/10 transition-colors px-3 py-2`}
    >
      {text}
    </Link>
  );
}
