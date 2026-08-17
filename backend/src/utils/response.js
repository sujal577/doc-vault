export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendMessage(res, message, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
  });
}
