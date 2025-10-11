export type AffiliateInput = {
  username: string;
  email: string;
  password: string;
  user_type: "admin" | "commercial";
};

export type AffiliateInfo = {
  affiliate_link: string;
  commission_earned: string;
  commission_rate: string;
  created_at: string;
  full_name: string;
  id: number;
  is_active: boolean;
  phone: string | null;
  total_projects: number;
  total_published_projects: number;
  total_rejected_projects: number;
  total_revenue: string;
  total_votes: number;
  email: string;
  user_type: string;
};

export interface Category {
  category_id: string;
  category_name: string;
  is_custom: boolean;
  created_by: number;
  image: string;
  slug: string;
}
export interface Commercial {
  id: number;
  user_email: string;
  full_name: string;
  phone: string;
  commission_rate: string;
  affiliate_link: string;
  is_active: boolean;
  created_at: string;
  total_projects: number;
  total_published_projects: number;
  total_rejected_projects: number;
  total_votes: number;
  total_revenue: string;
  commission_earned: string;
  total_clicks: number;
  click_rate: number;
  clicks_last_30_days: number;
  clicks_today: number;
}

export interface Owner {
  id: number;
  user: {
    username: string;
    full_name: string;
    phone: string;
    user_type: string;
    is_active: boolean;
  };
  full_name: string;
  phone: string;
  country_code: string;
  profession: string;
  age: number;
  commercial: Commercial;
  created_at: string;
  total_projects: number;
  published_projects: number;
  rejected_projects: number;
  total_votes_received: number;
}
export interface Project {
  project_id: string;
  project_title: string;
  slug: string;
  description: string;
  image: string;
  estimated_budget: string;
  target_audience: string;
  solution: string;
  progress_report: string;
  platform_status: "publie" | "brouillon" | string;
  owner_project_status: "publie" | "brouillon" | string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  validated_at: string;
  category: Category;
  owner: Owner;
  commercial: Commercial;
  average_rating: number;
  vote_count: number;
  total_revenue: number;
  rank: number | null;
}
export interface Affiliate {
  id: number;
  user: {
    username: string;
    full_name: string;
    phone: string;
    user_type: "owner" | "commercial" | string;
    is_active: boolean;
  };
  user_email: string;
  image: string;
  full_name: string;
  phone: string;
  country_code: string;
  profession: string;
  age: number;
  projects: Project[];
  created_at: string;
  accept_project_reformulation: boolean;
  accept_terms_of_use: boolean;
  total_projects: number;
  published_projects: number;
  rejected_projects: number;
  total_votes_received: number;
  joined_date: string;
}

export interface AffiliatesResponse {
  affiliates: Affiliate[];
}
