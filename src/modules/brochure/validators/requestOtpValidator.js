const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^\+?[0-9][0-9\s-]{6,19}$/;
const otpPattern = /^\d{6}$/;
const productSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

export const validateVerifyOtpBody = (body = {}) => {
  const mobileNumber = normalizeString(body.mobileNumber);
  const otp = normalizeString(body.otp);

  if (!mobileNumber) {
    return {
      error: {
        field: "mobileNumber",
        message: "mobileNumber is required",
      },
    };
  }

  if (!mobilePattern.test(mobileNumber)) {
    return {
      error: {
        field: "mobileNumber",
        message: "Please enter a valid mobile number",
      },
    };
  }

  if (!otp) {
    return {
      error: {
        field: "otp",
        message: "otp is required",
      },
    };
  }

  if (!otpPattern.test(otp)) {
    return {
      error: {
        field: "otp",
        message: "Please enter a valid OTP",
      },
    };
  }

  return {
    data: {
      mobileNumber,
      otp,
    },
  };
};

export const validateResendOtpBody = (body = {}) => {
  const mobileNumber = normalizeString(body.mobileNumber);

  if (!mobileNumber) {
    return {
      error: {
        field: "mobileNumber",
        message: "mobileNumber is required",
      },
    };
  }

  if (!mobilePattern.test(mobileNumber)) {
    return {
      error: {
        field: "mobileNumber",
        message: "Please enter a valid mobile number",
      },
    };
  }

  return {
    data: {
      mobileNumber,
    },
  };
};

export const validateDownloadParams = (params = {}) => {
  const productSlug = normalizeString(params.productSlug).toLowerCase();

  if (!productSlug) {
    return {
      error: {
        field: "productSlug",
        message: "productSlug is required",
      },
    };
  }

  if (!productSlugPattern.test(productSlug)) {
    return {
      error: {
        field: "productSlug",
        message: "Please enter a valid productSlug",
      },
    };
  }

  return {
    data: {
      productSlug,
    },
  };
};
