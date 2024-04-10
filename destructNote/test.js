const CryptoJS = require("crypto-js");

// Encryption Function
function encryptText(text, secretKey) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decryption Function
function decryptText(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Example
const secretKey = "MySecretKey123"; // Replace with your secret key
const plaintext = "Hello, world!";
console.log("Original Text:", plaintext);

// Encrypt
const encryptedText = encryptText(plaintext, secretKey);
console.log("Encrypted Text:", encryptedText);

// Decrypt
const decryptedText = decryptText(encryptedText, secretKey);
console.log("Decrypted Text:", decryptedText);