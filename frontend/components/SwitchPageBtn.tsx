import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function SwitchPageBtn() {
  return (
    <div className="flex justify-end mt-10">
      <div className="flex items-center space-x-6 ">
        <button className="bg-primary px-4  py-5 rounded-lg text-gray-50 flex items-center space-x-2  text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors">
          <ChevronLeftIcon />
        </button>
        <button className="text-2xl font-medium">1/5</button>
        <button className="bg-primary px-4  py-5 rounded-lg text-gray-50 flex items-center space-x-2  text-lg cursor-pointer hover:border hover:border-primary hover:bg-white hover:text-primary transition-colors ">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
