import Partner1Img from "@/assets/partner1.png";
import Partner2Img from "@/assets/partner2.png";
import Partner3Img from "@/assets/partner3.png";
import Partner4Img from "@/assets/partner4.png";
import Partner5Img from "@/assets/partner5.png";
import Image from "next/image";

export default function PartnersSection() {
  return (
    <section className="py-10 flex justify-center">
      <div className="flex px-4 md:w-2/4 gap-4 overflow-x-auto">
        <Image
          src={Partner1Img}
          alt="Partner 1 company logo"
          className="object-cover"
        />
        <Image
          src={Partner2Img}
          alt="Partner 2 company logo"
          className="object-cover"
        />
        <Image
          src={Partner3Img}
          alt="Partner 3 company logo"
          className="object-cover"
        />
        <Image
          src={Partner4Img}
          alt="Partner 4 company logo"
          className="object-cover"
        />
        <Image
          src={Partner5Img}
          alt="Partner 5 company logo"
          className="object-cover"
        />
      </div>
    </section>
  );
}
