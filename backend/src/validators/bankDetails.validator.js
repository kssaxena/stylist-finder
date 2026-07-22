export const validateBankDetails = (
  bankName,
  branchName,
  accountHolderName,
  accountNumber,
  confirmAccountNumber,
  ifscCode,
) => {
  if (!bankName || !/^[A-Za-z0-9\s.&()-]{2,100}$/.test(bankName.trim()))
    return { valid: false, message: "Invalid bank name" };

  if (!branchName || !/^[A-Za-z0-9\s,&()-]{2,100}$/.test(branchName.trim()))
    return { valid: false, message: "Invalid branch name" };

  if (
    !accountHolderName ||
    !/^[A-Za-z\s.-]{2,100}$/.test(accountHolderName.trim())
  )
    return { valid: false, message: "Invalid account holder name" };

  if (!/^[0-9]{9,18}$/.test(accountNumber))
    return { valid: false, message: "Invalid account number" };

  if (accountNumber !== confirmAccountNumber)
    return { valid: false, message: "Account numbers do not match" };

  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase()))
    return { valid: false, message: "Invalid IFSC code" };

  return { valid: true };
};

export const validateUPI = (upiId) => {
  if (!upiId) return false;

  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{1,254}@[a-zA-Z]{2,64}$/.test(upiId.trim());
};
