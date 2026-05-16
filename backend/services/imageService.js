import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ImageService {
  // Upload image to Cloudinary
  static async uploadImage(file, folder = 'glowcare') {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: `glowcare/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        width: 800,
        height: 800,
        crop: 'fill',
        gravity: 'auto',
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(files, folder = 'glowcare') {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder)
      );
      const results = await Promise.all(uploadPromises);

      return {
        success: true,
        images: results.filter((r) => r.success),
        failed: results.filter((r) => !r.success),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok') {
        return {
          success: true,
          message: 'Image deleted successfully',
        };
      }

      return {
        success: false,
        error: 'Failed to delete image',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate optimized image URL with transformations
  static getOptimizedUrl(publicId, options = {}) {
    try {
      const {
        width = 400,
        height = 400,
        quality = 'auto',
        format = 'webp',
      } = options;

      const url = cloudinary.url(publicId, {
        width,
        height,
        quality,
        format,
        crop: 'fill',
        gravity: 'auto',
        secure: true,
      });

      return {
        success: true,
        url,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get image metadata
  static async getImageMetadata(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);

      return {
        success: true,
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          secure_url: result.secure_url,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload image from URL
  static async uploadImageFromUrl(imageUrl, folder = 'glowcare') {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: `glowcare/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default ImageService;
