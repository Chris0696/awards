import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AffiliateInfo } from "@/app/common/types/affiliate";
interface Props {
  affiliates: AffiliateInfo[];
}
export default function AffiliateTable({ affiliates }: Props) {
  return (
    <div className="bg-gray-50 px-4 py-8 rounded-xl overflow-x-auto w-screen md:w-full">
      <table className=" w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom & prénoms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Téléphone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liens d'affiliation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidats inscrit via le lien
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant gagné
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {affiliates?.map((affiliate, idx) => (
            <tr
              key={idx}
              className="hover:bg-white hover:rounded-full transition-colors"
            >
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.full_name}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.user_email}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate.phone ? affiliate.phone : "-"}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.affiliate_link?.slice(0, 4)}
                ...
                {affiliate?.affiliate_link?.slice(-5)}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.total_projects}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                {affiliate?.total_revenue}
              </td>
              <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                <button className="cursor-pointer">
                  <MoreVerticalIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
