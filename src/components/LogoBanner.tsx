import React from 'react';

const logos = [
  {
    name: 'Forbes',
    url: 'https://www.dropbox.com/scl/fi/sppy32sqxqslfyfdjyj9a/forbes-logo-black-transparentwhite.png?rlkey=11fftvux8oi2hlp2y7e2t02qi&st=rzto2shi&raw=1'
  },
  {
    name: 'CEO Today',
    url: 'https://www.dropbox.com/scl/fi/sx9xtbj9adpodwfpbperd/CEOToday-Masthead-Whitee.png?rlkey=x5imjhh6d494knl0rgvjv9iuy&st=gk1xenp0&raw=1'
  },
  {
    name: 'The Times',
    url: 'https://www.dropbox.com/scl/fi/phai5shn6c9cj69fm5vik/The_Times_masthead_white.png?rlkey=qbgyfxzc0synzi4ol5so6ggr5&st=2ignuwty&raw=1'
  },
  {
    name: 'Human Window',
    url: 'https://www.dropbox.com/scl/fi/ac02zm89k7darbrz77lto/human-window-logo.png?rlkey=w23ifdml4m8u4qr5vru9u4s5g&st=2ygvo6n9&raw=1'
  },
  {
    name: 'Influence Digest',
    url: 'https://www.dropbox.com/scl/fi/ic3zi6jht4y3vo1vw115x/influence-digest-logo.png?rlkey=m8qzbu56dsr4k5gtm5yk40obf&st=x4wh82th&raw=1'
  },
  {
    name: 'Institute of Coaching',
    url: 'https://www.dropbox.com/scl/fi/443iocn669m6xr1arz961/institute-of-coaching-logo.png?rlkey=jr82v8gctqh2z930l1i7voxjx&st=sr1mwx25&raw=1'
  },
];

export default function LogoBanner() {
  return (
    <div className="bg-[#2f3857] py-12 overflow-hidden relative">
      <div className="flex space-x-16 animate-scroll">
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="flex-none opacity-75 hover:opacity-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            <img
              src={logo.url}
              alt={`${logo.name} logo`}
              className="h-8 md:h-10 object-contain brightness-0 invert hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2f3857] via-transparent to-[#2f3857] pointer-events-none" />
    </div>
  );
}