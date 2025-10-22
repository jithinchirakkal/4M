import React from 'react';

interface FooterProps {
  sidebarCollapsed?: boolean;           // prop kept for API consistency (not used now)
  logo?: string;                       // optional logo URL
  logoAlt?: string;                    // optional alt text for logo
}

const Footer: React.FC<FooterProps> = ({ 
  logo, 
  logoAlt = "NL Technologies Pvt. Ltd." 
}) => (
  <footer
    className={`
      fixed bottom-0 left-0 right-0
      h-16
      flex items-center justify-between
      px-6 py-3 text-sm
      bg-white text-gray-800 border-t border-gray-200
      z-40                             /* above sidebar (z-30) */
    `}
  >
    {/* Left – logo or fallback */}
    <div className="flex items-center">
      {logo ? (
        // If logo is provided, show the image
        <img 
          src={logo} 
          alt={logoAlt}
          className="h-14 w-auto object-contain mr-9"
        />
      ) : (
        // Fallback to the circular NL badge
        <div className="bg-gray-800 rounded-full p-1 mr-3">
          <span className="text-white font-bold text-xs px-2">NL</span>
        </div>
      )}
      {/* <span className="font-medium">NL Technologies Pvt. Ltd.</span> */}
    </div>

    {/* Center – tagline */}
    <span className="flex-1 mx-4 text-center font-medium text-gray-700">
      Empowering Industrial Excellence Through Digital Transformation
    </span>

    {/* Right – copyright */}
    <span className="text-gray-700">
      © 2025 NL Technologies. All rights reserved.
    </span>
  </footer>
);

export default Footer;
