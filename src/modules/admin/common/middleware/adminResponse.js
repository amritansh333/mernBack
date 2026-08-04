export const adminResponse = (req, res, next) => {
  // attach helpers for consistent admin responses
  res.apiSuccess = (data = null, message = "OK", pagination = null) => {
    return res.json({ success: true, message, data, pagination });
  };

  res.apiError = (status = 400, message = "Error", data = null) => {
    res.status(status).json({ success: false, message, data });
  };

  next();
};

export default adminResponse;
