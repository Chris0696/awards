export type AffiliateInput = {
  username: string;
  email: string;
  password: string;
  user_type: "admin" | "commercial";
};

export type AffiliateInfo = {
  username: string;
  email: string;
  user_type: string;
};
