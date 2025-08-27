import Image from "next/image";
import Button from "./Button";
import HanddownIcon from "@/assets/handdown.svg";
import ColoredLink from "./ColoredLink";

export default function SubmitHeroSection() {
  return (
    <section className="py-40 bg-primary flex justify-center text-center">
      <div className="w-xl">
        <h2 className="font-bold text-white text-4xl">
          Soumettez votre projet et donner vie à vos idées
        </h2>
        <div className="text-gray-100 px-6 mt-4 mb-9">
          <p>
            Vous avez une idée qui mérite d'être connue, soutenue, votée ou
            financée ?
          </p>
          <p>
            Remplissez ce formulaire, nous nous chargerons de reformuler et
            structurer votre projet avant sa mise en ligne
          </p>
        </div>
        <div className="flex justify-center flex-col items-center">
          <ColoredLink
            text="Soumettre mon projet maintenant"
            url="#submit-form"
          />
          <Image src={HanddownIcon} alt="Handown Icon" className="mt-1.5" />
        </div>
      </div>
    </section>
  );
}
