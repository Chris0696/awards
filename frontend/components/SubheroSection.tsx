import SubheroCard from "./SubheroCard";

export type Infos = {
  title: string;
  text: string;
  icon: string;
};

const infos: Infos[] = [
  {
    title: "Reformulation professionnelle",
    text: "Votre idée est relu et structurée par notre équipe avant publication",
    icon: "./LightbulbFilament.svg",
  },
  {
    title: "Accompagnement stratégique",
    text: "Les projets les plus votés reçoivent un suivi personnalisé",
    icon: "./Lifebuoy.svg",
  },
  {
    title: "Visibilité forte",
    text: "Votre projet est mise en avant auprès de notre communauté active et engagée",
    icon: "./Broadcast.svg",
  },
  {
    title: "Financement direct",
    text: "Les meilleurs projets bénéficient d'un financement ou d'un appui au financement",
    icon: "./Coins.svg",
  },
];

export default function SubheroSection() {
  return (
    <section className="py-16 flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
        {infos.map((info, idx) => (
          <SubheroCard
            key={idx}
            title={info.title}
            text={info.text}
            icon={info.icon}
          />
        ))}
      </div>
    </section>
  );
}
