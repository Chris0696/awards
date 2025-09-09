import { FieldValues, UseFormSetError } from "react-hook-form";

export function mapServerErrors<T extends FieldValues>(
  err: any,
  setError: UseFormSetError<T>
): string {
  const serverErrors = err.body?.error || err.body?.errors;

  if (serverErrors && typeof serverErrors === "object") {
    let firstMsg: string | undefined;

    Object.entries(serverErrors).forEach(([field, messages]) => {
      const first = Array.isArray(messages) ? messages[0] : String(messages);

      if (!firstMsg) firstMsg = first;
      setError(field as keyof T, { type: "server", message: first });
    });

    return firstMsg ?? "Erreur inconnue.";
  }

  return err.message || "Une erreur est survenue.";
}
