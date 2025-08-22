import React from 'react';
import { Target, BarChart2, Heart, Rocket, Award, TrendingUp, Compass } from 'lucide-react';

export default function WorkshopOutcomes() {
  const outcomes = [
    [{
      icon: Target,
      title: "Clear Goals",
      description: "Set achievable goals that excite and motivate you"
    },
    {
      icon: BarChart2,
      title: "Work-Life Balance",
      description: "Build better balance and stop burning out"
    },
    {
      icon: Heart,
      title: "Renewed Purpose",
      description: "Reconnect with what makes you happy and fulfilled"
    }],
    [{
      icon: Rocket,
      title: "Career Momentum",
      description: "Build meaningful momentum in your professional life"
    },
    {
      icon: Award,
      title: "Higher Confidence",
      description: "Finally move outside your comfort zone"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Open up new paths beyond your current limitations"
    }],
    [{
      icon: Compass,
      title: "True Freedom",
      description: "Design your own life trajectory"
    }]
  ];

  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#2f3857] mb-16 tracking-tight uppercase">
            What You'll Gain
          </h2>
          
          <div className="space-y-8">
            {outcomes.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`grid md:grid-cols-${row.length === 3 ? '3' : '1'} gap-6 ${
                  row.length === 1 ? 'max-w-2xl mx-auto' : ''
                }`}
              >
                {row.map((outcome, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#2f3857] flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                        <outcome.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#2f3857] mb-2 text-center">
                      {outcome.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}