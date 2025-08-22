import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "How long will the workshop take?",
      answer: "The Clarity Workshop is designed to be completed in 4–5 hours. You can finish it in one sitting or break it up over a weekend—whatever works best for you."
    },
    {
      question: "What happens after I purchase?",
      answer: "You'll receive instant access to the workshop materials and can get started right away."
    },
    {
      question: "Is this workshop live?",
      answer: "No, this is a self-paced digital workshop that you can complete on your own schedule."
    },
    {
      question: "What if I'm not sure I want to do it?",
      answer: "Then don’t do it! The workshop is for people who really want to make a change in their life."
    }
  ];

  return (
    <section className="bg-[#2f3857] py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16 tracking-tight uppercase font-['Helvetica Neue']">
          GOT QUESTIONS? WE'VE GOT ANSWERS
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:text-[#c8b6a6] transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 py-4">
                  <p className="text-white/80">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}