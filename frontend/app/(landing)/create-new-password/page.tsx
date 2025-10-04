import React, { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
