import React, { useState, useRef, useEffect } from 'react';

interface ImageSliderProps {
  image: string;
  alt: string;
}

export default function ImageSlider({ image, alt }: ImageSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isButtonClick, setIsButtonClick] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event 
      ? event.touches[0].clientX 
      : event.clientX;
    const position = ((x - containerRect.left) / containerRect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsButtonClick(false);
  };

  const handleButtonClick = (position: number) => {
    setIsButtonClick(true);
    setSliderPosition(position);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] rounded-xl overflow-hidden cursor-ew-resize shadow-2xl select-none focus:outline-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Control Buttons */}
      <div className="absolute inset-x-0 bottom-8 flex justify-between px-4 z-10">
        <button
          onClick={() => handleButtonClick(0)}
          className="dark-cta text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-full font-semibold gentle-bounce"
        >
          Without Clarity
        </button>
        <button
          onClick={() => handleButtonClick(100)}
          className="dark-cta text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-full font-semibold gentle-bounce"
        >
          With Clarity
        </button>
      </div>

      {/* Base Image (Blurred) */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover blur-md"
        />
      </div>

      {/* Clear Image */}
      <div 
        className="absolute inset-0"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, 
          transition: isButtonClick ? 'clip-path 0.8s ease-in-out' : 'none'
        }}
      >
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ 
          left: `${sliderPosition}%`,
          transition: isButtonClick ? 'left 0.8s ease-in-out' : 'none'
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-brand-navy" />
        </div>
      </div>
    </div>
  );
}