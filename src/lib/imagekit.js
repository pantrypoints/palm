import ImageKit from 'imagekit';

// Log environment variables for debugging (remove in production)
console.log('ImageKit Environment Check:', {
  hasPublicKey: !!process.env.PUBLIC_IMAGEKIT_PUBLIC_KEY,
  hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
  hasUrlEndpoint: !!process.env.PUBLIC_IMAGEKIT_URL_ENDPOINT,
  urlEndpoint: process.env.PUBLIC_IMAGEKIT_URL_ENDPOINT
});

const publicKey = process.env.PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.PUBLIC_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  console.error('Missing ImageKit configuration:', {
    publicKey: !!publicKey,
    privateKey: !!privateKey,
    urlEndpoint: !!urlEndpoint
  });
  throw new Error('ImageKit is not properly configured. Please check your environment variables.');
}

const imagekit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint
});

/**
 * Upload a base64 image to ImageKit
 * @param {string} base64String - Base64 encoded image (with or without data:image prefix)
 * @param {string} fileName - Name for the uploaded file
 * @returns {Promise<{url: string, fileId: string}>}
 */
export async function uploadToImageKit(base64String, fileName) {
  // Remove data:image prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  try {
    const result = await imagekit.upload({
      file: base64Data,
      fileName: fileName,
      folder: '/palms',
      useUniqueFileName: true,
    });
    
    return {
      url: result.url,
      fileId: result.fileId
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete an image from ImageKit
 * @param {string} fileId - ImageKit file ID
 */
export async function deleteFromImageKit(fileId) {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
  }
}

/**
 * Extract fileId from ImageKit URL
 * @param {string} url - ImageKit URL
 * @returns {string|null}
 */
export function getFileIdFromUrl(url) {
  if (!url) return null;
  // URL format: https://ik.imagekit.io/h5qz5gunp/palms/unique-file-name.jpg
  const parts = url.split('/');
  return parts[parts.length - 1];
}