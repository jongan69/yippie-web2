export const postToCloudinary = async (imageFile: any, title: any) => {
    try {
        const formData = new FormData()
        formData.append("file", imageFile);
        formData.append('public_id', title);
        formData.append('api_key', `${process.env.CLOUDINARY_NAME_API_KEY}`);
        return await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/:resource_type/upload`, {
            method: "POST",
            body: formData
        }).then(data => data.json())
            .then((response) => {
                return response
            })
    } catch (error) {
        return error
    }
}