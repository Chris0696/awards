"use client";
import { useState } from "react";
import { toast } from "sonner";

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copie réussie");
    } catch (err) {
      toast.error("Erreur lors de la copie!");
    }
  };
  return { copied, handleCopy };
};

export default useCopyToClipboard;
