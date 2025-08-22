import ProfilImg from "@/assets/profil.png";
import Image from "next/image";

export default function page() {
  return (
    <div className="space-y-16">
      <h2 className="text-2xl font-bold">Gérer mon compte</h2>
      <div className="bg-gray-500/5 w-full max-w-xl p-7 rounded-md">
        <h3 className="text-xl text-gray-800 font-semibold">
          Informations personnelles
        </h3>
        <div className="mt-10">
          <div className="flex items-center space-x-3">
            <Image
              src={ProfilImg}
              alt="Photo de profil"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h4 className="text-xl text-gray-800">Mireille Assaba</h4>
              <label htmlFor="profil " className="underline">
                <input
                  type="file"
                  name="profil"
                  id="profil"
                  className="hidden"
                />{" "}
                <span>Modifier l'image</span>
              </label>
            </div>
          </div>
          <div className="space-y-6 mt-6">
            <div>
              <label htmlFor="fullname" className="text-gray-700 text-sm block">
                Nom & prénom
              </label>
              <input
                type="text"
                id="fullname"
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700 text-sm block">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div>
              <label htmlFor="tel" className="text-gray-700 text-sm block">
                Téléphone / Whatsapp
              </label>
              <input
                type="tel"
                id="tel"
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div>
              <label
                htmlFor="profession"
                className="text-gray-700 text-sm block"
              >
                Profession ou statut actuel
              </label>
              <input
                type="text"
                id="profession"
                className="border-2 border-gray-300 rounded-lg p-2 w-full "
              />
            </div>
            <div className="flex space-x-3">
              <button className=" border border-primary px-2 py-2 cursor-pointer text-primary rounded-md">
                Mettre à jour mes informations
              </button>
              <button className="bg-primary text-white px-2 py-2 cursor-pointer rounded-md">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
