/* eslint-disable camelcase */
// Image resize method
// async function resizeImage(file) {
//   const image_file = file;

//   // New Instance of reader, we use it to load the image and create the url
//   const reader = new FileReader();
//   reader.readAsDataURL(image_file);
//   reader.onload = (event) => {
//     // Once image is loaded we use the event.target.result to get the result of
//     // reader.readAsDataURL(image_file);
//     const image_url = event.target.result;
//     // Create image element and append the image
//     const image = document.createElement('img');
//     image.src = image_url;

//     image.onload = (e) => {
//       // Original image
//       const originalWidth = e.target.width;
//       const originalHeight = e.target.height;
//       // image / 10
//       const canvasWidth = Math.round(originalWidth / 10);

//       // Create canvas element
//       const canvas = document.createElement('canvas');
//       canvas.width = canvasWidth;
//       const ratio = originalWidth / canvasWidth;
//       canvas.height = ratio * originalHeight;

//       // Draw image to the canvas / context
//       const context = canvas.getContext('2d');
//       context.drawImage(image, 0, 0, canvas.width, canvas.height);

//       // Convert image back to the data that we need
//       const new_image_url = context.canvas.toDataURL('image/jpeg', 10);
//       return new_image_url;
//     };
//   };
// }

// export default resizeImage;


async function resizeImage(file) {
  if (!(file instanceof Blob)) {
    throw new TypeError('The provided file is not of type Blob.');
  }

  const image_url = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });

  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = image_url;

    image.onload = (e) => {
      // Original image
      const originalWidth = e.target.width;
      const originalHeight = e.target.height;
      // image / 10
      const canvasWidth = Math.round(originalWidth / 10);
      const canvasHeight = Math.round(originalHeight / 10);

      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      // const ratio = originalWidth / canvasWidth;
      // canvas.height = ratio * originalHeight;
      canvas.height = canvasHeight;

      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const new_image_url = context.canvas.toDataURL('image/jpeg', 1);
      resolve(new_image_url);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

export default resizeImage;
