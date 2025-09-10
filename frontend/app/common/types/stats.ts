export type AdminStats = {
  general_stats: {
    total: number;
    validated: number;
    rejected: number;
    pending: number;
    draft: number;
  };
  user_stats: {
    total_users: number;
    total_owners: number;
    total_commercials: number;
    recent_users: number;
  };
  vote_stats: {
    total_votes: number;
    total_revenue: number;
    pending_payments: number;
    recent_votes: number;
    average_revenue_per_vote: number;
  };
  recent_activity: {
    recent_projects: number;
    recent_votes: number;
    recent_users: number;
  };
  top_categories: [
    {
      category_name: string;
      project_count: number;
      slug: string;
    },
    {
      category_name: string;
      project_count: number;
      slug: string;
    }
  ];
  top_commercials: [
    {
      full_name: string;
      projects_brought: number;
      total_votes: number;
      affiliate_link: string;
    }
  ];
};

export type OwnerStats = {
  profile: {
    full_name: string;
    profession: string;
    phone: string;
    commercial: string;
  };
  project_stats: {
    total: number;
    validated: number;
    rejected: number;
    pending: number;
    draft: number;
    validation_rate: number;
  };
  vote_stats: {
    total_votes: number;
    average_rating: number;
    total_revenue_generated: number;
  };
  recent_projects: [
    {
      project_id: string;
      project_title: string;
      platform_status: string;
      votes: number;
      rank: number;
      category: {
        category_id: string;
        category_name: string;
        image: string;
        slug: string;
      };
      created_at: string;
    }
  ];
  recent_votes: [];
  owner_ranking: {
    rank: number;
    total_owners: number;
  };
  top_project_votes: number;
};
