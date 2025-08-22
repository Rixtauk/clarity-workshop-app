import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedStat from './AnimatedStat';
import { Link } from 'react-router-dom';

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
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-[#2f3857] mb-4 tracking-tight uppercase">
            Introducing
          </h3>
          <h3 className="text-4xl md:text-5xl font-bold text-[#2f3857] mb-6 tracking-tight uppercase">
            The Clarity Workshop
          </h3>
          <h3 className="text-2xl font-bold text-[#c8b6a7] mb-12 tracking-tight uppercase">
            The Breakthrough You've Been Waiting For
          </h3>
          
          <div className="space-y-16 max-w-6xl mx-auto">
            {/* First Section */}
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <div className="md:w-2/3">
                <img
                  src="https://www.dropbox.com/scl/fi/thcrusufqi93gz64sc3ew/mockup-image-1.png?rlkey=pkop2q00lteyrhmlgca5zrd4x&st=yipl62bq&raw=1"
                  alt="Workshop Preview"
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={100}
                  label="Minutes of Videos"
                  suffix="+"
                />
                <AnimatedStat
                  endValue={94}
                  label="Positive Reviews"
                  suffix="%"
                />
              </div>
            </div>

            {/* Second Section */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-12">
              <div className="md:w-2/3">
                <video
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                  src="https://www.dropbox.com/scl/fi/g6j31iz7afgd82kts6re5/mockup-video-1.mp4?rlkey=41bgdzq2wib3t77esx6l9q8gp&st=ibshsq7o&raw=1"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={30}
                  label="Pages of Custom Digital Workbook"
                  suffix="+"
                />
                <AnimatedStat
                  endValue={28}
                  label="Lessons"
                />
              </div>
            </div>

            {/* Third Section */}
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <div className="md:w-2/3">
                <video
                  className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                  src="https://www.dropbox.com/scl/fi/6j366qdboulc75uzokia4/mockup-video-2.mp4?rlkey=qjaedc1h64r9lqhk2wlvitvza&st=8iv5curc&raw=1"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 md:w-1/3">
                <AnimatedStat
                  endValue={3}
                  label="in-depth Modules"
                />
                <div className="bg-[#2f3857] p-4 rounded-xl text-white shadow-lg">
                  <div className="text-4xl font-bold mb-1">
                    1 Clear Mind <span className="text-[#c8b6a6] text-2xl">(Yours?)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2f3857] text-white p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.2)] transform hover:-translate-y-1 transition-all duration-500 mt-16">
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              This isn't just another course or podcast. This is a transformative experience that combines thousands of executive coaching hours into a clear framework.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center">
                <h3 className="font-semibold mb-2">Access Yourself</h3>
                <p className="text-white/80">Discover who you are today and what's truly holding you back</p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center">
                <h3 className="font-semibold mb-2">Define Your Path</h3>
                <p className="text-white/80">Create your vision with precision and purpose</p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm text-center">
                <h3 className="font-semibold mb-2">Take Action</h3>
                <p className="text-white/80">Commit to a plan that aligns with your vision</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/checkout"
              className="inline-flex items-center gap-2 bg-[#2f3857] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl pulse-on-hover"
            >
              Start your clarity journey today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}