import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
  // Mouse tracking for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / centerY * -12;
    const tiltY = (x - centerX) / centerX * 12;
    
    card.style.setProperty('--tilt-x', `${tiltX}deg`);
    card.style.setProperty('--tilt-y', `${tiltY}deg`);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  const testimonials = [
    {
      text: "The Digital Coaching Retreat was a game-changer for me. Before joining, I felt lost and overwhelmed, unsure of my true goals and potential. Within just two weeks, I gained incredible clarity about what I really wanted in both my personal and professional life and realised I had been stuck for a while without even noticing.",
      author: "Sarah Chen",
      role: "Marketing Director",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      text: "I often feel trapped in the corporate routine, stuck doing the same tasks even after my promotion. Deep down, I know I'm meant for more, but fear of new challenges keeps me from reaching my full potential. This journey has helped me see my weaknesses as opportunities for growth. I'm learning to take control of my life and now have a clearer idea of what I want to achieve.",
      author: "Thomas Chen",
      role: "Project Lead",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      text: "I often felt overwhelmed with so many things to consider in life, but the lessons on prioritisation helped me focus on what truly matters. Overall, the courses were incredibly helpful and informative, and I feel more empowered to manage my goals.",
      author: "Rachel Martinez",
      role: "Senior Manager",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      text: "The videos made it clear why I felt stuck and sparked a strong desire for change, pushing me to step out of my comfort zone. Now, I have a clearer direction and a solid plan to make my goals a reality, not just another list of dreams. What I really love is how this program speaks to everyone from all walks of life.",
      author: "Sarah Williams",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  return (
    <section className="bg-gradient-section-light py-12">
      <div className="container mx-auto px-4">
        <h2 className="heading-lg text-center text-[#2f3857] mb-16">
          Success Stories
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card-3d tilt-follow gpu-optimized"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="testimonial-inner p-8 depth-shadow-hover testimonial-enhanced testimonial-premium light-ray-effect particle-field morph-border">
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
                  {testimonial.text}
                </p>
                
                {/* Profile Section with 3D Effects */}
                <div className="flex items-center gap-4 depth-layer-2">
                  <div className="profile-image-3d profile-border-animated">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#2f3857] glow-layer-2 transition-all duration-400 glass-shadow"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2f3857] subheading text-reveal text-lift">{testimonial.author}</h4>
                    <p className="text-[#2f3857] body-text opacity-80 text-reveal">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Enhanced Floating Effects */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#fd7f4f]/20 to-[#ff6b9d]/20 rounded-full blur-xl animate-float opacity-50"></div>
                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-r from-[#ff8c42]/15 to-[#fd7f4f]/15 rounded-full blur-lg animate-float opacity-30" style={{animationDelay: '1.5s'}}></div>
                
                {/* Premium sparkle effects */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-[#fd7f4f] rounded-full opacity-40 animate-pulse glow-trail"></div>
                <div className="absolute bottom-6 right-6 w-1 h-1 bg-[#ff6b9d] rounded-full opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/3 right-4 w-0.5 h-0.5 bg-[#ff8c42] rounded-full opacity-30 animate-pulse" style={{animationDelay: '2.5s'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}