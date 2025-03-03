import CryptoJS from "crypto-js";

const SECRET_KEY = "hackathone";

if (!SECRET_KEY) {
  throw new Error("Encryption key is missing. Set NEXT_PUBLIC_ENCRYPTION_KEY in your environment.");
}

// Encrypt function
export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

// Decrypt function
export const decryptData = (ciphertext: string): number => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    const parsedNumber = Number(decryptedText);
    if (isNaN(parsedNumber)) {
      console.warn("Decryption warning: Result is not a valid number.");
      return NaN; // Or handle this scenario differently
    }
    
    return parsedNumber;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid decryption process");
  }
};
