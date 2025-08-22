import React from 'react';
import { Users, Newspaper, MapPin, Music } from 'lucide-react';

export default function Coach() {
  const achievements = [
    {
      icon: Users,
      text: "Helped 100+ professionals find their direction"
    },
    {
      icon: Newspaper,
      text: "Featured in The Times, Forbes and CEO Today"
    },
    {
      icon: MapPin,
      text: "Currently working between London, Majorca and Miami"
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="https://www.dropbox.com/scl/fi/5yedadf8u3c0v3q4rhzxg/alex-image.jpeg?rlkey=ivas4dk28t6sz8m9j3ur20js0&st=n5mlan6p&raw=1"
              alt="Alex Kergall"
              className="rounded-xl shadow-2xl w-full object-cover aspect-[4/5]"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-[#1e2a47] mb-6 tracking-tight uppercase text-left">
              Meet your <span className="bg-[#fd7f4f] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2">Coach</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-left">
              Alex Kergall is a renowned life coach who has dedicated his career to helping CEOs, Entrepreneurs and Elite Athletes to break through their mental limitations and achieve clarity in their life's direction.
            </p>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-4 text-left">
                  <achievement.icon className="w-8 h-8 text-[#c8b6a6]" />
                  <span className="text-gray-700">{achievement.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}