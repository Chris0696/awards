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
  const userId = user?.user_id;
  const hasValidUserId =
    userId != null && !Number.isNaN(Number(userId)) && Number(userId) > 0;

  const { data } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(Number(userId)),
    enabled: !!user && hasValidUserId,
  });
  useEffect(() => {
    if (data) {
      useUserSessionStore.getState().setAdditionalInfo?.(data);
    }
  }, [data]);

  return <div>{children}</div>;
}
