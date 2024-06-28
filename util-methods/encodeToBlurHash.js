import { encode } from 'blurhash';

// Function to encode an image file to a BlurHash string
const encodeImageToBlurHash = (image) => new Promise((resolve, reject) => {
  const img = new Image();
  img.src = URL.createObjectURL(image);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const blurHash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
    resolve({ blurHash, width: img.width, height: img.height });
  };
  img.onerror = (error) => {
    reject(error);
  };
});

export default encodeImageToBlurHash;
