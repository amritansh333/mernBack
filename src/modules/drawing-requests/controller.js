import * as service from "./service.js";

export const createDrawingRequest = async (req, res) => {
  const files = req.files || [];
  const { fullName, company, email, phone, notes } = req.body;

  try {
    const drawingRequest = await service.createDrawingRequest({
      fullName,
      company,
      email,
      phone,
      notes,
      files,
    });

    return res.status(201).json({
      success: true,
      drawingRequestId: drawingRequest._id,
      message: "Drawing request submitted successfully",
    });
  } catch (error) {
    if (error && error.statusCode) {
      const payload = {
        success: false,
        message: error.message || "Validation failed",
      };

      if (Array.isArray(error.errors) && error.errors.length > 0) {
        payload.errors = error.errors;
      }

      return res.status(error.statusCode).json(payload);
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default { createDrawingRequest };
