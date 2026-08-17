import * as userService from "../services/userService.js";
import { sendSuccess } from "../utils/response.js";

export async function getUser(req, res) {
  const user = await userService.getUserById(req.params.userId);
  sendSuccess(res, user);
}
