import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScrollingCTA() {
  return (
    <div className="text-center mt-16">
      <Link
        to="/checkout"
        className="inline-flex items-center gap-2 bg-white text-[#49506a] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl pulse-on-hover"
      >
        Start your clarity journey today
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}