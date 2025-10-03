import CameraIcon from "@/assets/camera.svg";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

export default function FileInputField() {
  const { control } = useFormContext();
  const imageFiles = useWatch({ control, name: "image" });
  const previewRef = useRef<string | null>(null);

  // Create preview URL and cleanup
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const url = URL.createObjectURL(imageFiles[0]);
      previewRef.current = url;
      return () => {
        if (previewRef.current) {
          URL.revokeObjectURL(previewRef.current);
          previewRef.current = null;
        }
      };
    }
  }, [imageFiles]);

  const preview =
    imageFiles && imageFiles.length > 0 ? previewRef.current : null;

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center w-full h-40 relative overflow-hidden"
        style={{ minHeight: "10rem" }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="preview image"
            fill
            className="object-cover w-full h-full"
            style={{ position: "absolute", inset: 0 }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Image src={CameraIcon} alt="Upload file" className="w-10 h-10" />
            <span className="text-gray-500 mt-2">Ajouter une image</span>
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
