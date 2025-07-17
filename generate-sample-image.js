const fs = require("fs");
const path = require("path");

// This creates the directory: tests/admin/assets
const dir = path.resolve(__dirname, "tests/admin/assets");

// This will be the path of the image to create
const imagePath = path.join(dir, "sample.jpg");

// Create the folder if it doesn't exist
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Small dummy JPEG image in base64
const base64 =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wCEAAICAgICAgICAgICAwMDBAMDAwYEBAMEBQUGBQUFBQYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGGAA//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAq//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AV//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AV//2Q==";

// Write the image file
fs.writeFileSync(imagePath, Buffer.from(base64, "base64"));

console.log("✅ sample.jpg created at", imagePath);
