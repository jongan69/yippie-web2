import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_NAME_API_KEY,
    api_secret: process.env.CLOUDINARY_NAME_API_SECRET
});

function readImage(input: { files: Blob[]; }) {
    var reader;
    if (input.files && input.files[0]) {
        reader = new FileReader();
        return reader.readAsDataURL(input.files[0]);
    }
}

export const postToCloudinaryV2 = async (imageFile: any) => {
    try {
        const pathName = readImage(imageFile)
        console.log(JSON.stringify(pathName))
        if (pathName !== undefined) return await cloudinary.uploader.upload(pathName);
    } catch (error) {
        return error
    }
}