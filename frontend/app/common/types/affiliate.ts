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
