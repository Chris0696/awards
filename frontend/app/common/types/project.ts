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

export type AuthProjectInput = {
  affiliate: string;
  accept_project_reformulation: boolean;
  accept_terms_of_use: boolean;
  category_id: string;
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

export type ProjectInfo = {
  project_id: string;
  project_title: string;
  slug: string;
  description: string;
  image: string | null;
  estimated_budget: string;
  platform_status: string;
  owner_project_status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  validated_at: string | null;
  category: {
    category_id: string;
    category_name: string;
    image: string;
    slug: string;
  };
  owner: {
    user: {
      username: string;
      full_name: string;
      phone: string | null;
      user_type: string;
      is_active: boolean;
    };
    image: string;
    full_name: string;
    phone: string;
    country_code: string;
    profession: string;
    age: number;
    commercial: string | null;
    created_at: string;
    total_projects: number;
    published_projects: number;
    rejected_projects: number;
    total_votes_received: number;
  };
  average_rating: number;
  vote_count: number;
  total_revenue: number;
};
