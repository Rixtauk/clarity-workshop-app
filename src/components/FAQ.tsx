import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  
  // Animation hooks
  const titleAnimation = useScrollAnimation({
    animationType: 'slide',
    direction: 'up',
    duration: 0.8
  });
  
  const faqItems = useStaggeredAnimation(4, 0.3, 0.15);

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
      answer: "Then don't do it! The workshop is for people who really want to make a change in their life."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="bg-brand-navy py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          ref={titleAnimation.ref}
          {...titleAnimation.motionProps}
          className="heading-lg text-center text-white mb-16 gpu-accelerated"
        >
          Got Questions? We've Got Answers
        </motion.h2>
        
        <motion.div 
          className="max-w-3xl mx-auto space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              ref={faqItems[index].ref}
              {...faqItems[index].motionProps}
              variants={itemVariants}
              className={`faq-card ${
                openIndex === index ? 'faq-card-active' : 'faq-card-inactive'
              } gpu-accelerated`}
            >
              {/* Question Number */}
              <div className="faq-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <button
                className="faq-button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="faq-question-text">{faq.question}</span>
                
                <motion.div 
                  className="faq-icon-container"
                  animate={{ 
                    rotate: openIndex === index ? 180 : 0,
                    scale: openIndex === index ? 1.1 : 1,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20 
                  }}
                >
                  <AnimatePresence mode="wait">
                    {openIndex === index ? (
                      <motion.div
                        key="minus"
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Minus className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="plus"
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className="faq-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: 'auto', 
                      opacity: 1,
                      transition: {
                        height: { type: "spring", stiffness: 200, damping: 25 },
                        opacity: { delay: 0.1, duration: 0.3 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { type: "spring", stiffness: 200, damping: 25 },
                        opacity: { duration: 0.15 }
                      }
                    }}
                  >
                    <motion.div
                      className="px-6 py-4"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        transition: { delay: 0.15, type: "spring", stiffness: 150, damping: 20 }
                      }}
                      exit={{ 
                        y: -10, 
                        opacity: 0,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <p className="body-text text-white/80">{faq.answer}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active border glow */}
              {openIndex === index && (
                <motion.div
                  className="faq-glow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.1, duration: 0.4 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.8,
                    transition: { duration: 0.2 }
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}