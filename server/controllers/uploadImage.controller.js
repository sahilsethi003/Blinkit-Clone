import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async(request,response)=>{
    try {
        const file = request.file
        let uploadImageResult;

        try {
            uploadImageResult = await uploadImageClodinary(file)
        } catch (cloudinaryError) {
            // If Cloudinary fails (e.g. due to missing or invalid credentials),
            // fallback to returning the image as a local Base64 Data URL
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            uploadImageResult = {
                url: base64Image
            };
        }

        return response.json({
            message : "Upload done",
            data : uploadImageResult,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default uploadImageController