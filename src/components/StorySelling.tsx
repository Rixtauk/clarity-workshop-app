import React from 'react';
import { Clock, Target, Lock } from 'lucide-react';

export default function StorySelling() {
  return (
    <section className="bg-[#1e2a47] text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
            HOW MUCH IS YOUR LACK OF CLARITY COSTING YOU?
          </h2>
          <div className="h-12" />
          
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-light mb-6 text-center">
                Does this sound like you?
              </h3>
              <p className="text-lg md:text-xl mb-6 leading-relaxed text-center md:text-left">
                You're sitting at your desk, scrolling aimlessly, asking yourself—What am I doing with my life? Months pass, maybe years, and you're still stuck in the same place.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-center md:text-left">
                You tell yourself you'll figure it out... someday. But deep down, you know that "someday" needs to be today.
              </p>
            </div>

            {/* Section 1: Mark's emptiness */}
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <p className="text-lg md:text-xl leading-relaxed text-center md:text-left">
                Mark was 38 — a successful architect on paper, but inside, he felt <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-semibold">empty</span>. Every day felt like a repeat. The passion was gone. He should have been happy, but deep down, he knew something was missing.
              </p>
            </div>

            {/* Section 2: Finding clarity */}
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <p className="text-lg md:text-xl leading-relaxed text-center md:text-left">
                He felt stuck, unsure where to start. But within weeks of diving into the core framework of this workshop, Mark uncovered the hidden beliefs holding him back. He <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-semibold">reconnected</span> with what truly mattered.
              </p>
            </div>

            <div className="w-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://www.dropbox.com/scl/fi/ruhu511zh5rdjfvsvgp9q/unclear.jpeg?rlkey=czd4jbke6h7jfevezpkt92vlq&st=83kz4f8a&raw=1"
                alt="Representing life without clarity"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Section 3: Transformation */}
            <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
              <p className="text-lg md:text-xl leading-relaxed text-center md:text-left">
                Six months later, he wasn't just designing buildings — he was leading bold, purpose-driven projects. His energy was back. His focus sharper. And for the first time in years, he felt fully <span className="bg-[#fd7f4f] text-black px-2 py-1 rounded font-semibold">aligned</span> with his path.
              </p>
            </div>

            <div className="bg-[#2f3857] p-8 rounded-xl text-center max-w-2xl mx-auto shadow-xl">
              <p className="text-2xl md:text-3xl font-light mb-4">
                If you're feeling stuck or unfulfilled, you're not alone.
              </p>
              <p className="text-2xl md:text-3xl font-semibold text-[#c8b6a6]">
                In 2025, it's time to change that.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}