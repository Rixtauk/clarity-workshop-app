import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

export default function Reviews() {
  // Animation hooks
  const titleAnimation = useScrollAnimation({
    animationType: 'slide',
    direction: 'up',
    duration: 0.8
  });
  
  const reviewCards = useStaggeredAnimation(4, 0.3, 0.2);
  
  // Mouse tracking for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / centerY * -15;
    const tiltY = (x - centerX) / centerX * 15;
    
    card.style.setProperty('--tilt-x', `${tiltX}deg`);
    card.style.setProperty('--tilt-y', `${tiltY}deg`);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };
  
  const reviews = [
    {
      name: "Jermaine",
      role: "HR Executive",
      image: "https://www.dropbox.com/scl/fi/8h0j6k7zwk3hs4bey5ahq/Jermaine.jpeg?rlkey=hfvo2w1k5eiqtyadnv21ggkef&st=vwoabzd0&raw=1",
      text: "The Digital Coaching Retreat was a game-changer for me. Before joining, I felt lost and overwhelmed, unsure of my true goals and potential. ",
      highlight: "Within just two weeks, I gained incredible clarity about what I really wanted",
      textAfter: " in both my personal and professional life and realised I had been stuck for a while without even noticing."
    },
    {
      name: "Ben",
      role: "Business Owner",
      image: "https://www.dropbox.com/scl/fi/dfv06tvsw3ohtqy1a4nud/Ben.jpeg?rlkey=zuo02ec8nm3aww48m4ivc48id&st=tbwpqf17&raw=1",
      text: "I often feel trapped in the corporate routine, stuck doing the same tasks even after my promotion. ",
      highlight: "Deep down, I know I'm meant for more",
      textAfter: ", but fear of new challenges keeps me from reaching my full potential. This journey has helped me see my weaknesses as opportunities for growth. ",
      highlight2: "I'm learning to take control of my life and now have a clearer idea of what I want to achieve",
      textAfter2: "."
    },
    {
      name: "Nicolas",
      role: "IT Freelancer",
      image: "https://www.dropbox.com/scl/fi/4ji0p9f3xpqt1b27ylfns/nicolas.jpeg?rlkey=toqewxs4t0p7csf25wjjs72x7&st=5yclga0s&raw=1",
      text: "I often felt overwhelmed with so many things to consider in life, but the lessons on prioritisation helped me focus on what truly matters. Overall, ",
      highlight: "the courses were incredibly helpful and informative",
      textAfter: ", and I feel more empowered to manage my goals."
    },
    {
      name: "Ilona",
      role: "Opera Singer",
      image: "https://www.dropbox.com/scl/fi/jw5bvv6wnxc26t9em2mtv/Ilona.jpeg?rlkey=yi88s56e9tyxqdd2wcloxc1bj&st=wwoi02i9&raw=1",
      text: "The videos made it clear why I felt stuck and sparked a strong desire for change, pushing me to step out of my comfort zone. ",
      highlight: "Now, I have a clearer direction and a solid plan to make my goals a reality",
      textAfter: ", not just another list of dreams. What I really love is how this program speaks to everyone from all walks of life."
    }
  ];

  return (
    <section className="bg-gradient-testimonial py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          ref={titleAnimation.ref}
          {...titleAnimation.motionProps}
          className="heading-lg text-center text-[#2f3857] mb-16 gpu-accelerated"
        >
          <span className="bg-gradient-to-r from-[#fd7f4f] to-[#ff6b9d] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2 animate-gradient-x hover-lift">Success</span> Stories from the Last 3 Months
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              ref={reviewCards[index].ref}
              {...reviewCards[index].motionProps}
              className="testimonial-card-3d tilt-follow gpu-optimized"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="testimonial-inner p-8 depth-shadow-hover testimonial-enhanced testimonial-premium light-ray-effect particle-field">
                {/* Quote Mark */}
                <div className="quote-mark">"</div>
                
                {/* Animated gradient accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#fd7f4f] to-[#ff6b9d] glow-layer-1" />
                
                {/* Particle Effects */}
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                
                {/* Star Rating with Shimmer */}
                <div className="stars-container flex items-center gap-2 mb-6 magnetic-hover">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="star-shimmer w-5 h-5 fill-current text-yellow-400 transition-all duration-300 glow-trail" 
                      style={{'--star-index': i} as React.CSSProperties}
                    />
                  ))}
                </div>
                
                {/* Review Text with Reveal Effect */}
                <p className="body-text text-gray-600 mb-8 text-reveal leading-relaxed depth-layer-1">
                  {review.text}
                  <strong className="text-black font-medium hover-underline bg-gradient-to-r from-[#fd7f4f] to-[#ff6b9d] bg-clip-text text-transparent text-lift">
                    {review.highlight}
                  </strong>
                  {review.textAfter}
                  {review.highlight2 && (
                    <>
                      <strong className="text-black font-medium hover-underline bg-gradient-to-r from-[#fd7f4f] to-[#ff6b9d] bg-clip-text text-transparent text-lift">
                        {review.highlight2}
                      </strong>
                      {review.textAfter2}
                    </>
                  )}
                </p>
                
                {/* Profile Section with 3D Effects */}
                <div className="flex items-center gap-4 depth-layer-2">
                  <div className="profile-image-3d profile-border-animated">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#2f3857] glow-layer-2 transition-all duration-400 holographic"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2f3857] subheading text-reveal text-lift">{review.name}</h4>
                    <p className="text-[#2f3857] body-text opacity-80 text-reveal">{review.role}</p>
                  </div>
                </div>
                
                {/* Enhanced Floating Effects */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#fd7f4f]/20 to-[#ff6b9d]/20 rounded-full blur-xl animate-float opacity-50"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-[#ff6b9d]/15 to-[#ff8c42]/15 rounded-full blur-lg animate-float opacity-40" style={{animationDelay: '2s'}}></div>
                
                {/* Subtle sparkle effects */}
                <div className="absolute top-6 right-8 w-1 h-1 bg-[#fd7f4f] rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-10 left-6 w-0.5 h-0.5 bg-[#ff6b9d] rounded-full opacity-50 animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}