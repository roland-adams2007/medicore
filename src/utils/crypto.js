import CryptoJS from "crypto-js";

const { VITE_SECURE_LS_SECRET } = import.meta.env;

export function encryptData(data) {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      VITE_SECURE_LS_SECRET,
    ).toString();
    return ciphertext;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// 🔹 Decrypt data
export function decryptData(ciphertext) {
  try {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, VITE_SECURE_LS_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
