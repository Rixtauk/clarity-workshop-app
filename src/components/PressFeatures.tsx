import React from 'react';
import { ExternalLink } from 'lucide-react';

const pressClippings = [
  {
    url: "https://www.dropbox.com/scl/fi/avod051o8mb4y09bcz9nq/Untitled-22.jpeg?rlkey=xdje3wat358391ifq4niop56q&st=ru16oyxh&raw=1",
    alt: "Press feature in major publication"
  },
  {
    url: "https://www.dropbox.com/scl/fi/571dus5928lsy432tofps/Untitled-21.jpeg?rlkey=f905hj45tzo0ikdaw3emwegdq&st=33lf82vc&raw=1",
    alt: "Leadership insights feature"
  },
  {
    url: "https://www.dropbox.com/scl/fi/bmnbch7y1xvnqs6r9usmq/Untitled-23.jpeg?rlkey=qztd8ymvstfzstpdjx13yjka5&st=4gg8ks8e&raw=1",
    alt: "Executive coaching spotlight"
  },
  {
    url: "https://www.dropbox.com/scl/fi/oax6k96rljeia2ad6wg5i/Untitled-24.jpeg?rlkey=5ahl3r1y943skx7r77m9yry9o&st=kal44cja&raw=1",
    alt: "Professional development insights"
  },
  {
    url: "https://www.dropbox.com/scl/fi/djzx5zo35fhdffqv0lrea/Untitled-25.jpeg?rlkey=ambyc0pvn1wdkfa1i0s3s927f&st=u7hw5fkv&raw=1",
    alt: "Professional development feature"
  },
  {
    url: "https://www.dropbox.com/scl/fi/g4x34ck5qv6r4ioumxld8/upscaled-image.jpg?rlkey=5ghvv91b3f55r7ay11wtjjl10&st=5ul29e8h&raw=1",
    alt: "Media feature"
  }
];

export default function PressFeatures() {
  return (
    <section className="bg-gradient-testimonial py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg text-[#2f3857] mb-4">
            Media Appearances
          </h2>
          <p className="text-[#c8b6a6] subheading mb-16">
            Alex's transformative approach has earned him frequent recognition in leading media outlets.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {pressClippings.map((clipping, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div 
                className="relative aspect-video bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] image-gradient-overlay"
                style={{
                  transform: `rotate(${index % 2 === 0 ? '2deg' : '-2deg'})`,
                }}
              >
                <img
                  src={clipping.url}
                  alt={clipping.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <a
                  href={clipping.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-brand-navy p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-brand-navy-dark transform translate-y-4 group-hover:translate-y-0 hover:scale-110 shadow-lg"
                >
                  <ExternalLink className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}