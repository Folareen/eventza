import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadToCloudinary(file: Express.Multer.File, folder = 'events'): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result?: UploadApiResponse) => {
                if (error || !result) {
                    return reject(error ?? new Error('Cloudinary upload failed'));
                }
                resolve(result.secure_url);
            },
        );
        uploadStream.end(file.buffer);
    });
}
