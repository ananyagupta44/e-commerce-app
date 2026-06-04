import API_URL from "@/config/api";

const getImageUrl = (img) => {
  if (!img) {
    return "/placeholder.jpg";
  }

  // Cloudinary image
  if (img.startsWith("http") && img.includes("res.cloudinary.com")) {
    return img.replace("/upload/", "/upload/f_auto,q_auto/");
  }

  // Other external image
  if (img.startsWith("http")) {
    return img;
  }

  // Local uploaded image
  return `${API_URL}${img}`;
};

export default getImageUrl;
