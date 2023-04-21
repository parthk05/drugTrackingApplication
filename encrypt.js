const crypto = require("crypto");

// Generate a random key and initialization vector (IV)
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16); // 128-bit IV
//medicine variable
let manufacturedata = "20/10/23";
let expirydate = "20/08/24";
let data = manufacturedata + " " + expirydate;
// Convert the message to a Buffer object
const message = Buffer.from(data, "utf-8");

// Create an AES-256-CBC cipher object
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

// Encrypt the message and convert to hexadecimal format
let encryptedHex = cipher.update(message).toString("hex");
encryptedHex += cipher.final().toString("hex");

console.log("Encrypted message in hexadecimal format:", encryptedHex);

// Create a new AES-256-CBC decipher object
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

// Decrypt the message and convert back to UTF-8 string
let decrypted = decipher.update(
  Buffer.from(encryptedHex, "hex"),
  "hex",
  "utf-8"
);
decrypted += decipher.final("utf-8");

console.log("Decrypted message:", decrypted);
