import {
  AffiliateForm,
  UpdateTeamMemberForm,
} from "@/components/modals/AddGdChildModal";

export async function getTeam() {
  const res = await fetch("/api/team", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur à la récupération des utilisateur");
  return res.json();
}
export async function createTeamMember(data: AffiliateForm) {
  try {
    const res = await fetch("/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la création", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function updateTeamMember(data: UpdateTeamMemberForm) {
  try {
    const res = await fetch("/api/team", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la mise à jour", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const res = await fetch("/api/team", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw { message: "Erreur lors de la supression", body: errorBody };
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
}
