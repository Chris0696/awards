import InfobulleIcon from "@/assets/infobulleIcon.svg";
import Image from "next/image";

export default function InfobulleCard() {
  return (
    <div className="px-4 pt-10 pb-5 bg-gray-200 rounded-md relative w-full max-w-80">
      <h2 className="text-xl text-gray-700 font-medium">
        Donnez un coup de boost à votre projet
      </h2>
      <p className="text-lg text-gray-500 mt-3">
        Plus vous partagez votre projet, plus augmentez vos chance d'obtenir des
        votes !
      </p>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center absolute -top-4 right-0">
        <Image src={InfobulleIcon} alt="Infobulle Icon" />
      </div>
    </div>
  );
}
