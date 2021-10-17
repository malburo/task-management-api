const cloudinary = require('cloudinary').v2;

export const configCloud = () => {
  return cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
};
export const uploadCloud = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, { folder });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.log(error);
  }
};
