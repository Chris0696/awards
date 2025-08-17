import ProfilImg from "@/assets/profil.png";
import Image from "next/image";

export default function TestimonialCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-2xl md:w-md space-y-10">
      <p className="text-sm text-gray-800 line-clamp-4 md:line-clamp-none">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem
        quod officiis ratione praesentium natus rerum dignissimos molestiae
        quibusdam modi voluptatibus velit vitae quae cum, quas tempore. Optio
        quos rem molestias aut, a omnis voluptates in consequatur dolorem
        quaerat minus laborum voluptas, vitae cumque totam reiciendis,
        doloremque incidunt voluptate nemo eveniet dolorum. Asperiores modi at
        beatae corrupti illo, recusandae rem nihil!
      </p>
      <div className="flex items-center space-x-1">
        <Image
          src={ProfilImg}
          alt="Project owner profil image"
          className="w-12 h-12 rounded-full object-cover border border-gray-400"
        />
        <p className="leading-3">
          <span className="block font-medium">Sophie B</span>
          <span className="text-gray-600 text-sm">Porteuse de projet</span>
        </p>
      </div>
    </div>
  );
}
