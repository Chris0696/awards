export type ProjectInput = {
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  profession: string;
  password: string;
  age: number;
  affiliate: string;
  accept_project_reformulation: boolean;
  accept_terms_of_use: boolean;
  project: {
    category_id: string;
    category_name?: string;
    project_title: string;
    local_area_impact: string;
    main_objective: string;
    solution: string;
    description: string;
    estimated_budget: number;
    target_audience: string;
    progress_report: string;
    owner_project_status: "brouillon" | "desactive" | "publie";
  };
};
