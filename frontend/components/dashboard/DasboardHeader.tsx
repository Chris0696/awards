import RingBellIcon from "@/assets/ringbell.svg";
import SearchIcon from "@/assets/searchicon.svg";
import Image from "next/image";

export default function DashboardHeader({ pageTitle }: { pageTitle: string }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{pageTitle} </h2>
        <div className="flex items-center space-x-6">
          <div className="p-3 rounded-full bg-gray-100">
            <Image src={RingBellIcon} alt="Notifications" />
          </div>
          <div className="flex items-center bg-gray-100 rounded-md relative h-10">
            <Image
              src={SearchIcon}
              alt="Search"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 "
            />
            <input
              type="text"
              name="search"
              placeholder="Rechercher"
              id="search"
              className="pl-10 pr-2 py-1 placeholder:text-black rounded-md h-full w-full outline-none border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
