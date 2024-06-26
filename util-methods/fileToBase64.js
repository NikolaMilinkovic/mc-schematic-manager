// Compression method #1
const setFileToBase64 = (imgFile) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(imgFile);
  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.onerror = reject;
});

export default setFileToBase64;
