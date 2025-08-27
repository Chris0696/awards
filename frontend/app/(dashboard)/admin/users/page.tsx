import DashboardHeader from "@/components/dashboard/DasboardHeader";
import FilterBtn from "@/components/dashboard/FilterBtn";
import Table from "@/components/dashboard/Table";
import SwitchPageBtn from "@/components/SwitchPageBtn";

export default function page() {
  return (
    <div className="overflow-x-hidden">
      <DashboardHeader pageTitle="Utilisateurs inscrits" />
      <div className=" flex justify-end space-x-3  mb-5">
        <FilterBtn text="Date" />
        <FilterBtn text="Statut" />
      </div>
      <div>
        <Table />
      </div>
      <SwitchPageBtn />
    </div>
  );
}
