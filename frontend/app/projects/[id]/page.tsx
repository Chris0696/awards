import { ArrowRight, ChevronRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import ProfilImg from "@/assets/profil.png";
import ShareLinkIcon from "@/assets/shareIcon.svg";
import CopyLinkIcon from "@/assets/linkIcon.svg";
import ProjectImg from "@/assets/artworklight.jpg";
import Link from "next/link";

export default function page() {
  return (
    <section className="pb-72">
      <div className="bg-primary text-white relative pb-56">
        <div className="flex justify-center pt-16 pb-10">
          <p className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-3 text-gray-100">
            <span className="flex flex-col  md:flex-row items-center space-x-2">
              <span>Découvrir les projets</span>
              <ArrowRight className="hidden md:block" size={16} />
              <ArrowDown className="md:hidden" size={16} />
            </span>
            <span className="flex flex-col  md:flex-row items-center space-x-2">
              <span>Éducation & Formation</span>
              <ArrowRight className="hidden md:block" size={16} />
              <ArrowDown className="md:hidden" size={16} />
            </span>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis
              itaque
            </span>
          </p>
        </div>
        <div className="w-[80%] md:w-2/5 mx-auto ">
          <div>
            <h2 className="text-5xl font-bold">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis
              itaque impedit molestiae, tenetur harum
            </h2>
            <div className="flex items-center justify-between my-7">
              <div className="flex items-center space-x-1">
                <Image
                  src={ProfilImg}
                  alt="Profil"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-100">Mireille Assaba</span>
              </div>
              <p className="text-gray-400">14 Janvier 2025</p>
              <div>
                <p className="px-6 py-3 rounded-full bg-white text-primary">
                  1500 votes
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-200">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, qui
            harum id eos earum eaque quibusdam, corrupti pariatur, ipsam nobis
            laudantium voluptatem. Fugit placeat consequatur in suscipit nostrum
            nesciunt reprehenderit magni culpa, quibusdam tempore, consequuntur
            debitis repellendus minus itaque ipsa incidunt odio ex sunt maiores
            vitae fuga! Maiores dolorem amet eveniet iusto praesentium ipsa
            iste. Explicabo asperiores ratione ipsum tenetur.
          </p>
          <div className="flex items-center space-x-4 mt-8">
            <button className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-secondary transition-colors cursor-pointer">
              Voter pour ce projet-100 FCFA
            </button>
            <button className="flex items-center border border-white px-6 py-2 rounded-md space-x-2 hover:bg-white hover:text-primary transition-colors cursor-pointer">
              <Image src={ShareLinkIcon} alt="Partager" className="w-4 h-4" />
              <span>Partager</span>
            </button>
            <button className="flex items-center border border-white px-6 py-2 rounded-md space-x-2 hover:bg-white hover:text-primary transition-colors cursor-pointer">
              <Image src={CopyLinkIcon} alt="Copier" className="w-4 h-4" />
              <span>Copier</span>
            </button>
          </div>
        </div>

        <Image
          src={ProjectImg}
          alt="Projet"
          className="w-[75%] h-[350px] object-cover mx-auto rounded-lg absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2"
        />
      </div>

      <div className="grid grid-cols-5 mt-72 w-3/4 mx-auto">
        <div className="col-span-5 md:col-span-4 space-y-16 md:pr-28 mb-20 md:mb-0">
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Qui est à l'origine du projet ?
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Perspiciatis mollitia natus recusandae assumenda dignissimos
              itaque quae unde praesentium laborum hic deserunt ducimus possimus
              nesciunt, similique atque odio fuga debitis animi distinctio
              doloremque iste officiis. Repudiandae, dignissimos. Recusandae nam
              voluptatibus nobis dolor quos quo illo iusto debitis fugiat earum,
              quam vero?
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Quel est l'objectif du projet ?
            </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              accusantium quia vero a magnam vitae numquam quaerat, officia
              velit corporis sit expedita reiciendis corrupti, obcaecati,
              molestias asperiores quisquam! Neque deleniti inventore aperiam
              vitae molestias rerum faire earum souvent commodi quo natus, ad
              ipsum rem vel, assumenda cupiditate, exercitationem maiores quos
              modi. Vitae, maxime accusamus natus culpa blanditiis asperiores
              optio inventore impedit doloremque tempora dolores quasi.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Comment le projet sera t-il mise en oeuvre
            </h3>
            <ul className="list-disc pl-8">
              <li>Étape 1 : Analyse des besoins</li>
              <li>Étape 2 : Conception de la solution</li>
              <li>Étape 3 : Développement et tests</li>
              <li>Étape 4 : Déploiement et suivi</li>
            </ul>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Budget estimatif
            </h3>
            <p>100000000 FCFA</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Pourquoi voter pour ce projet ?
            </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore,
              dolores aspernatur debitis eum culpa tempora impedit repudiandae
              officiis consequuntur esse!
            </p>
          </div>
        </div>
        <div className="col-span-5 md:col-span-1 bg-gray-50 py-14 px-6 rounded-lg h-max space-y-20">
          <div className="space-y-4">
            <h4 className="text-2xl font-semibold text-gray-700">
              Soutenez ce projet en votant dès maintenant
            </h4>
            <p className="text-gray-700">
              Chaque vote compte, chaque geste rapproche le projet de la réalité
            </p>
            <button className="border bg-gray-50 text-secondary border-secondary px-5 py-2 rounded-md cursor-pointer hover:bg-secondary hover:text-gray-100 transition-colors">
              Je vote pour ce projet
            </button>
          </div>
          <div className="">
            <h4 className="text-2xl font-semibold text-gray-700">
              Vous avez aussi une idée de projet ?
            </h4>
            <p className="text-gray-700 mt-2 mb-10">
              Déposez-la en quelques clics
            </p>
            <Link
              href={""}
              className="text-secondary text-lg hover:text-primary transition-colors"
            >
              <span>Soumettre mon projet</span>
              <ChevronRight className="inline-block ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
