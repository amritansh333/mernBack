import Enquiry from "../models/Enquiry.js";


export const createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    res.status(201).json({ message: "Enquiry saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save enquiry" });
  }
};
