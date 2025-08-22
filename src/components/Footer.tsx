import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <img
                src="https://www.dropbox.com/scl/fi/pyk18qtsbjf7ke5xn7rmi/Main-Logo-Black-V2.png?rlkey=ls326jwilxju7hy08xqnyxckf&st=snot4one&raw=1"
                alt="The Clarity Workshop"
                className="h-6 md:h-8 object-contain"
              />
              <div className="text-gray-600 text-sm md:text-base text-center md:text-left">
                © The Clarity Workshop 2025
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-2">
              <div className="text-[#2f3857] font-medium">Wilcca Coaching Ltd</div>
              <div className="text-gray-600 text-sm md:text-base text-center md:text-right">
                22 Wenlock<br />
                N1 7GU, England
              </div>
              <a 
                href="mailto:alex@theclarityworkshop.co.uk"
                className="text-[#2f3857] hover:text-[#fd7f4f] transition-colors duration-300 mt-2"
              >
                alex@theclarityworkshop.co.uk
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}