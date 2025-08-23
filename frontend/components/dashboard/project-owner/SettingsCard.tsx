import LanguageIcon from "@/assets/language.svg";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  icon: string;
};

export default function SettingsCard({ title, description, icon }: Props) {
  return (
    <div className="border border-gray-300 rounded-xl p-8 w-full max-w-sm">
      <div className="flex space-x-4">
        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
          <Image src={icon} alt={`${title} Icon`} className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xl font-medium text-gray-800">{title}</h4>
          <p className="text-gray-600 text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
}
