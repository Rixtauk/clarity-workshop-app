import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScrollingCTA() {
  return (
    <div className="text-center mt-16">
      <Link
        to="/checkout"
        className="inline-flex items-center gap-2 vibrant-cta text-white px-8 py-4 rounded-full font-semibold text-lg gentle-bounce"
      >
        Start your clarity journey today
        <ArrowRight className="w-5 h-5 arrow-icon" />
      </Link>
    </div>
  );
}