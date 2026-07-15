export const validateAadhaar = (aadhaar) => {
  aadhaar = aadhaar.replace(/\s/g, "");

  return /^[0-9]{12}$/.test(aadhaar)
    ? { valid: true }
    : {
        valid: false,
        message: "Aadhaar number must contain exactly 12 digits",
      };
};

export const validatePAN = (pan) => {
  pan = pan.trim().toUpperCase();

  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)
    ? { valid: true }
    : {
        valid: false,
        message:
          "PAN must be in the format AAAAA9999A (5 letters, 4 digits, 1 letter)",
      };
};

export const validateGST = (gst) => {
  gst = gst.trim().toUpperCase();

  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
    ? { valid: true }
    : {
        valid: false,
        message:
          "GSTIN must be in the format 22AAAAA0000A1Z5",
      };
};