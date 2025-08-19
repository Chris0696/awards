import { ArrowRight } from "lucide-react";

type StepProps = {
  id: number;
  title: string;
  desc: string;
};

const steps: StepProps[] = [
  {
    id: 1,
    title: "Porteur du projet",
    desc: "Nous aimons savoir qui se cache derrière chaque idée. Présentez-vous en quelques mots",
  },
  {
    id: 2,
    title: "Présenter votre projet",
    desc: "Un bon projet commence par une idée bien expliquée. Aidez nous à comprendre en quoi votre projet mérite d'être soutenu",
  },
  {
    id: 3,
    title: "Décrivez votre idée",
    desc: "Donnez-nous une vision claire et inspirante. Pas besoin de langage technique, juste du coeur et de la clarté!",
  },
  {
    id: 4,
    title: "Derniers détails avant envoi ",
    desc: "Avant de valider, confirmez que vous êtes d'accord avec nos conditions",
  },
];

type Props = {
  step: 1 | 2 | 3 | 4;
  children: React.ReactNode;
};

export default function FormCard({ step = 1, children }: Props) {
  const currentStep = steps.find((s) => s.id === step);
  return (
    <div className="w-full max-w-3xl mx-auto ">
      <div>
        <h2 className="flex  items-center text-4xl font-bold mb-3 space-x-20">
          <span className="flex items-center space-x-1">
            <span className="text-[#0026B0] font-medium">{step}/4</span>
            <ArrowRight size={20} />
          </span>
          <span>{currentStep?.title} </span>
        </h2>
        <p className="text-lg text-gray-600 ml-8">{currentStep?.desc}</p>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
