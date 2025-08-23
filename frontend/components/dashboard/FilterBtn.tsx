import React from "react";

export default function FilterBtn({ text }: { text: string }) {
  return (
    <button className="px-6 py-2 text-lg font-medium rounded-lg border border-primary text-primary cursor-pointer">
      {text}
    </button>
  );
}
