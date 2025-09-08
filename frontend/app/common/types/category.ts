export type Category = {
  category_id: string;
  category_name: string;
};

export type AdminCategory = {
  active: boolean;
  category_id: string;
  category_name: string;
  created_at: string;
  id: number;
  image: string;
  project_count: number;
  slug: string;
};
