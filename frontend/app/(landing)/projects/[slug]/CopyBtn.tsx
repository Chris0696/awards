"use client";
import Image from "next/image";
import CopyLinkIcon from "@/assets/linkIcon.svg";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

export default function CopyBtn() {
  const { handleCopy } = useCopyToClipboard();
  const handleCurrLinkCopy = () => {
    const currentUrl = window.location.href;
    handleCopy(currentUrl);
  };
  return (
    <button
      onClick={handleCurrLinkCopy}
      className="flex items-center border border-white px-6 py-2 rounded-md space-x-2 hover:bg-white hover:text-primary transition-colors cursor-pointer"
    >
      <Image
        src={CopyLinkIcon}
        width={4}
        height={4}
        alt="Copier"
        className="w-4 h-4"
      />
      <span>Copier</span>
    </button>
  );
}
