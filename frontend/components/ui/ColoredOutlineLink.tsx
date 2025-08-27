import Link from "next/link";

export default function ColoredOutlineLink({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <Link
      href={url}
      className="border border-secondary px-6 py-2.5 rounded-md text-secondary hover:bg-secondary hover:text-gray-100 transition-colors"
    >
      {text}
    </Link>
  );
}
