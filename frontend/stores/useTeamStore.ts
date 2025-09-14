import { Team } from "@/app/(dashboard)/admin/team/page";
import { AffiliateInfo, AffiliateInput } from "@/app/common/types/affiliate";
import {
  AffiliateForm,
  UpdateTeamMemberForm,
} from "@/components/modals/AddGdChildModal";
import { affiliateService } from "@/frontendlib/services/affiliateService";
import {
  createTeamMember,
  deleteTeamMember,
  getTeam,
  updateTeamMember,
} from "@/frontendlib/services/teamService";
import { create } from "zustand";

interface TeamStore {
  teams: Team[];
  fetchTeams: () => Promise<void>;
  addTeam: (data: AffiliateForm) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMember: (data: UpdateTeamMemberForm) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],

  fetchTeams: async () => {
    const teams: Team[] = await getTeam();
    set({ teams });
  },

  addTeam: async (data: AffiliateForm) => {
    const newTeamMember = await createTeamMember(data);
    set((state) => ({
      teams: [...state.teams, newTeamMember],
    }));
  },
  deleteMember: async (id: string) => {
    await deleteTeamMember(id);
  },
  updateMember: async (data: UpdateTeamMemberForm) => {
    await updateTeamMember(data);
  },
}));
