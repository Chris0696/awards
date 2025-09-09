"use server";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { projectSchema } from "../schemas";

export const createProjectAction = async (prevState: any, data: FormData) => {
  const rawPhone = data.get("phone") as string | null;

  let country_code: string | undefined;
  let phone: string | undefined;

  if (rawPhone) {
    try {
      const parsed = parsePhoneNumberWithError(rawPhone);
      if (parsed) {
        country_code = `+${parsed.countryCallingCode}`;
        phone = parsed.nationalNumber;
      }
    } catch {
      phone = rawPhone;
    }
  }
  const payload = {
    full_name: data.get("full_name"),
    email: data.get("email"),
    country_code,
    phone,
    profession: data.get("profession"),
    password: data.get("password"),
    age: data.get("age"),
    affiliate: data.get("affiliate"),
    category_name: data.get("category_name"),
    project_title: data.get("project_title"),
    local_area_impact: data.get("local_area_impact"),
    main_objective: data.get("main_objective"),
    solution: data.get("solution"),
    description: data.get("description"),
    estimated_budget: data.get("estimated_budget"),
    target_audience: data.get("target_audience"),
    progress_report: data.get("progress_report"),
    owner_project_status: data.get("owner_project_status"),
  };

  const validatedData = projectSchema.safeParse(payload);
  if (!validatedData.success) {
    return {
      status: "error",
      message: "Validation échouée.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const formatedPayload = {
    full_name: validatedData.data.full_name,
    email: validatedData.data.email,
    country_code: validatedData.data.country_code,
    phone: validatedData.data.phone,
    profession: validatedData.data.profession,
    password: validatedData.data.password,
    age: validatedData.data.age,
    affiliate: validatedData.data.affiliate,
    project: {
      category_name: validatedData.data.category_name,
      project_title: validatedData.data.project_title,
      local_area_impact: validatedData.data.local_area_impact,
      main_objective: validatedData.data.main_objective,
      solution: validatedData.data.solution,
      description: validatedData.data.description,
      estimated_budget: validatedData.data.estimated_budget,
      target_audience: validatedData.data.target_audience,
      progress_report: validatedData.data.progress_report,
      owner_project_status: validatedData.data.owner_project_status,
    },
  };

  try {
    const response = await fetch(
      `${process.env.API_URL}auth/register/authorproject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatedPayload),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: "error",
        message: errorData.detail || "Une erreur est survenue.",
      };
    }
    return {
      status: "success",
      message: "Projet soumis avec succès !",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Impossible de contacter le serveur.",
    };
  }
};
