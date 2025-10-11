import Image from "next/image";
import { Infos } from "./SubheroSection";

export default function SubheroCard({ title, text, icon }: Infos) {
  return (
    <div className="bg-gray-200/30 rounded-4xl w-[290px] min-h-[265px] text-center p-7">
      <Image
        src={icon}
        alt="Light bulb filament icon"
        width={60}
        height={60}
        className="mx-auto object-cover"
      />
      <h3 className="text-xl font-medium text-gray-800 mt-8 mb-2">{title}</h3>
      <p className="text-gray-500 leading-5">{text}</p>
    </div>
  );
}
