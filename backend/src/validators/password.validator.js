// Must be at least 8 characters, contain 1 uppercase, 1 lowercase, 1 digit, and 1 special character
export const validatePassword = (password) => {
  if (typeof password !== "string") return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
    password,
  );
};
