import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../css/HeroImageCarousel.css";

const images = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
];

const slideStyles = [
  "active",
  "right-near",
  "right-far",
  "left-far",
  "left-near",
];

export default function HeroImageCarousel() {
  const [active, setActive] = useState(0);

  const nextSlide = () => setActive((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setActive((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="carousel-container">
      <div className="carousel-glow" />

      <div className="carousel-wrapper">
        {images.map((img, index) => {
          const position = (index - active + images.length) % images.length;

          const slideClass = slideStyles[position] || "hidden-slide";

          return (
            <div key={img} className={`carousel-card ${slideClass}`}>
              <img
                src={img}
                alt={`Hero slide ${index + 1}`}
                className="carousel-image"
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="carousel-btn carousel-btn-left"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        className="carousel-btn carousel-btn-right"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
