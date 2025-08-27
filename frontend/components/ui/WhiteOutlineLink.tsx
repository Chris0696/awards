import Link from "next/link";

export default function WhiteOutlineLink({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <Link
      href={url}
      className="border border-gray-50 px-6 py-3 text-white rounded-md hover:bg-gray-50 hover:text-secondary transition-colors"
    >
      {text}
    </Link>
  );
}
