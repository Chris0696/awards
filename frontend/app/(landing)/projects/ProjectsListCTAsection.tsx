import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectsListCTAsection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-primary w-[68%] mx-auto rounded-xl my-24">
      <div className="text-white flex flex-col justify-center items-start pl-4  md:pl-28 space-y-4">
        <div className="font-bold text-2xl">
          <p>Vous avez aimé ces idées ?</p>
          <p>Rejoignez-nous pour rester à l'affût des prochains événements</p>
        </div>
        <Link
          href={""}
          className="flex items-center bg-white rounded-md text-primary px-6 py-2 w-max"
        >
          <span>Rejoindre maintenant</span>
          <ChevronRight />
        </Link>
      </div>
      <div>
        <Image
          src={"./happman.svg"}
          alt="Happyman"
          className=" object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
