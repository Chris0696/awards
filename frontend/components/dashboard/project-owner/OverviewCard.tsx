import ProjectSreenIcon from "@/assets/projectScreen.svg";
import ThumbsUpIcon from "@/assets/thumbsUp.svg";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

export default function OverviewCard() {
  return (
    <div className="p-4 bg-gray-100 rounded-md w-full ">
      <div className="flex justify-between items-center">
        <Image src={ProjectSreenIcon} alt="Project Screen" />
        <MoreVertical />
      </div>
      <h2 className="text-4xl font-bold mt-6 mb-7 text-green-500">03</h2>
      <p className="text-gray-600">
        Projects soumis et validés par Project Awards
      </p>
    </div>
  );
}
