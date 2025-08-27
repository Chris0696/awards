import Image from "next/image";
import Button from "./Button";
import CurveImg from "@/assets/howitworkscurve.png";
import ColoredOutlineLink from "./ColoredOutlineLink";

export default function HowItWorksSection() {
  return (
    <section className="flex justify-center h-[700px] ">
      <div className="w-5/6">
        <h2 className="text-primary font-bold text-4xl">Comment ça marche ?</h2>
        <div className="mt-10 relative">
          <div className="space-y-9 md:w-sm">
            <p className="text-[1.7rem] text-gray-600 leading-9 ">
              En trois étapes simples, passez de l'idée à la réalisation. Vous
              êtes prêts? Donnez vie à votre projet maintenant.
            </p>
            <ColoredOutlineLink url="/submit" text="Soumettre mon projet" />
          </div>
          <div className="md:relative  w-full">
            <div className="hidden w-full md:flex md:absolute left-2/5 -translate-x-1/2 -translate-y-1/2 -z-40">
              <Image
                src={CurveImg}
                alt="selection process curve img"
                className="mx-auto"
              />
            </div>
            <div className="md:absolute left-32 w-md -bottom-96">
              <div className="relative">
                <div>
                  <h2 className="text-primary font-medium text-lg">
                    Soumettez votre idée
                  </h2>
                  <p className="text-gray-600 text-sm w-4/6 mt-2">
                    Vous avez une idée de projet ? Rédigez-la rapidement via
                    notre formulaire. Notre équipe éditoriale la reformule
                    ensuite selon les standards professionnels: objectifs,
                    impact, faisabilité, etc.
                  </p>
                </div>
                <h3 className="text-slate-200 text-[11rem] font-bold  absolute -top-24 -z-40 right-40">
                  1
                </h3>
              </div>
            </div>
            <div className="w-md md:absolute top-5 left-3/8  ">
              <div className="relative">
                <div>
                  <h2 className="text-primary font-medium text-lg">
                    La communauté vote
                  </h2>
                  <p className="text-gray-600 text-sm w-4/7 mt-2">
                    Une fois votre projet publié, il devient visible par toute
                    la communauté Project Awards. C'est là que la magie opère:
                    les utilisateurs découvrent, lisent, réagissent et surtout
                    votent pour les idées qui les inspire le plus.
                  </p>
                </div>
                <h3 className="text-slate-200 text-[11rem] font-bold absolute -top-24 -z-40 right-40">
                  2
                </h3>
              </div>
            </div>
            <div className="w-md md:absolute xl:-top-40 xl:right-16">
              <div className="relative">
                <div>
                  <h2 className="text-primary font-medium text-lg">
                    Recevez du financement
                  </h2>
                  <p className="text-gray-600 text-sm w-[58%] mt-2 leading-5">
                    À la fin de chaque cycle de vote, les projets qui ont
                    recueilli le plus de soutiens sont sélectionnés et
                    bénéficient d'un accompagnement. Cela peut se traduire par
                    un financement direct, un appui technique ou encore une mise
                    en relation avec des partenaires.
                  </p>
                </div>
                <h3 className="text-slate-200 text-[11rem] font-bold absolute -top-24 -z-40 right-40">
                  3
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
