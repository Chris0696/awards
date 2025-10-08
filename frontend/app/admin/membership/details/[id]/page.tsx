"use client";

import { getAffiliateDetails } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function page() {
  const { id } = useParams();
  console.log(id, "id");
  const { data: affiliates } = useQuery({
    queryKey: ["affiliateDetails", id],
    queryFn: () => getAffiliateDetails(Number(id)),
    enabled: id !== undefined,
  });

  const currentItem = affiliates.data.find((affilite) => affilite.id === id);

  return <div>page</div>;
}
