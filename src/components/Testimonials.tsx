import React from 'react';
import { Star } from 'lucide-react';

export default function Testimonials() {
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
    <section className="bg-[#f5f5f5] py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2f3857] mb-16 tracking-tight uppercase">
          SUCCESS STORIES
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#2f3857]" />
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#2f3857]"
                />
                <div>
                  <h4 className="font-bold text-[#2f3857] text-lg">{testimonial.author}</h4>
                  <p className="text-[#c8b6a6] font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}