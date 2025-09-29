import axios, { AxiosError } from "axios";

export type BackendError = {
  error: string[];
};

export function extractBackendErrors(err: unknown): string {
  if (axios.isAxiosError<BackendError>(err)) {
    const backendErrors = err.response?.data?.error;

    if (backendErrors && backendErrors.length > 0) {
      return backendErrors.join("\n");
    }
    return err.message ?? "Une erreur est survenue";
  }
  if (err instanceof Error) {
    return err.message;
  }

  return "Une erreur inconnue est survenue";
}
