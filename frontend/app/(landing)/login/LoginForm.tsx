import EmailField from "@/app/(landing)/submit/forms/EmailField";
import PasswordField from "@/app/(landing)/submit/forms/PasswordField";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  return (
    <form className="w-full max-w-3xl mx-auto bg-white space-y-4 ">
      <div className="flex justify-center flex-col items-center">
        <h2 className="text-4xl font-bold">Bienvenu!</h2>
        <p>Connectez vous à votre espace</p>
      </div>
      <div className="space-y-4">
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
    </form>
  );
}
