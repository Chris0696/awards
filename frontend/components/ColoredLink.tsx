import Link from "next/link";

export default function ColoredLink({
  text,
  url,
  onClick,
}: {
  text: string;
  url: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={url}
      className="bg-secondary hover:bg-gray-100 hover:text-secondary  text-gray-100 px-8 py-3 rounded-md  cursor-pointer  transition-colors"
    >
      {text}
    </Link>
  );
}
