import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  const enquiry = new Enquiry(req.body);
  await enquiry.save();

  res.status(201).json({ message: "Enquiry saved successfully" });
};
