import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export async function getUserById(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}
