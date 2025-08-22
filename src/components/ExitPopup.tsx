import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ExitPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitPopup({ isOpen, onClose }: ExitPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 text-center">
          <h2 className="text-3xl font-bold text-[#2f3857] mb-2">Feeling Stuck But Not Sure Why?</h2>
          <h3 className="text-xl text-[#fd7f4f] font-semibold mb-4">4 quick questions reveal your hidden blocker</h3>
          
          <p className="text-gray-700 mb-6">
            In less time than it takes to make coffee, you'll pinpoint exactly what's keeping you from moving forward. 
            Join thousands who've found their clarity starting point.
          </p>
          
          <a
            href="https://clarity-workshop-questionnaire.netlify.app/"
            className="block w-full bg-[#2f3857] text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-[#3b435d] transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            Find My Blocker Now →
          </a>
          
          <p className="text-center text-sm text-gray-500 mt-3">
            Quick assessment • Personalised insights • 100% free
          </p>
        </div>
      </div>
    </div>
  );
}