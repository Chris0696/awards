import Image from "next/image";

import CheckIcon from "@/assets/check.svg";
import ShootingStarIcon from "@/assets/shootstar.svg";
import ShareNetworkIcon from "@/assets/sharenetwork.svg";
import Popover from "../ui/Popover";
import ColoredLink from "../ui/ColoredLink";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  title: string;
  showBtn?: boolean;
};

export default function ThanksNoteModal({
  showModal,
  setShowModal,
  title,
  showBtn,
}: Props) {
  return (
    <Popover
      title={title}
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="w-4/5 mx-auto mt-10 mb-20  text-center">
        <div className="px-6 pt-8">
          <Image src={CheckIcon} alt="Check icon" className="mx-auto" />
          <h2 className="text-2xl font-bold mt-8 mb-3">
            Merci pour votre soumission !
          </h2>
          <p className="text-lg leading-6">
            Notre équipe vous contactera sous 48h. Votre projet sera reformulé,
            validé, puis publié pour le vote. Vous serez notifié dès sa mise en
            ligne.
            {/*  Connectez-vous à votre compte pour publier votre projet afin de
            finaliser la soumission */}
          </p>
          {/*  <p className="mt-8">
            <ColoredLink url="/login" text="Connectez-vous" />
          </p> */}
          {showBtn && (
            <div className="flex justify-center space-x-3 mt-8">
              <button className="flex items-center space-x-2 border border-secondary px-4 cursor-pointer py-1 rounded-md text-secondary font-medium ">
                <Image
                  src={ShootingStarIcon}
                  alt="Shoot star icon"
                  className="w-3 h-3"
                />
                <span>Voter encore</span>
              </button>
              <button className="flex items-center space-x-2 border border-secondary px-4 cursor-pointer py-1 rounded-md text-secondary font-medium ">
                <Image
                  src={ShareNetworkIcon}
                  alt="Share icon"
                  className="w-3 h-3"
                />
                <span>Partager</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Popover>
  );
}
