import EmailField from "@/components/EmailField";
import PasswordField from "@/components/PasswordField";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function page() {
  return (
    <div className="pt-40 pb-72">
      {/* <div className="w-full max-w-3xl mx-auto bg-white space-y-4 ">
        <div className="flex justify-center flex-col items-center">
          <h2 className="text-4xl font-bold">Bienvenu!</h2>
          <p>Connectez vous à votre espace</p>
        </div>
        <div className="space-y-2">
          <EmailField label="Adresse email" placeholder="Email" />
          <div>
            <PasswordField label="Mot de passe" placeholder="Mot de passe" />
            <Link href={""} className="text-secondary">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <Link
            href={"/admin"}
            className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-4 text-lg rounded-md w-full cursor-pointer"
          >
            <span>Se connecter</span>
            <ChevronRightIcon />
          </Link>
        </div>
      </div> */}
      <LoginForm />
    </div>
  );
}
