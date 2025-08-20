import Button from "./Button";

export default function HowItWorksHeroSection() {
  return (
    <section className="py-40 bg-primary flex justify-center text-center">
      <div className="w-[790px]">
        <h2 className="font-bold text-white text-4xl">
          Comprenez en quelques étapes simples comment Project Awards fonctionne
        </h2>
        <div className="text-gray-100 px-6 mt-4 mb-9 ">
          <p className="w-3/4 mx-auto">
            Vous avez une idée de projet impactant ? Découvrez comment la
            soumettre, la faire connaître et obtenir des votes pour la faire
            financer
          </p>
        </div>
        <div className="flex justify-center flex-col items-center">
          <Button variant="filled">Soumettre mon projet maintenant</Button>
        </div>
      </div>
    </section>
  );
}
