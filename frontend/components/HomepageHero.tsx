import Link from "next/link";
import HeroImg from "@/assets/heroImage.png";
import Image from "next/image";
import ColoredLink from "./ColoredLink";
import WhiteOutlineLink from "./WhiteOutlineLink";

export default function HomePageHero() {
  return (
    <section className="bg-primary grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className=" px-24 h-auto py-8">
          <h4 className="text-gray-200 mb-5 text-xl">
            DONNEZ VIE À VOTRE IDÉE
          </h4>
          <h2 className="text-gray-50 font-bold text-6xl">
            Soumettez votre projet, faites le voter, obtenez un financement
          </h2>
          <p className="text-gray-100 my-10 text-lg">
            Transformez votre vision en réalité grâce au soutiien de la
            communauté. Project Awards récompense les projets les plus
            inspirants
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 text-center">
            <ColoredLink text="Soumettre mon projet" url="/submit" />

            <WhiteOutlineLink text="Découvrir les projets" url="/projects" />
          </div>
        </div>
      </div>
      <div>
        <Image src={HeroImg} alt="Hero section image" />
      </div>
    </section>
  );
}
