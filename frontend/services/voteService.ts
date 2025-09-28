import apiClient from "./apiClient";

interface VoteForm {
  payment_reference: string;
  payment_status: string;
  project_id: string;
  vote_count: number;
  voter_name: string;
  voter_email: string;
  phone: string;
  payment_method: string;
  external_transaction_id: string;
}

export const makeVote = async (data: VoteForm) => {
  const res = await apiClient.post("votes/create-and-pay/", data);
  return res.data;
};
