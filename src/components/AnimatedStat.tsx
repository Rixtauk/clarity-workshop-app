import React, { useState, useEffect, useRef } from 'react';

interface AnimatedStatProps {
  endValue: number;
  label: string;
  duration?: number;
  suffix?: string;
}

export default function AnimatedStat({ endValue, label, duration = 2000, suffix = "+" }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const startTime = Date.now();
          const animate = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            setCount(Math.floor(endValue * progress));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, duration, hasAnimated]);

  return (
    <div 
      ref={elementRef}
      className="bg-[#2f3857] p-4 rounded-xl text-white transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <div className="text-4xl font-bold mb-1">
        {count}{suffix}
      </div>
      <div className="text-[#c8b6a6] font-medium text-base">
        {label}
      </div>
    </div>
  );
}