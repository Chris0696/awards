import Image from "next/image";
import Popover from "./ui/Popover";
import Link from "next/link";
import MaterialIcon from "@/assets/materials.svg";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

export default function WelcomeModal({ showModal, setShowModal }: Props) {
  return (
    <Popover
      title="Ouverture des votes – Project Awards 2025 !"
      visible={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="w-4/5 mx-auto mt-10 mb-20  text-center">
        <Image
          src={MaterialIcon}
          alt="Material Icon"
          className="mx-auto w-8 h-8"
        />
        <p className="text-xl my-8">
          Du <span className="font-bold">1er septembre</span> au{" "}
          <span className="font-bold">30 novembre 2025</span>, les votes sont
          ouverts ! Vous pouvez{" "}
          <span className="font-bold">
            voter autant de fois que vous le souhaitez
          </span>
          &nbsp; pour soutenir vos projets favoris. Plus un projet récolte de
          votes, plus il a de chances de remporter
        </p>
        <div className="pt-2">
          <Link
            href={"/submit"}
            onClick={() => setShowModal(false)}
            className="border border-secondary text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-md transition-colors"
          >
            Soumettre mon projet
          </Link>
        </div>
      </div>
    </Popover>
  );
}
