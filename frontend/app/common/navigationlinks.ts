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
    canCommercialAccess: true,
  },
  {
    page: "Projets",
    url: "/admin/projects",
    isRequireAdmin: false,
    canCommercialAccess: false,
  },
  {
    page: "Utilisateurs",
    url: "/admin/users",
    isRequireAdmin: true,
    canCommercialAccess: false,
  },
  {
    page: "Équipe",
    url: "/admin/team",
    isRequireAdmin: true,
    canCommercialAccess: false,
  },
  {
    page: "Votes & statistiques",
    url: "/admin/statistics",
    isRequireAdmin: false,
    canCommercialAccess: false,
  },
  {
    page: "Catégories & Tags",
    url: "/admin/categories",
    isRequireAdmin: true,
    canCommercialAccess: false,
  },
  {
    page: "Mon compte",
    url: "/admin/account",
    isRequireAdmin: false,
    canCommercialAccess: true,
  },
  {
    page: "Paramètres",
    url: "/admin/settings",
    isRequireAdmin: false,
    canCommercialAccess: true,
  },
  {
    page: "Affiliation",
    url: "/admin/membership",
    isRequireAdmin: true,
    canCommercialAccess: false,
  },
];
