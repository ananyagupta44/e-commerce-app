import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
];

export default function HeroImageCarousel() {
  const [active, setActive] = useState(0);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative flex-1 min-w-[400px] h-[700px] flex items-center justify-center overflow-visible">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />

      {/* Image Stack */}
      <div className="relative w-[420px] h-[600px] flex items-center justify-center">
        {images.map((img, index) => {
          const position = (index - active + images.length) % images.length;

          let styles = "";

          switch (position) {
            // ACTIVE IMAGE
            case 0:
              styles = `
                translate-x-0 
                scale-100 
                opacity-100 
                z-50
                rotate-0
              `;
              break;

            // RIGHT IMAGE
            case 1:
              styles = `
                translate-x-[140px]
                translate-y-[20px]
                scale-[0.82]
                opacity-50
                z-40
                rounded-[32px]
              `;
              break;

            // FAR RIGHT
            case 2:
              styles = `
                translate-x-[220px]
                translate-y-[40px]
                scale-[0.65]
                opacity-20
                z-30
              `;
              break;

            // LEFT IMAGE
            case 4:
              styles = `
                -translate-x-[140px]
                translate-y-[20px]
                scale-[0.82]
                opacity-50
                z-40
              `;
              break;

            // FAR LEFT
            case 3:
              styles = `
                -translate-x-[220px]
                translate-y-[40px]
                scale-[0.65]
                opacity-20
                z-30
              `;
              break;

            default:
              styles = "opacity-0";
          }

          return (
            <div
              key={index}
              className={`
    absolute top-0 left-0
    w-full h-full
    rounded-[32px]
    overflow-hidden
    shadow-[0_25px_60px_rgba(0,0,0,0.45)]
    border border-white/10
    transition-all duration-700 ease-in-out will-change-transform
    [backface-visibility:hidden]
    ${styles}
  `}
            >
              <img
                src={img}
                alt=""
                className="
    w-full h-full
    object-cover
    rounded-[32px]
    select-none
    pointer-events-none
  "
              />
            </div>
          );
        })}
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="
  absolute left-0
  top-1/2 -translate-y-1/2
  w-12 h-12
  flex items-center justify-center
  rounded-full
  bg-white/10
  backdrop-blur-xl
  border border-white/10
  text-white
  hover:scale-110
  hover:bg-white/20
  transition-all
  z-[100]
"
      >
        <ChevronLeft size={22} />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="
  absolute right-0
  top-1/2 -translate-y-1/2
  w-12 h-12
  flex items-center justify-center
  rounded-full
  bg-white/10
  backdrop-blur-xl
  border border-white/10
  text-white
  hover:scale-110
  hover:bg-white/20
  transition-all
  z-[100]
"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
