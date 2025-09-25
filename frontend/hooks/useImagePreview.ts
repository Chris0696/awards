import { useEffect, useState } from "react";

export function useImagePreview(fileList: FileList | null) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file instanceof File) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(null);
    }
  }, [fileList]);

  return preview;
}
