"use client";
import React from "react";
import LoginForm from "../../login/LoginForm";
import Popover from "@/components/ui/Popover";
import { useRouter } from "next/navigation";

export default function LoginInterceptorPage() {
  const router = useRouter();

  return (
    <Popover
      title="Je vote"
      visible={true}
      onClose={() => router.back()}
      isLogin
    >
      <div className="p-14">
        <LoginForm />
      </div>
    </Popover>
  );
}
