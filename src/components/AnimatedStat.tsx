import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, BookOpen, Target, CheckCircle, Star } from 'lucide-react';

interface AnimatedStatProps {
  endValue: number;
  label: string;
  duration?: number;
  suffix?: string;
  icon?: string;
  isPercentage?: boolean;
  delay?: number;
}

export default function AnimatedStat({ 
  endValue, 
  label, 
  duration = 2000, 
  suffix = "+", 
  icon = "trending",
  isPercentage = false,
  delay = 0
}: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [iconRotation, setIconRotation] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  // Easing function for smoother animation
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Get appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case 'users': return <Users className="w-6 h-6" />;
      case 'book': return <BookOpen className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'check': return <CheckCircle className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      default: return <TrendingUp className="w-6 h-6" />;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setHasAnimated(true);
            
            const startTime = Date.now();
            const animate = () => {
              const currentTime = Date.now();
              const rawProgress = Math.min((currentTime - startTime) / duration, 1);
              const easedProgress = easeOutCubic(rawProgress);
              
              // Animate the count with easing
              const currentCount = Math.floor(endValue * easedProgress);
              setCount(currentCount);
              
              // Animate progress bar
              setProgressWidth(easedProgress * 100);
              
              // Animate icon rotation
              setIconRotation(easedProgress * 360);
              
              if (rawProgress < 1) {
                requestAnimationFrame(animate);
              } else {
                // Completion effects
                setIsCompleted(true);
                setTimeout(() => setIsCompleted(false), 2000);
              }
            };
            
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [endValue, duration, hasAnimated, delay]);

  const CircularProgress = ({ progress, size = 80 }: { progress: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 absolute inset-0"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(200, 182, 166, 0.2)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fd7f4f" />
              <stop offset="50%" stopColor="#ff6b9d" />
              <stop offset="100%" stopColor="#ff8c42" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold stat-number tabular-nums">
            {count}{suffix}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={elementRef}
      className={`
        bg-[#2f3857] p-6 rounded-xl text-white transform transition-all duration-500
        shadow-lg hover:shadow-2xl hover-tilt gpu-accelerated relative overflow-hidden
        ${isCompleted ? 'animate-completion-glow' : ''}
        ${hasAnimated ? 'hover:-translate-y-2' : ''}
      `}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Icon with rotation animation */}
      <div className="flex items-center justify-between mb-4">
        <div 
          className={`
            text-[#c8b6a6] transition-all duration-500
            ${hasAnimated ? 'animate-icon-bounce' : ''}
            ${isCompleted ? 'text-[#fd7f4f] animate-completion-pulse' : ''}
          `}
          style={{ 
            transform: hasAnimated ? `rotate(${iconRotation * 0.5}deg)` : 'rotate(0deg)',
            transition: 'transform 2s ease-out'
          }}
        >
          {getIcon()}
        </div>
        
        {/* Completion checkmark */}
        {isCompleted && (
          <div className="animate-completion-check text-green-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="relative z-10">
        {isPercentage ? (
          // Circular progress for percentages
          <div className="flex flex-col items-center mb-4">
            <CircularProgress progress={progressWidth} />
          </div>
        ) : (
          // Regular number display with digit flip effect
          <div className="mb-4">
            <div className={`
              heading-lg mb-2 count-up stat-number tabular-nums relative
              ${hasAnimated ? 'animate-digit-flip' : ''}
              ${isCompleted ? 'animate-number-glow' : ''}
            `}>
              <span className="stat-digits">
                {count.toLocaleString()}
              </span>
              <span className="stat-suffix text-[#c8b6a6] ml-1">
                {suffix}
              </span>
            </div>
          </div>
        )}

        {/* Progress bar for non-percentage stats */}
        {!isPercentage && (
          <div className="mb-3 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full progress-bar-fill transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        )}

        {/* Label */}
        <div className={`
          text-[#c8b6a6] body-text text-center transition-all duration-300
          ${isCompleted ? 'text-white animate-text-glow' : ''}
        `}>
          {label}
        </div>

        {/* Completion sparkles */}
        {isCompleted && (
          <>
            <div className="completion-sparkle sparkle-1">✨</div>
            <div className="completion-sparkle sparkle-2">✨</div>
            <div className="completion-sparkle sparkle-3">✨</div>
          </>
        )}
      </div>

      {/* Hover shimmer effect */}
      <div className="stat-shimmer" />
    </div>
  );
}