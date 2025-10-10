import Image from "next/image";
import Popover from "../Popover";
import MaterialIcon from "@/assets/materials.svg";
import Link from "next/link";

type Props = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

export default function VoteAnnouncementModal({
  showModal,
  setShowModal,
}: Props) {
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
          Du <span className="font-bold">1er Décembre 2025</span> au{" "}
          <span className="font-bold">31 Janvier 2026</span>, les votes sont
          ouverts ! Vous pouvez voter autant de fois que vous le souhaitez pour
          soutenir vos projets favoris. <br /> Plus un projet récolte de votes,
          plus il a de chances de remporter
        </p>
        <div className="pt-2">
          <Link
            href={"/projects"}
            onClick={() => setShowModal(false)}
            className=" bg-secondary text-white px-6 py-3 rounded-md transition-colors"
          >
            Découvrir les projet
          </Link>
        </div>
      </div>
    </Popover>
  );
}
