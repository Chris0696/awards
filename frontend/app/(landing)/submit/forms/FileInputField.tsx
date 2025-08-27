import CameraIcon from "@/assets/camera.svg";
import Image from "next/image";

export default function FileInputField() {
  return (
    <div>
      <label className="block text-gray-800 text-lg font-medium">
        <span>Image illustrative</span>
      </label>
      <label
        htmlFor="file-upload"
        className="border-dashed border-2 border-gray-300 py-8 px-2 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center  "
      >
        <Image src={CameraIcon} alt="Upload file" className="w-10 h-10" />
      </label>
      <input
        id="file-upload"
        type="file"
        className="border-none hidden outline-none bg-gray-100 px-2 py-2 rounded-md w-full text-gray-500 text-lg"
      />
      <p className="text-gray-500 font-normal">JPEG ou PNG - 5Mo Max</p>
    </div>
  );
}
