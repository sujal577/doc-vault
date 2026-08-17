import { apiRequest } from "./api.js";
import { DEV_USER_ID } from "../config/dev.js";

const RELATIONSHIP_LABELS = {
  self: "You",
  son: "Son",
  daughter: "Daughter",
};

export function mapMemberToPerson(member) {
  return {
    id: member._id,
    name: member.name,
    label: RELATIONSHIP_LABELS[member.relationship] || null,
    relationship: member.relationship,
  };
}

export async function fetchMembers(userId = DEV_USER_ID) {
  if (!userId) {
    throw new Error("Development user ID is not configured");
  }

  const members = await apiRequest(`/api/users/${userId}/members`);
  return members.map(mapMemberToPerson);
}

export async function fetchUser(userId = DEV_USER_ID) {
  if (!userId) {
    throw new Error("Development user ID is not configured");
  }

  return apiRequest(`/api/users/${userId}`);
}
