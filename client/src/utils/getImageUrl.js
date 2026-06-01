import API_URL from "@/config/api";

const getImageUrl = (img) => {
  if (!img) {
    return "/placeholder.jpg";
  }

  // External image
  if (img.startsWith("http")) {
    return img;
  }

  // Local uploaded image
  return `${API_URL}${img}`;
};

export default getImageUrl;
