"use client";
import Link from "next/link";
import EmailField from "./EmailField";
import FileInputField from "./FileInputField";
import FormCard from "./FormCard";
import NumberField from "./NumberField";
import PasswordField from "./PasswordField";
import PhoneNumberField from "./PhoneNumberField";
import SelectField from "./SelectField";
import TextareaField from "./TextareaField";
import TextField from "./TextField";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function SubmitProjectFormContainer() {
  const [step, setStep] = useState(1);
  return (
    <section className="pb-40 pt-28" id="submit-form">
      {step === 1 && (
        <FormCard step={1}>
          <div className="space-y-6">
            <TextField label="Nom & prénom" />
            <EmailField
              label="Adresse e-mail"
              placeholder="Example@gmail.com"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneNumberField
                label="Numéro de téléphone"
                placeholder="06 12 34 56 78"
              />

              <TextField
                label="Profession ou statut actuel"
                placeholder="Étudiant, entrepreneur, employé, etc"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PasswordField
                label="Mot de passe"
                placeholder="xxxxxxxxxxxxxxxxx"
              />
              <NumberField label="Âge" placeholder="18" />
            </div>
          </div>
          <div className="mt-16">
            <button
              onClick={() => setStep(2)}
              className="bg-secondary px-4 py-2 rounded-md text-white w-full cursor-pointer"
            >
              Soumettre
            </button>
          </div>
        </FormCard>
      )}

      {step === 2 && (
        <FormCard step={2}>
          <div className="space-y-6">
            <TextField
              label="Nom du projet"
              placeholder="Titre clair et accrocheur pour présenter le projet"
            />
            <TextField
              label="Zone géographique d'impact"
              placeholder='Ex: "Cotonou", "Nord du Bénin", "Afrique francophone" '
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField />

              <TextField label="Budget estimé" placeholder="Ex: 1 000 000" />
            </div>
          </div>
          <div className="mt-10">
            <FileInputField />
          </div>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
            >
              <ChevronLeft /> <span>Retourner</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-secondary px-10 w-full md:w-auto  py-2.5 cursor-pointer text-lg rounded-md text-white"
            >
              Continuer
            </button>
          </div>
        </FormCard>
      )}
      {step === 3 && (
        <FormCard step={3}>
          <div className="space-y-6">
            <TextareaField />
            <TextField
              label="Objectif principal"
              placeholder="Quel est le but ultime de ce projet ? (Ex: Réduire le taux d'abandon scolaire)"
            />
            <TextField
              label="Problème que votre projet resout"
              placeholder="Quel problème essayez-vous de résoudre ?"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Public cible"
                placeholder="À qui s'adresse le projet ?"
              />
              <TextField
                label="État d'avancement"
                placeholder="Où en êtes-vous ?"
              />
            </div>
            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row justify-between items-center mt-6">
              <button
                onClick={() => setStep(2)}
                className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
              >
                <ChevronLeft /> <span>Retourner</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white"
              >
                Continuer
              </button>
            </div>
          </div>
        </FormCard>
      )}

      {step === 4 && (
        <FormCard step={4}>
          <div>
            <div className="flex flex-col space-y-10">
              <label
                htmlFor="accept-reformulation"
                className="flex items-center space-x-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="accept-reformulation"
                  id="accept-reformulation"
                  className="w-8 h-8 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition cursor-pointer"
                />{" "}
                <span className="text-gray-900 text-xl font-medium">
                  J'accepte que mon projet soit reformulé par l'équipe Project
                  Awards selon les critères du site.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <label
                htmlFor="accept-terms"
                className="flex items-center space-x-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="accept-terms"
                  id="accept-terms"
                  className="w-7 h-7 rounded-md border border-secondary appearance-none checked:bg-secondary checked:border-secondary checked:ring-2 checked:ring-secondary focus:outline-none transition"
                />
                <span className="text-gray-900 text-xl font-medium">
                  J'ai lu et j'accepte{" "}
                  <Link href={""} className="text-secondary underline">
                    les conditions d'utilisation
                  </Link>
                </span>
                <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-0 justify-between items-center mt-20">
              <button
                onClick={() => setStep(3)}
                className="border w-full md:w-auto border-gray-800 px-8 py-2 cursor-pointer text-lg rounded-md text-gray-800 flex items-center space-x-2 "
              >
                <ChevronLeft /> <span>Retourner</span>
              </button>
              <button className="bg-secondary w-full md:w-auto px-10  py-2.5 cursor-pointer text-lg rounded-md text-white">
                Continuer
              </button>
            </div>
          </div>
        </FormCard>
      )}
    </section>
  );
}
