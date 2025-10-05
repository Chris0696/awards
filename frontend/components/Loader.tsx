"use client";
import { Loader2 } from "lucide-react";

export default function Loader({
  message = "Chargement en cours...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-secondary" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
