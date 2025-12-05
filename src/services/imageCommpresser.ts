import imageCompression from "browser-image-compression";

export const compressedImageFile = async (file: File) => {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.7,
    };

    const compressedImage = await imageCompression(file, options);
    return compressedImage;
  } catch (error) {
    console.error("error message from the compression : ", error);
    return file;
  }
};
