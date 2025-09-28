import { getUserInfo } from "@/services/userService";
import { useUserSessionStore } from "@/stores/useUserSessionStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

export default function AdditionalUserInfo({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserSessionStore((state) => state.user);

  const { data } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfo(Number(user?.user_id)),
    enabled: !!user,
  });
  useEffect(() => {
    if (data) {
      useUserSessionStore.getState().setAdditionalInfo?.(data);
    }
  }, [data]);

  return <div>{children}</div>;
}
