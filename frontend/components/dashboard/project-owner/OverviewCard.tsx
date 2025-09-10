import ProjectSreenIcon from "@/assets/projectScreen.svg";
import ThumbsUpIcon from "@/assets/thumbsUp.svg";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

export default function OverviewCard({
  color,
  showThumb,
  title,
  total,
}: {
  color: string;
  showThumb?: boolean;
  title?: string;
  total?: number;
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-md w-full ">
      <div className="flex justify-between items-center">
        <Image
          src={showThumb ? ThumbsUpIcon : ProjectSreenIcon}
          alt="Project Screen"
        />
        <MoreVertical />
      </div>
      <h2 className={`text-4xl font-bold mt-6 mb-7 ${color}`}>{total} </h2>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}
