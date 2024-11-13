import { useState } from "react";
import { toast } from "sonner";

const useCopy = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy text");
      setIsCopied(false);
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopy;
