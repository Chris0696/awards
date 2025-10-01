"use client";

import { useUserSessionStore } from "@/stores/useUserSessionStore";

import CommercialHome from "./CommercialHome";
import OwnerHome from "./OwnerHome";
import AdminHome from "./AdminHome";

export default function AdminPage() {
  const user = useUserSessionStore((state) => state.user);

  return (
    <>
      {user?.user_type === "owner" && <OwnerHome />}

      {user?.user_type === "user" && <AdminHome />}

      {user?.user_type === "commercial" && <CommercialHome />}
    </>
  );
}
