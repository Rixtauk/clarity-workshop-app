import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedStat from './AnimatedStat';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const scrollToPricing = (e: React.MouseEvent) => {
  e.preventDefault();
  const pricingSection = document.querySelector('#pricing');
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function IntroducingWorkshop() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Animation hooks
  const titleAnimation = useScrollAnimation({
    animationType: 'slide',
    direction: 'up',
    duration: 0.8
  });
  
  const contentSections = useStaggeredAnimation(3, 0.3, 0.2);
  const processSteps = useStaggeredAnimation(3, 0.5, 0.15);
  
  const ctaAnimation = useScrollAnimation({
    animationType: 'bounce',
    duration: 0.8,
    delay: 800
  });

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate how far the element is through the viewport
        const progress = (windowHeight - elementTop) / (windowHeight + elementHeight);
        
        // Limit the progress to 0-1 range
        const clampedProgress = Math.max(0, Math.min(1, progress));
        
        // Calculate rotation values
        const baseRotateX = 10; // Initial uptilt
        const rotateY = (clampedProgress - 0.5) * 20; // Swivel left to right
        
        imageRef.current.style.transform = `
          perspective(1000px) 
          rotateX(${baseRotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set starting position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="bg-gradient-section-light py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            ref={titleAnimation.ref}
            {...titleAnimation.motionProps}
            className="gpu-accelerated"
          >
            <h3 className="heading-lg text-[#2f3857] mb-4">
              Introducing
            </h3>
            <h3 className="heading-xl text-[#2f3857] mb-6">
              The Clarity Workshop
            </h3>
            <h3 className="heading-md font-medium text-[#c8b6a7] mb-12">
              The Breakthrough You've Been Waiting For
            </h3>
          </motion.div>
          
          <div className="space-y-16 max-w-6xl mx-auto">
            {/* First Section */}
            <motion.div 
              ref={contentSections[0].ref}
              {...contentSections[0].motionProps}
              className="flex flex-col sm:flex-row items-center gap-12 gpu-accelerated"
            >
              <div className="md:w-2/3">
                <div className="image-gradient-overlay rounded-xl hover-zoom">
                  <img
                    src="https://www.dropbox.com/scl/fi/thcrusufqi93gz64sc3ew/mockup-image-1.png?rlkey=pkop2q00lteyrhmlgca5zrd4x&st=yipl62bq&raw=1"
                    alt="Workshop Preview"
                    className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={100}
                  label="Minutes of Videos"
                  suffix="+"
                  icon="target"
                  delay={200}
                />
                <AnimatedStat
                  endValue={94}
                  label="Positive Reviews"
                  suffix="%"
                  icon="star"
                  isPercentage={true}
                  delay={400}
                />
              </div>
            </motion.div>

            {/* Second Section */}
            <motion.div 
              ref={contentSections[1].ref}
              {...contentSections[1].motionProps}
              className="flex flex-col sm:flex-row-reverse items-center gap-12 gpu-accelerated"
            >
              <div className="md:w-2/3">
                <div className="image-gradient-overlay rounded-xl hover-zoom">
                  <video
                    className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
                    src="https://www.dropbox.com/scl/fi/g6j31iz7afgd82kts6re5/mockup-video-1.mp4?rlkey=41bgdzq2wib3t77esx6l9q8gp&st=ibshsq7o&raw=1"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={30}
                  label="Pages of Custom Digital Workbook"
                  suffix="+"
                  icon="book"
                  delay={600}
                />
                <AnimatedStat
                  endValue={28}
                  label="Lessons"
                  icon="users"
                  delay={800}
                />
              </div>
            </motion.div>

            {/* Third Section */}
            <motion.div 
              ref={contentSections[2].ref}
              {...contentSections[2].motionProps}
              className="flex flex-col sm:flex-row items-center gap-12 gpu-accelerated"
            >
              <div className="md:w-2/3">
                <div className="image-gradient-overlay rounded-xl hover-zoom">
                  <video
                    className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
                    src="https://www.dropbox.com/scl/fi/6j366qdboulc75uzokia4/mockup-video-2.mp4?rlkey=qjaedc1h64r9lqhk2wlvitvza&st=8iv5curc&raw=1"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={3}
                  label="in-depth Modules"
                  icon="check"
                  delay={1000}
                />
                <div className="bg-[#2f3857] p-6 rounded-xl text-white shadow-lg hover-lift relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  {/* Animated background particles */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-3xl font-bold mb-2 stat-number">
                      1 Clear Mind 
                    </div>
                    <div className="text-[#c8b6a6] text-lg">
                      (Yours?)
                    </div>
                  </div>
                  
                  {/* Completion wave effect */}
                  <div className="completion-wave delay-1200"></div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="bg-[#2f3857] text-white p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.2)] transform hover:-translate-y-1 transition-all duration-500 mt-16 gradient-overlay-navy">
            <p className="subheading mb-8">
              This isn't just another course or podcast. This is a transformative experience that combines thousands of executive coaching hours into a clear framework.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <motion.div 
                ref={processSteps[0].ref}
                {...processSteps[0].motionProps}
                className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center gradient-overlay-coral hover-gradient-coral hover-lift gpu-accelerated"
              >
                <h3 className="subheading mb-2">Access Yourself</h3>
                <p className="body-text text-white/80">Discover who you are today and what's truly holding you back</p>
              </motion.div>
              
              <motion.div 
                ref={processSteps[1].ref}
                {...processSteps[1].motionProps}
                className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center gradient-overlay-light hover-gradient-coral hover-lift gpu-accelerated"
              >
                <h3 className="subheading mb-2">Define Your Path</h3>
                <p className="body-text text-white/80">Create your vision with precision and purpose</p>
              </motion.div>
              
              <motion.div 
                ref={processSteps[2].ref}
                {...processSteps[2].motionProps}
                className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center gradient-overlay-coral hover-gradient-coral hover-lift gpu-accelerated"
              >
                <h3 className="subheading mb-2">Take Action</h3>
                <p className="body-text text-white/80">Commit to a plan that aligns with your vision</p>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            ref={ctaAnimation.ref}
            {...ctaAnimation.motionProps}
            className="text-center mt-12 gpu-accelerated"
          >
            <Link
              to="/checkout"
              className="inline-flex items-center gap-2 dark-cta text-white px-8 py-4 rounded-full font-medium text-lg gentle-bounce hover-lift shimmer-effect"
            >
              Start Your Clarity Journey Today
              <ArrowRight className="w-5 h-5 arrow-icon" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}