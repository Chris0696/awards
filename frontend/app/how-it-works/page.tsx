import HowItWorksHeroSection from "@/components/HowItWorksHeroSection";
import Hiw1Img from "@/assets/hiw1.png";
import Hiw2Img from "@/assets/hiw2.png";
import Hiw3Img from "@/assets/hiw3.png";
import Hiw4Img from "@/assets/hiw4.png";
import Image from "next/image";
import FaqSection from "@/components/FaqSection";

export default function page() {
  return (
    <section>
      <HowItWorksHeroSection />
      <div className="mt-20 mb-40 md:w-4/6 mx-auto">
        <h2 className="text-4xl font-bold mb-24 text-center">
          Un process <span className="text-secondary">rapide</span> et{" "}
          <span className="text-secondary">simple</span>
        </h2>
        <div className="relative w-full">
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-700"></div>

          <div className="flex justify-between items-center w-full relative">
            <div className="flex flex-col items-center">
              <div className="mr-auto w-16 h-16 rounded-full bg-white flex items-center justify-center z-10">
                <div className="w-1/2 h-1/2 rounded-full border border-orange-500 flex items-center justify-center">
                  <span className="block bg-orange-500 w-4 h-4 rounded-full"></span>
                </div>
              </div>
<<<<<<< HEAD
              <p className="pt-3 text-center">Soumission </p>
            </div>

            <div className="hidden md:flex flex-col items-center">
=======
              <p className="pt-3 text-center">Soumettre votre projet</p>
            </div>

            <div className="flex flex-col items-center">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center z-10">
                <div className="w-1/2 h-1/2 rounded-full border border-orange-500 flex items-center justify-center">
                  <span className="block bg-orange-500 w-4 h-4 rounded-full"></span>
                </div>
              </div>
              <p className="pt-3 text-center">Mise en ligne</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center z-10">
                <div className="w-1/2 h-1/2 rounded-full border border-orange-500 flex items-center justify-center">
                  <span className="block bg-orange-500 w-4 h-4 rounded-full"></span>
                </div>
              </div>
              <p className="pt-3 text-center">Votes</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center z-10">
                <div className="w-1/2 h-1/2 rounded-full border border-orange-500 flex items-center justify-center">
                  <span className="block bg-orange-500 w-4 h-4 rounded-full"></span>
                </div>
              </div>
              <p className="pt-3 text-center">Financement</p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-48 space-y-12 px-10 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
            <div>
              <Image src={Hiw1Img} alt="Étape 1" />
            </div>
            <div className="  ">
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                1. Soumettez votre projet
              </h3>
              <p className="md:w-96">
=======
        <div className="mt-48 space-y-12">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Image src={Hiw1Img} alt="Étape 1" />
            </div>
            <div>
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                1. Soumettez votre projet
              </h3>
              <p className="w-96">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
                Vous avez un projet qui mérite d’être soutenu ? Dites-nous tout
                ! Sur Project Awards, vous pouvez partager votre idée même si
                elle n’est pas encore parfaitement rédigée. Notre équipe
                éditoriale vous accompagne pour reformuler votre projet de
                manière professionnelle, claire et percutante.
              </p>
              <h4 className="mt-5 font-medium text-lg">
                Ce que vous devez faire :
              </h4>
<<<<<<< HEAD
              <ul className="list-disc pl-8 md:w-96">
=======
              <ul className="list-disc pl-8 w-96">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
                <li>
                  Remplir le formulaire de soumission (titre, description,
                  objectifs, impact...)
                </li>
                <li>Ajouter des visuels si possible</li>
                <li>Indiquer votre contact (mail, WhatsApp...)</li>
              </ul>
            </div>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
            <div className="md:w-[420px] ">
=======
          <div className="grid grid-cols-2 gap-4">
            <div className="w-[420px]">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                2. Mise en ligne
              </h3>
              <p className="mb-5">
                Une fois validé par notre équipe, votre projet est mis en ligne
                sur notre plateforme dans la section “Projets en vote”. Il
                devient alors visible par tous les visiteurs, qui peuvent
                interagir avec votre idée.
              </p>
              <p>
                {" "}
                Le projet est présenté avec un design épuré et dynamique :
                description, image, zone d’impact, objectifs, et bouton de vote.
              </p>
            </div>
            <div>
              <Image src={Hiw2Img} alt="Étape 2" />
            </div>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
=======
          <div className="grid grid-cols-2 gap-4 pt-32">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
            <div>
              <Image src={Hiw3Img} alt="Étape 3" />
            </div>
            <div className="">
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                3. Votes
              </h3>
<<<<<<< HEAD
              <div className="space-y-5  md:w-[420px] ">
=======
              <div className="space-y-5 w-[420px] ">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
                <p>
                  Une fois en ligne, votre projet entre en compétition avec
                  d’autres idées. Ce sont les utilisateurs qui votent pour leurs
                  coups de cœur.
                </p>
                <p>
                  Les votes sont payants (100 FCFA par vote), afin de garantir
                  un soutien réel et de limiter les fraudes.Chaque vote compte :
                  plus vous obtenez de votes, plus vous augmentez vos chances
                  d’être financé.
                </p>
                <div>
                  <h4>Les visiteurs peuvent également :</h4>
                  <ul className="list-disc pl-8">
                    <li>Voter pour votre projet</li>
                    <li>Partager votre projet sur leurs réseaux sociaux</li>
                  </ul>
                </div>
                <p>
                  {" "}
                  Astuce : Partagez votre lien personnel de projet au maximum
                  pour mobiliser votre réseau !
                </p>
              </div>
            </div>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
            <div className="">
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                4. Financement
              </h3>
              <div className="space-y-5 md:w-96">
=======
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-[#134F9D] font-bold text-xl mb-5">
                4. Financement
              </h3>
              <div className="space-y-5 w-96">
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
                <p>
                  {" "}
                  À la fin d’une période de vote, les projets qui ont récolté le
                  plus de soutien sont sélectionnés pour être accompagnés,
                  financés et suivis dans leur mise en œuvre.
                </p>
                <p>
                  {" "}
                  Nous contactons les porteurs de projet gagnants pour établir
                  ensemble les prochaines étapes
                </p>
              </div>
            </div>
            <div>
              <Image src={Hiw4Img} alt="Étape 4" />
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD
      <FaqSection title="Questions fréquentes" />
=======
      <FaqSection />
>>>>>>> 9655832 (HowItWorks page set up but not responsive yet)
    </section>
  );
}
