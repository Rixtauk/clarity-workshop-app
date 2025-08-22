import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Purchase() {
  const benefitFeatures = [
    "Get clear on what you really want in life",
    "Build higher self-confidence",
    "Design your own life trajectory",
    "Build better work life harmony for the long run",
    "Create a renewed momentum in your career"
  ];

  const packageFeatures = [
    "Unlimited access to workshop materials",
    "3 comprehensive modules with practical assessments",
    "Unlimited access to 100+ minutes of videos",
    "28 actionable videos",
    "14-day money-back guarantee"
  ];

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center transform hover:-translate-y-2 transition-all duration-500">
          <div className="bg-[#2f3857] text-white p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] hover:shadow-[0_30px_60px_rgba(0,_0,_0,_0.4)] transition-all duration-500">
            {/* Title and Image Row */}
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              {/* Left: Title and Price */}
              <div className="md:w-1/2 text-left">
                <h2 className="text-4xl font-bold mb-4 tracking-tight uppercase font-['Helvetica Neue']">
                  The Clarity Workshop
                </h2>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-400 line-through text-2xl">$997</span>
                  <span className="text-5xl font-bold transition-all duration-300 group-hover:scale-110">$197</span>
                </div>
              </div>
              
              {/* Right: Image */}
              <div className="md:w-1/2">
                <img
                  src="https://www.dropbox.com/scl/fi/677xkcp55jhse3qgjcyd5/clarity-workshop-thumbnail.jpg?rlkey=hg9kpsbt2bloj7962v9scoxb9&st=w44z4yar&raw=1"
                  alt="The Clarity Workshop Preview"
                  className="rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 w-full"
                />
              </div>
            </div>
            
            {/* Two Columns of Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Left Column: Benefits */}
              <div className="text-left">
                <ul className="space-y-4">
                  {benefitFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Right Column: Package Features */}
              <div className="text-left">
                <ul className="space-y-4">
                  {packageFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Centered CTA Button */}
            <Link 
              to="/checkout"
              className="bg-[#fd7f4f] text-white px-8 py-4 rounded-full font-semibold text-xl transition-all duration-300 flex items-center justify-center gap-2 w-full max-w-md mx-auto shadow-lg hover:shadow-xl pulse-on-hover"
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