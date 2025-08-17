"use client";
import { MinusIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function AccordionItem({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 transition">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left cursor-pointer"
      >
        <span className="text-base font-medium text-gray-900">{title}</span>
        {open ? (
          <MinusIcon className="w-6 h-6" />
        ) : (
          <PlusIcon className="w-6 h-6 " />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all border-t pt-2 duration-300 ease-in-out ${
          open ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
}
