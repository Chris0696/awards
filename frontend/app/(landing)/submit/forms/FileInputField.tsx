import CameraIcon from "@/assets/camera.svg";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";

export default function FileInputField() {
  const { control } = useFormContext();
  const imageFiles = useWatch({ control, name: "image" });
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const fileOrUrl = imageFiles[0];
      if (typeof fileOrUrl === "string") {
        // It's a URL from edit mode
        setIsEditMode(true);
        setPreview(fileOrUrl);
        previewRef.current = null;
        return;
      }
      if (fileOrUrl instanceof File) {
        setIsEditMode(false);
        const url = URL.createObjectURL(fileOrUrl);
        setPreview(url);
        previewRef.current = url;
        return () => {
          if (previewRef.current) {
            URL.revokeObjectURL(previewRef.current);
            previewRef.current = null;
          }
        };
      }
    } else {
      setPreview(null);
    }
  }, [imageFiles]);

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center w-full h-40 relative overflow-hidden"
        style={{ minHeight: "10rem" }}
      >
        {preview ? (
          <Image
            src={`${
              isEditMode && typeof imageFiles?.[0] === "string"
                ? fixBackendUrl(imageFiles)
                : preview
            } `}
            alt="preview image"
            fill
            className="object-cover w-full h-full"
            style={{ position: "absolute", inset: 0 }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image src={CameraIcon} alt="Upload file" className="w-10 h-10" />
            <span className="text-gray-500 mt-2">
              Ajouter une image ayant rapport avec votre projet{" "}
            </span>
          </div>
        )}
      </label>
      <Controller
        control={control}
        name="image"
        render={({ field: { onChange, ref }, fieldState: { error } }) => (
          <>
            <input
              ref={ref}
              onChange={(e) => onChange(e.target.files)}
              id="file-upload"
              type="file"
              className="border-none hidden outline-none bg-gray-100 px-2 py-2 rounded-md w-full text-gray-500 text-lg"
            />
            <p
              className={`${
                error ? "text-red-500" : "text-gray-500"
              }  font-normal`}
            >
              {error ? error.message : "JPEG ou PNG - 5Mo Max"}
            </p>
          </>
        )}
      />
    </div>
  );
}
