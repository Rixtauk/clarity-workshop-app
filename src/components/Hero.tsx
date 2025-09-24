import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation, useParallax } from '../hooks/useScrollAnimation';

const scrollToPricing = (e: React.MouseEvent) => {
  e.preventDefault();
  const pricingSection = document.querySelector('#pricing');
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isClickingPlay, setIsClickingPlay] = React.useState(false);
  
  // Animation hooks
  const titleAnimation = useScrollAnimation({
    animationType: 'slide',
    direction: 'up',
    duration: 0.8,
    delay: 200
  });
  
  const subtitleAnimation = useScrollAnimation({
    animationType: 'fade',
    duration: 0.6,
    delay: 400
  });
  
  const videoAnimation = useScrollAnimation({
    animationType: 'scale',
    duration: 0.8,
    delay: 600
  });
  
  const ctaAnimation = useScrollAnimation({
    animationType: 'bounce',
    duration: 0.8,
    delay: 800
  });
  
  const parallaxOffset = useParallax(-0.2);

  const handlePlayClick = () => {
    if (videoRef.current && !isClickingPlay) {
      setIsClickingPlay(true);
      // Delay the video start to allow button animation
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }, 250);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero-geometric text-[#2f3857] overflow-hidden">
      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#fd7f4f]/20 to-[#ff6b9d]/20 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#ff6b9d]/20 to-[#fd7f4f]/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-gradient-to-br from-[#fd7f4f]/20 to-[#ff6b9d]/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <motion.div 
        className="absolute top-8 left-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="https://www.dropbox.com/scl/fi/pyk18qtsbjf7ke5xn7rmi/Main-Logo-Black-V2.png?rlkey=ls326jwilxju7hy08xqnyxckf&st=snot4one&raw=1"
          alt="The Clarity Workshop"
          className="h-5 md:h-8 object-contain hover-lift"
        />
      </motion.div>
      
      <div className="container mx-auto px-4 pt-24 md:py-24 flex flex-col items-center text-center">
        <motion.h1 
          ref={titleAnimation.ref}
          {...titleAnimation.motionProps}
          className="heading-xl mb-6 md:mb-8 text-black max-w-4xl flex flex-col items-center gpu-accelerated"
        >
          <span className="flex items-center gap-2">
            Feeling <span className="bg-gradient-to-r from-[#fd7f4f] to-[#ff6b9d] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2 animate-gradient-x hover-lift">Lost?</span>
          </span>
          Let's Change That.
        </motion.h1>
        <motion.div 
          ref={subtitleAnimation.ref}
          {...subtitleAnimation.motionProps}
          className="subheading mb-8 md:mb-12 text-black max-w-3xl px-4 space-y-2 gpu-accelerated"
        >
          <p>Start living with purpose & direction.</p>
          <p>Workshop delivered by award winning coach Alex Kergall</p>
        </motion.div>
        <motion.div 
          ref={videoAnimation.ref}
          {...videoAnimation.motionProps}
          className="w-full max-w-4xl mx-4 gpu-accelerated"
        >
          <div className="gradient-border hover-lift">
            <div className="video-container-glass rounded-[17px] p-4 md:p-6">
              <div className="relative pb-[56.25%] video-frame group">
                <video
                  ref={videoRef}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src="https://www.dropbox.com/scl/fi/nknsspo0l16aozibu6zrx/Landing-Page-Hero-Video.mp4?rlkey=i1r3d612c1edgazsnj4of2vri&st=qeciha5d&raw=1"
                  controls
                  poster="https://www.dropbox.com/scl/fi/czqo7elwmsrpxh988dm6p/WhatsApp-Image-2024-12-11-at-12.28.10.jpeg?rlkey=18slzivt6p1zh27drk6c2l7lf&st=n1ky2vep&raw=1"
                >
                  Your browser does not support the video tag.
                </video>
                <div 
                  className={`absolute inset-0 video-overlay cursor-pointer fade-transition ${
                    isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  onClick={handlePlayClick}
                />
                <div 
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer fade-transition ${
                    isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  } ${isClickingPlay ? 'play-button-fade-out' : ''}`}
                  onClick={handlePlayClick}
                >
                  <div className="modern-play-button w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-[#2f3857] border-b-[15px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div 
          ref={ctaAnimation.ref}
          {...ctaAnimation.motionProps}
          className="mt-8 md:mt-12 text-center px-4 gpu-accelerated"
        >
          <Link
            to="/checkout"
            className="dark-cta text-white px-10 py-5 rounded-[20px] font-semibold text-2xl md:text-3xl w-full md:w-auto inline-block gentle-bounce hover-lift shimmer-effect"
          >
            <span className="flex flex-col items-center">
              <span className="font-semibold">Start Your Clarity Journey Today</span>
              <span className="text-base font-light mt-1">Just $197 Today</span>
            </span>
          </Link>
          <motion.div 
            className="mt-4 body-text"
            initial={{ opacity: 0, y: 10 }}
            animate={ctaAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <span className="text-gray-500"><span className="line-through">$997</span></span>
            <span className="text-[#2f3857] ml-2 font-medium hover-underline">Save 80%</span>
          </motion.div>
          <motion.div 
            className="mt-3 body-text text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={ctaAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.4, duration: 0.4 }}
          >
            <p>(Content valued at $3,000 in 1:1 sessions with Alex)</p>
            <p>One-time payment. Unlimited access. No hidden fees.</p>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-navy" />
    </section>
  );
}