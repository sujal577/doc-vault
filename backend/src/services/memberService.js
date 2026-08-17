import { Member } from "../models/Member.js";
import { ApiError } from "../utils/ApiError.js";
import { getUserById } from "./userService.js";

export async function listMembersForUser(userId) {
  await getUserById(userId);
  return Member.find({ userId }).sort({ createdAt: 1 }).lean();
}

export async function createMemberForUser(userId, payload) {
  await getUserById(userId);

  const member = await Member.create({
    userId,
    name: payload.name.trim(),
    relationship: payload.relationship.trim().toLowerCase(),
    dateOfBirth: payload.dateOfBirth || null,
  });

  return member.toObject();
}

export async function getMemberById(memberId) {
  const member = await Member.findById(memberId).lean();

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return member;
}

export async function updateMember(memberId, userId, payload) {
  const member = await Member.findOneAndUpdate(
    { _id: memberId, userId },
    {
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.relationship !== undefined
        ? { relationship: payload.relationship.trim().toLowerCase() }
        : {}),
      ...(payload.dateOfBirth !== undefined ? { dateOfBirth: payload.dateOfBirth } : {}),
    },
    { new: true, runValidators: true },
  ).lean();

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return member;
}

export async function deleteMember(memberId, userId) {
  const member = await Member.findOneAndDelete({ _id: memberId, userId }).lean();

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return member;
}

export async function ensureMemberBelongsToUser(memberId, userId) {
  const member = await Member.findOne({ _id: memberId, userId }).lean();

  if (!member) {
    throw new ApiError(404, "Member not found for this user");
  }

  return member;
}
