export function generateTransactionId() {
  const prefix = "TRSID";
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();

  const transactionId = `${prefix}-${timestamp}-${randomChars}`;
  return transactionId;
};
