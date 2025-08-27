import React from "react";
import { CrossIcon } from "lucide-react";
import Image from "next/image";

type PopoverProps = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title: string;
  isLogin?: boolean;
};

export default function Popover({
  visible,
  onClose,
  children,
  title,
  isLogin,
}: PopoverProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
      <div className="bg-white  rounded-lg  relative w-full max-w-2xl">
        <div className="flex items-center justify-between rounded-t-lg bg-primary px-10 py-2 text-white">
          {!isLogin ? (
            <h2 className=" font-semibold">{title}</h2>
          ) : (
            <Image
              src="/LOGO.svg"
              alt="Project Awards Logo"
              width={70}
              height={70}
            />
          )}{" "}
          <button
            onClick={onClose}
            className="text-2xl text-gray-900 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center cursor-pointer"
          >
            <span>&times;</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
