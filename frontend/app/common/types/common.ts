export type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR");
};
