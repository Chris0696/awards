import { ArrowRight, ChevronRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import ProfilImg from "@/assets/profil.png";
import ShareLinkIcon from "@/assets/shareIcon.svg";
import CopyLinkIcon from "@/assets/linkIcon.svg";
import ProjectImg from "@/assets/artworklight.jpg";
import Link from "next/link";

import { dateToMonth, formatDate } from "@/app/common/types/common";
import { fixBackendUrl } from "@/frontendlib/utils/fixBackendUrls";
import CallToVoteAction from "./CallToVoteAction";
import CallToAction2 from "./CallToAction2";
import CopyBtn from "./CopyBtn";

export interface Project {
  project_id: string;
  slug: string;
  project_title: string;
  description: string;
  local_area_impact: string;
  main_objective: string;
  solution: string;
  estimated_budget: string;
  target_audience: string;
  progress_report: string;
  featured: boolean;
  created_at: string;
  validated_at: string;
  owner_name: string;
  owner_image: string;
  image: string | null;
  image_url: string | null;
  file: string | null;
  average_rating: number;
  total_votes: number;
  vote_count: number;
  total_revenue: number;
}

export default async function age({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = isProd ? process.env.PROD_API_URL : process.env.API_URL;
  const response = await fetch(`${baseUrl}public/projects/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossible de charger le projet");
  }
  const project: Project = await response.json();

  return (
    <section className="pb-72">
      <div className="bg-primary text-white relative pb-56">
        <div className="flex justify-center pt-16 pb-10">
          <p className="flex  flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-3 text-gray-100">
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
            <span className="block max-w-72 mx-auto">
              {project.project_title}
            </span>
          </p>
        </div>
        <div className="w-[80%] md:w-2/5 mx-auto ">
          <div>
            <h2 className="text-5xl font-bold">{project.project_title}</h2>
            <div className="flex  items-center justify-between my-7">
              <div className="flex items-center space-x-1">
                {project.image && (
                  <Image
                    src={fixBackendUrl(project.owner_image) ?? ProfilImg}
                    alt="Profil"
                    width={4}
                    height={4}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span className="text-gray-100">{project.owner_name} </span>
              </div>
              <p className="text-gray-400">
                {dateToMonth(project.created_at)}{" "}
              </p>
              <div>
                <p className="px-2 text-center md:px-6 md:py-3 rounded-full bg-white text-primary">
                  {project.vote_count} votes
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-200">{project.description}</p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center space-x-4 mt-8">
            <CallToAction2 project={project} />
            <Link
              href={"/https://web.whatsapp.com/"}
              className="flex items-center border border-white px-6 py-2 rounded-md space-x-2 hover:bg-white hover:text-primary transition-colors cursor-pointer"
            >
              <Image
                src={ShareLinkIcon}
                alt="Partager"
                width={4}
                height={4}
                className="w-4 h-4"
              />
              <span>Partager</span>
            </Link>
            <CopyBtn />
          </div>
        </div>

        {project.image && (
          <Image
            src={fixBackendUrl(project.image) ?? ProjectImg}
            width={25}
            height={25}
            alt="Projet"
            className="w-[85%] md:w-[75%] md:h-[350px] object-cover mx-auto rounded-lg absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2"
          />
        )}
      </div>

      <div className="grid grid-cols-5 mt-40 md:mt-72 w-3/4 mx-auto">
        <div className="col-span-5 md:col-span-4 space-y-16 md:pr-28 mb-20 md:mb-0">
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Qui est à l'origine du projet ?
            </h3>
            <p>{project.owner_name}</p>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Quel est l'objectif du projet ?
            </h3>
            <p>{project.main_objective}</p>
          </div>
          {/*  <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Comment le projet sera t-il mise en oeuvre
            </h3>
            <ul className="list-disc pl-8">
              <li>Étape 1 : Analyse des besoins</li>
              <li>Étape 2 : Conception de la solution</li>
              <li>Étape 3 : Développement et tests</li>
              <li>Étape 4 : Déploiement et suivi</li>
            </ul>
          </div> */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Budget estimatif
            </h3>
            <p>{project.estimated_budget} FCFA</p>
          </div>
          {/* <div>
            <h3 className="text-3xl font-semibold text-gray-700 mb-6">
              Pourquoi voter pour ce projet ?
            </h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore,
              dolores aspernatur debitis eum culpa tempora impedit repudiandae
              officiis consequuntur esse!
            </p>
          </div> */}
        </div>
        <div className="col-span-5 md:col-span-1 bg-gray-50 md:py-14 px-6 rounded-lg h-max space-y-20">
          <div className="space-y-4">
            <h4 className="text-2xl font-semibold text-gray-700">
              Soutenez ce projet en votant dès maintenant
            </h4>
            <p className="text-gray-700">
              Chaque vote compte, chaque geste rapproche le projet de la réalité
            </p>
            <CallToVoteAction project={project} />
          </div>
          <div className="">
            <h4 className="text-2xl font-semibold text-gray-700">
              Vous avez aussi une idée de projet ?
            </h4>
            <p className="text-gray-700 mt-2 mb-10">
              Déposez-la en quelques clics
            </p>
            <Link
              href={"/submit"}
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
