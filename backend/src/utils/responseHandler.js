const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data
  });
};

module.exports = { sendResponse };
