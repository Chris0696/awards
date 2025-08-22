import Link from "next/link";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import Popover from "./Popover";
import { ChevronRightIcon } from "lucide-react";

type LoginModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

export default function LoginModal({
  showModal,
  setShowModal,
}: LoginModalProps) {
  return (
    <Popover
      title="Je vote"
      visible={showModal}
      onClose={() => setShowModal(false)}
      isLogin
    >
      <div className="w-4/5 mx-auto mt-10 mb-20 space-y-4">
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
            onClick={() => setShowModal(false)}
            className="flex items-center justify-center space-x-2 bg-secondary text-white px-4 py-4 text-lg rounded-md w-full cursor-pointer"
          >
            <span>Se connecter</span>
            <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </Popover>
  );
}
