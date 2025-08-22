import React from 'react';
import { Compass, Target, Lightbulb } from 'lucide-react';
import ScrollingCTA from './ScrollingCTA';

const zoneImages = [
  "https://www.dropbox.com/scl/fi/zdsa08w0rpgou5sj8v9ad/exploration-zone.jpg?rlkey=lzpzixqkrz3vkp9ebh0wxyul4&st=ksarsgkn&raw=1",
  "https://www.dropbox.com/scl/fi/69qp0afptzat05waapu3j/focus-zone.png?rlkey=4b6d3gkfpigoyn7n81yk3b4lf&st=67wgh89y&raw=1",
  "https://www.dropbox.com/scl/fi/lvmhlln7cqzhob5plmrm8/decision-zone-69.jpg?rlkey=62b94ixbnfck8rz1h7598chah&st=v1o12s66&raw=1"
];

export default function WorkshopIntro() {
  const modules = [
    {
      icon: Compass,
      title: "1 - Exploration Zone",
      accent: "#c8b6a6",
      description: [
        "Take a fresh look at your past, assess your present, and envision your future",
        "Identify the patterns and beliefs keeping you stuck",
        "Gain a deep understanding of who you are and what matters most"
      ]
    },
    {
      icon: Target,
      title: "2 - Focus Zone",
      accent: "#c8b6a6",
      description: [
        "Pinpoint your 4 critical blockers",
        "Dive deep into the 4 key dimensions of who you are: Mind, Body, Heart and Spirit",
        "Build the tools to transform these challenges into strengths"
      ]
    },
    {
      icon: Lightbulb,
      title: "3 - Decision Zone",
      accent: "#c8b6a6",
      description: [
        "Get clear on what you want—and why you want it",
        "Create a step-by-step plan for meaningful change",
        "Leave with confidence, clarity, and direction for your next chapter"
      ]
    }
  ];

  return (
    <section className="bg-[#2f3857] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 font-['Helvetica Neue']">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight uppercase font-['Helvetica Neue']">
            YOUR 3-STEP JOURNEY TO CLARITY
          </h2>
          <p className="text-[#c8b6a6] text-2xl font-bold uppercase tracking-tight mb-16">
            Here is what you'll experience:
          </p>
        </div>

        <div className="space-y-24 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <div 
              key={index}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/2">
                <div className="bg-white/10 p-8 rounded-xl shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] hover:shadow-[0_30px_60px_rgba(0,_0,_0,_0.4)] transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold mb-8 flex items-center gap-4">
                    <div className="bg-[#3a435d] w-12 h-12 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-500 flex-shrink-0">
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    {module.title.toUpperCase()}
                  </h3>
                  <div className="text-white space-y-4">
                    {module.description.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#c8b6a6] rounded-full flex-shrink-0 mt-2" />
                        <span className="text-left">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src={zoneImages[index]}
                  alt={`${module.title} illustration`}
                  className="w-full h-[400px] object-cover rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                />
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-lg text-white/80 mt-16 font-semibold max-w-3xl mx-auto font-['Helvetica Neue']">
          By the end of the workshop, you won't just know where you're going—you'll have the tools to get there.
        </p>
        <ScrollingCTA />
      </div>
    </section>
  );
}