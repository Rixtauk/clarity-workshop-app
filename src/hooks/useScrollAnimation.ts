import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export interface AnimationConfig {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const useScrollAnimation = (config: AnimationConfig = {}) => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    duration = 0.6,
    animationType = 'fade',
    direction = 'up'
  } = config;

  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [inView, delay]);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-[${Math.round(duration * 1000)}ms]`;
    
    if (!isVisible) {
      switch (animationType) {
        case 'fade':
          return `${baseClasses} ${durationClass} opacity-0`;
        case 'slide':
          const slideDistance = '2rem';
          const slideClasses = {
            up: `translate-y-${slideDistance}`,
            down: `-translate-y-${slideDistance}`,
            left: `translate-x-${slideDistance}`,
            right: `-translate-x-${slideDistance}`
          };
          return `${baseClasses} ${durationClass} opacity-0 ${slideClasses[direction]}`;
        case 'scale':
          return `${baseClasses} ${durationClass} opacity-0 scale-95`;
        case 'bounce':
          return `${baseClasses} ${durationClass} opacity-0 scale-95 -translate-y-4`;
        default:
          return `${baseClasses} ${durationClass} opacity-0`;
      }
    } else {
      return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }
  };

  const getMotionProps = () => ({
    initial: getInitialState(),
    animate: isVisible ? getVisibleState() : getInitialState(),
    transition: { duration, delay: delay / 1000, ease: "easeOut" }
  });

  const getInitialState = () => {
    switch (animationType) {
      case 'fade':
        return { opacity: 0 };
      case 'slide':
        const slideAmount = 32;
        return {
          opacity: 0,
          y: direction === 'up' ? slideAmount : direction === 'down' ? -slideAmount : 0,
          x: direction === 'left' ? slideAmount : direction === 'right' ? -slideAmount : 0
        };
      case 'scale':
        return { opacity: 0, scale: 0.95 };
      case 'bounce':
        return { opacity: 0, scale: 0.95, y: 16 };
      default:
        return { opacity: 0 };
    }
  };

  const getVisibleState = () => {
    return { opacity: 1, y: 0, x: 0, scale: 1 };
  };

  return {
    ref,
    inView,
    isVisible,
    animationClasses: getAnimationClasses(),
    motionProps: getMotionProps()
  };
};

export const useStaggeredAnimation = (itemCount: number, baseDelay: number = 0, staggerDelay: number = 0.1) => {
  const animations = [];
  
  for (let i = 0; i < itemCount; i++) {
    animations.push(
      useScrollAnimation({
        delay: (baseDelay + i * staggerDelay) * 1000,
        triggerOnce: true,
        threshold: 0.1
      })
    );
  }
  
  return animations;
};

export const useCountUp = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const startValue = 0;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [inView, target, duration]);

  return { ref, count, inView };
};

export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    const throttledHandleScroll = throttle(handleScroll, 16); // ~60fps
    
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [speed]);

  return offset;
};

// Throttle utility function
const throttle = (func: Function, delay: number) => {
  let timeoutId: number | null = null;
  let lastExecTime = 0;
  
  return (...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};