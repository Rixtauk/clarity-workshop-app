import React from 'react';
import { Clock, Target, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

export default function StorySelling() {
  // Animation hooks for staggered content blocks
  const titleAnimation = useScrollAnimation({
    animationType: 'slide',
    direction: 'up',
    duration: 0.8
  });
  
  const storyBlocks = useStaggeredAnimation(6, 0.2, 0.15);
  
  return (
    <section className="bg-[#1e2a47] text-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            ref={titleAnimation.ref}
            {...titleAnimation.motionProps}
            className="heading-lg text-center gpu-accelerated"
          >
            How Much Is Your Lack of Clarity Costing You?
          </motion.h2>
          <div className="h-12" />
          
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div 
              ref={storyBlocks[0].ref}
              {...storyBlocks[0].motionProps}
              className="bg-white/10 p-8 rounded-xl backdrop-blur-sm gradient-overlay-light hover-gradient-coral hover-lift gpu-accelerated"
            >
              <h3 className="heading-md font-light mb-6 text-center">
                Does this sound like you?
              </h3>
              <p className="subheading mb-6 text-center md:text-left">
                You're sitting at your desk, scrolling aimlessly, asking yourself—What am I doing with my life? Months pass, maybe years, and you're still stuck in the same place.
              </p>
              <p className="subheading text-center md:text-left">
                You tell yourself you'll figure it out... someday. But deep down, you know that "someday" needs to be today.
              </p>
            </motion.div>

            {/* Section 1: Mark's emptiness */}
            <motion.div 
              ref={storyBlocks[1].ref}
              {...storyBlocks[1].motionProps}
              className="bg-white/10 p-8 rounded-xl backdrop-blur-sm gradient-overlay-coral hover-gradient-coral hover-lift gpu-accelerated"
            >
              <p className="subheading text-center md:text-left">
                Mark was 38 — a successful architect on paper, but inside, he felt <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-medium hover-lift">empty</span>. Every day felt like a repeat. The passion was gone. He should have been happy, but deep down, he knew something was missing.
              </p>
            </motion.div>

            {/* Section 2: Finding clarity */}
            <motion.div 
              ref={storyBlocks[2].ref}
              {...storyBlocks[2].motionProps}
              className="bg-white/10 p-8 rounded-xl backdrop-blur-sm gradient-overlay-light hover-gradient-coral hover-lift gpu-accelerated"
            >
              <p className="subheading text-center md:text-left">
                He felt stuck, unsure where to start. But within weeks of diving into the core framework of this workshop, Mark uncovered the hidden beliefs holding him back. He <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-medium hover-lift">reconnected</span> with what truly mattered.
              </p>
            </motion.div>

            <motion.div 
              ref={storyBlocks[3].ref}
              {...storyBlocks[3].motionProps}
              className="w-full rounded-xl overflow-hidden shadow-2xl image-gradient-overlay hover-zoom gpu-accelerated"
            >
              <img
                src="https://www.dropbox.com/scl/fi/ruhu511zh5rdjfvsvgp9q/unclear.jpeg?rlkey=czd4jbke6h7jfevezpkt92vlq&st=83kz4f8a&raw=1"
                alt="Representing life without clarity"
                className="w-full h-auto object-cover transition-transform duration-500"
              />
            </motion.div>
            
            {/* Section 3: Transformation */}
            <motion.div 
              ref={storyBlocks[4].ref}
              {...storyBlocks[4].motionProps}
              className="bg-white/10 p-8 rounded-xl backdrop-blur-sm gradient-overlay-coral hover-gradient-coral hover-lift gpu-accelerated"
            >
              <p className="subheading text-center md:text-left">
                Six months later, he wasn't just designing buildings — he was leading bold, purpose-driven projects. His energy was back. His focus sharper. And for the first time in years, he felt fully <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-medium hover-lift">aligned</span> with his path.
              </p>
            </motion.div>

            <motion.div 
              ref={storyBlocks[5].ref}
              {...storyBlocks[5].motionProps}
              className="bg-brand-navy p-8 rounded-xl text-center max-w-2xl mx-auto shadow-xl gradient-overlay-navy hover-gradient-lift hover-tilt gpu-accelerated"
            >
              <p className="heading-md font-light mb-4">
                If you're feeling stuck or unfulfilled, you're not alone.
              </p>
              <p className="heading-md font-medium text-[#c8b6a6]">
                In 2025, it's time to change that.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}