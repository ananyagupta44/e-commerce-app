import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "../css/HeroImageCarousel.css";
import CarouselImage1 from "../assets/CarouselImage1.png";
import CarouselImage2 from "../assets/CarouselImage2.png";
import CarouselImage3 from "../assets/CarouselImage3.png";
import CarouselImage4 from "../assets/CarouselImage4.png";
import CarouselImage5 from "../assets/CarouselImage5.png";

const images = [
  CarouselImage1,
  CarouselImage2,
  CarouselImage3,
  CarouselImage4,
  CarouselImage5,
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

  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (distance > 50) {
      nextSlide(); // swipe left
    } else if (distance < -50) {
      prevSlide(); // swipe right
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-glow" />

      <div
        className="carousel-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => {
          const position = (index - active + images.length) % images.length;

          const slideClass = slideStyles[position] || "hidden-slide";

          return (
            <div key={index} className={`carousel-card ${slideClass}`}>
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
