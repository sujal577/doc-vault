import * as memberService from "../services/memberService.js";
import { sendSuccess } from "../utils/response.js";

export async function listMembers(req, res) {
  const members = await memberService.listMembersForUser(req.params.userId);
  sendSuccess(res, members);
}

export async function createMember(req, res) {
  const member = await memberService.createMemberForUser(req.params.userId, req.body);
  sendSuccess(res, member, 201);
}

export async function getMember(req, res) {
  const member = await memberService.getMemberById(req.params.memberId);
  sendSuccess(res, member);
}

export async function updateMember(req, res) {
  const userId = req.query.userId;
  const { name, relationship, dateOfBirth } = req.body;

  const member = await memberService.updateMember(req.params.memberId, userId, {
    name,
    relationship,
    dateOfBirth,
  });

  sendSuccess(res, member);
}

export async function deleteMember(req, res) {
  const userId = req.query.userId;
  const member = await memberService.deleteMember(req.params.memberId, userId);
  sendSuccess(res, member);
}
