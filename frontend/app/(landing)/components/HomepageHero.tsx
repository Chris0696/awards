import HeroImg from "@/assets/heroImage.png";
import Image from "next/image";
import ColoredLink from "@/components/ui/ColoredLink";
import WhiteOutlineLink from "@/components/ui/WhiteOutlineLink";

export default function HomePageHero() {
  return (
    <section className="bg-primary grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className=" px-24 h-auto py-8">
          <h4 className="text-gray-200 mb-5 text-xl uppercase">
            Vous avez un projet qui mérite de voir le jour ?
          </h4>
          <h2 className="text-gray-50 font-bold text-5xl">
            Participez à{" "}
            <span className="text-secondary">Project Awards 2025</span> et
            faites découvrir votre idée au grand public !
          </h2>
          <p className="text-gray-100 my-10 text-lg">
            Déposez votre idée gratuitement, partagez votre lien de vote,
            mobilisez votre communauté… Et laissez votre projet briller ! Chaque
            vote ne coûte que 100 F — un petit geste qui peut vous mener loin.
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 text-center">
            <ColoredLink text="Soumettre mon projet" url="/submit" />

            <WhiteOutlineLink text="Découvrir les projets" url="/projects" />
          </div>
        </div>
      </div>
      <div>
        <Image
          src={HeroImg}
          alt="Hero section image"
          className="object-cover"
        />
      </div>
    </section>
  );
}
