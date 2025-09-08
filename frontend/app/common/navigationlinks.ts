export const landingpagelinks = [
  {
    page: "Accueil",
    url: "/",
  },
  {
    page: "Découvrez les projets",
    url: "/projects",
  },
  {
    page: "Soumettre un projet",
    url: "/submit",
  },
  {
    page: "Comment ça marche",
    url: "/how-it-works",
  },
];

export const dashboardlinks = [
  {
    page: "Accueil",
    url: "/admin",
    isRequireAdmin: false,
  },
  {
    page: "Projets",
    url: "/admin/projects",
    isRequireAdmin: false,
  },
  {
    page: "Utilisateurs",
    url: "/admin/users",
    isRequireAdmin: true,
  },
  {
    page: "Votes & statistiques",
    url: "/admin/statistics",
    isRequireAdmin: true,
  },
  {
    page: "Catégories & Tags",
    url: "/admin/categories",
    isRequireAdmin: true,
  },
  {
    page: "Mon compte",
    url: "/admin/account",
    isRequireAdmin: false,
  },
  {
    page: "Paramètres",
    url: "/admin/settings",
    isRequireAdmin: false,
  },
  {
    page: "Affiliation",
    url: "/admin/membership",
    isRequireAdmin: true,
  },
];
