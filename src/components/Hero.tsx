import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

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

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#e7e7e7] text-[#2f3857]">
      <div className="absolute top-8 left-8">
        <img
          src="https://www.dropbox.com/scl/fi/pyk18qtsbjf7ke5xn7rmi/Main-Logo-Black-V2.png?rlkey=ls326jwilxju7hy08xqnyxckf&st=snot4one&raw=1"
          alt="The Clarity Workshop"
          className="h-5 md:h-8 object-contain"
        />
      </div>
      
      <div className="container mx-auto px-4 pt-24 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight tracking-tight text-black max-w-4xl flex flex-col items-center">
          <span className="flex items-center gap-2">
            Feeling <span className="bg-[#FF7F50] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2">Lost?</span>
          </span>
          Let's Change That.
        </h1>
        <div className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 text-black max-w-3xl uppercase tracking-tight px-4 space-y-2">
          <p>Start Living with purpose & direction.</p>
          <p>Workshop delivered by award winning coach Alex Kergall</p>
        </div>
        <div className="w-full max-w-4xl bg-white/50 rounded-xl p-3 md:p-6 shadow-lg mx-4">
          <div className="relative pb-[56.25%] rounded-xl overflow-hidden group">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.dropbox.com/scl/fi/nknsspo0l16aozibu6zrx/Landing-Page-Hero-Video.mp4?rlkey=i1r3d612c1edgazsnj4of2vri&st=qeciha5d&raw=1"
              controls
              poster="https://www.dropbox.com/scl/fi/czqo7elwmsrpxh988dm6p/WhatsApp-Image-2024-12-11-at-12.28.10.jpeg?rlkey=18slzivt6p1zh27drk6c2l7lf&st=n1ky2vep&raw=1"
            >
              Your browser does not support the video tag.
            </video>
            <div 
              className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300 cursor-pointer"
              onClick={handlePlayClick}
              style={{ display: isPlaying ? 'none' : 'block' }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handlePlayClick}
              style={{ display: isPlaying ? 'none' : 'flex' }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center transform translate-x-2 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-[#2f3857] border-b-[15px] border-b-transparent" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-12 text-center px-4">
          <Link
            to="/checkout"
            className="bg-[#2f3857] text-white px-10 py-5 rounded-[20px] font-bold text-2xl md:text-3xl transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto pulse-on-hover inline-block"
          >
            <span className="flex flex-col items-center">
              <span className="uppercase tracking-wide">Start your clarity journey today</span>
              <span className="text-base font-normal mt-1">Just $197 Today</span>
            </span>
          </Link>
          <div className="mt-4 text-base">
            <span className="text-gray-500"><span className="line-through">$997</span></span>
            <span className="text-[#2f3857] ml-2 font-semibold">Save 80%</span>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <p>(Content valued at $3,000 in 1:1 sessions with Alex)</p>
            <p>One-time payment. Unlimited access. No hidden fees.</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2f3857]" />
    </section>
  );
}