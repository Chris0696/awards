export type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR");
};

export const dateToMonth = (date: string) => {
  let formatted = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
