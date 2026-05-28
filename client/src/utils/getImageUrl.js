const getImageUrl = (img) => {
  if (!img) {
    return "/placeholder.jpg";
  }

  // External image
  if (img.startsWith("http")) {
    return img;
  }

  // Local uploaded image
  return `http://localhost:5000${img}`;
};

export default getImageUrl;
