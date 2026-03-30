const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () => {
	return Boolean(
		process.env.CLOUDINARY_CLOUD_NAME &&
		process.env.CLOUDINARY_API_KEY &&
		process.env.CLOUDINARY_API_SECRET
	);
};

const uploadImage = async (filePath, folder = 'autocare') => {
	if (!isCloudinaryConfigured()) {
		throw new Error('Cloudinary is not configured');
	}

	return cloudinary.uploader.upload(filePath, {
		folder,
		resource_type: 'image',
		overwrite: true,
	});
};

const deleteImage = async (publicId) => {
	if (!isCloudinaryConfigured()) {
		throw new Error('Cloudinary is not configured');
	}

	return cloudinary.uploader.destroy(publicId);
};

module.exports = {
	cloudinary,
	isCloudinaryConfigured,
	uploadImage,
	deleteImage,
};
