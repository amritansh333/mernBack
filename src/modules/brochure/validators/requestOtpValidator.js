const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^\+?[0-9][0-9\s-]{6,19}$/;

const fields = [
  "firstName",
  "lastName",
  "companyName",
  "email",
  "mobileNumber",
  "productId",
  "productSlug",
  "productName",
  "currentRoute",
];

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

export const validateRequestOtpBody = (body = {}) => {
  const data = {};

  for (const field of fields) {
    data[field] = normalizeString(body[field]);

    if (!data[field]) {
      return {
        error: {
          field,
          message: `${field} is required`,
        },
      };
    }
  }

  data.email = data.email.toLowerCase();
  data.productSlug = data.productSlug.toLowerCase();

  if (!emailPattern.test(data.email)) {
    return {
      error: {
        field: "email",
        message: "Please enter a valid email address",
      },
    };
  }

  if (!mobilePattern.test(data.mobileNumber)) {
    return {
      error: {
        field: "mobileNumber",
        message: "Please enter a valid mobile number",
      },
    };
  }

  return { data };
};
