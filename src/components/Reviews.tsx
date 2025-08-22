import React from 'react';
import { Star } from 'lucide-react';

export default function Reviews() {
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
    <section className="bg-[#f5f5f5] py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2f3857] mb-16 tracking-tight uppercase">
          <span className="bg-[#fd7f4f] text-black px-4 py-1 rounded-lg inline-block transform -rotate-2">SUCCESS</span> STORIES FROM THE LAST 3 MONTHS
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
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
              <p className="text-gray-600 mb-8 leading-relaxed">
                {review.text}
                <strong className="text-black">
                  {review.highlight}
                </strong>
                {review.textAfter}
                {review.highlight2 && (
                  <>
                    <strong className="text-black">
                      {review.highlight2}
                    </strong>
                    {review.textAfter2}
                  </>
                )}
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#2f3857]"
                />
                <div>
                  <h4 className="font-bold text-[#2f3857] text-lg">{review.name}</h4>
                  <p className="text-[#2f3857] font-medium opacity-80">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}