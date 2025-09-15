import z from "zod";

export const projectSchema = z.object({
  full_name: z.string().nonempty("Entrez votre nom et prénoms"),
  email: z.string().nonempty("Entrez une adresse email valide"),
  country_code: z.string().nonempty("Entrez l'indicatif du pays").optional(),
  phone: z.string().nonempty("Entrez un numéro de téléphone"),
  profession: z.string().nonempty("Entrez votre profession"),
  image: z
    .any()
    .refine(
      (files) => !files || files instanceof FileList,
      "L'image doit être un fichier valide"
    )
    .refine(
      (files) =>
        !files || files.length === 0 || files[0].size < 5 * 1024 * 1024,
      "Image trop lourde (max 5Mo)"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/png"].includes(files[0].type),
      "Format invalide (JPEG/PNG uniquement)"
    )
    .optional(),
  password: z.string().nonempty("Entrez un mot de passe"),
  age: z.coerce
    .number<number>("Entrer votre age")
    .min(18, "Vous devez avoir au moins 18 ans pour postuler"),
  category_id: z.string("Choisissez la catégorie du projet"),
  project_title: z.string().nonempty("Entrez le nom du projet"),
  local_area_impact: z
    .string()
    .nonempty("Entrez la zone d'intervention du projet"),
  description: z.string().nonempty("Donnez une brève description du projet"),

  solution: z.string().nonempty("Quel est le but du projet ?"),
  estimated_budget: z.coerce.number<number>(
    "Entrez le budget prévu pour le projet"
  ),
  affiliate: z.string(),
  owner_project_status: z.string(),
  main_objective: z.string().nonempty("Quel problème résout le projet ?"),
  target_audience: z.string().nonempty("Quelle est la cible du projet"),
  progress_report: z
    .string()
    .nonempty("Quel est le niveau d'avancement du projet"),

  acceptReformulation: z.boolean().refine((val) => val === true, {
    message: "Acceptez-vous qu'on reformule votre projet ?",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les termes",
  }),
});

export const authProjectSchema = z.object({
  project_id: z.string().optional(),
  category_id: z.string("Choisissez la catégorie du projet"),
  project_title: z.string().nonempty("Entrez le nom du projet"),
  local_area_impact: z
    .string()
    .nonempty("Entrez la zone d'intervention du projet"),
  description: z.string().nonempty("Donnez une brève description du projet"),

  solution: z.string().nonempty("Quel est le but du projet ?"),
  estimated_budget: z.coerce.number<number>(
    "Entrez le budget prévu pour le projet"
  ),
  affiliate: z.string(),
  owner_project_status: z.enum(["brouillon", "desactive", "publie"]),
  main_objective: z.string().nonempty("Quel problème résout le projet ?"),
  target_audience: z.string().nonempty("Quelle est la cible du projet"),
  progress_report: z
    .string()
    .nonempty("Quel est le niveau d'avancement du projet"),

  acceptReformulation: z.boolean().refine((val) => val === true, {
    message: "Acceptez-vous qu'on reformule votre projet ?",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les termes",
  }),
});

export const userSchema = z.object({
  email: z.email().nonempty("Entrez votre email"),
  password: z.string().nonempty("Entrez votre mot de passe"),
});

export const categorySchema = z.object({
  category_name: z.string().nonempty("Entrer le nom de la catégorie"),
});

export const createAffiliateSchema = z.object({
  username: z.string().nonempty("Entrer le nom d'utilisateur"),
  email: z.email("Email invalide").nonempty("Entrer l'email du commercial"),
  password: z.string("Entrer le mot de passe").nullable(),
  user_type: z.enum(["admin", "commercial"]),
  phone: z.string().nonempty("Entrez le numéro de téléphone"),
});

export const updateAffiliateSchema = createAffiliateSchema.extend({
  password: z.string().optional(),
});
