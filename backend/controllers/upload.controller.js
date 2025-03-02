import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: "da8gyrfzb",
    api_key: "365485344843351",
    api_secret: "7ABVYiVlZFgE7luVCSB0ctEO3FM",
    secure: true,
});

// File upload route
export const uploadFile = async (req, res) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    console.log(req.files);
    

    try {
        const result = await cloudinary.v2.uploader.upload(req.files.mediaFile.path, {
            ...options,
            folder: "xiel-connect",
            resource_type: "auto",
        });
        console.log("Uploaded File", result);

        // Get original file name from the request
        const originalFileName = req.files.mediaFile.name;

        // Include the original file name in the response
        res.status(200).json({ 
            url: result.secure_url, 
            public_id: result.public_id,
            originalFileName: originalFileName
        });
    } catch (error) {
        console.log("Error in file upload controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

