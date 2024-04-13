import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_NAME ||
  !process.env.CLOUDINARY_NAME_API_KEY ||
  !process.env.CLOUDINARY_NAME_API_SECRET) {
  throw new Error('Invalid/Missing environment variable: !process.env.CLOUDINARY_NAME !process.env.CLOUDINARY_NAME_API_KEY !process.env.CLOUDINARY_NAME_API_SECRET');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_NAME_API_KEY,
  api_secret: process.env.CLOUDINARY_NAME_API_SECRET
});

let cloudinaryPromise = cloudinary

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default cloudinaryPromise;