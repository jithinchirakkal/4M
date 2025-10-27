// import React, { useState, useRef, useEffect } from "react";

// interface NavbarProps {
//   username: string;
//   email: string;
//   version: string;
//   logo1?: string;          // optional logo URL
//   logoAlt?: string;       // optional alt text for logo
//   companyName?: string;   // optional company name to show with logo
// }

// const Navbar: React.FC<NavbarProps> = ({ 
//   username, 
//   email, 
//   version, 
//   logo1, 
//   logoAlt = "Company Logo",
//   companyName = "4M System"
// }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleLogout = () => {
//     // TODO: Connect with your API
//     alert("Logged out!");
//   };

//   // Get initials for avatar
//   const initials = username
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <>
//       {/* Fixed Header - positioned above sidebar */}
//       <nav className={`fixed top-0 left-0 right-0 px-6 lg:px-8 py-4 flex justify-between items-center z-50 transition-all duration-300 border-b border-purple-200 ${
//         scrolled 
//           ? 'bg-white/95 backdrop-blur-md shadow-lg' 
//           : 'bg-white/80 backdrop-blur-sm'
//       }`}>
//         {/* Left: Logo */}
//         <div className="flex items-center gap-4">
//           {logo1 ? (
//             <div className="flex items-center gap-3">
//               <img 
//                 src={logo1} 
//                 alt={logoAlt}
//                 className="h-12 w-auto max-w-[200px] object-contain scale-150"
//               />
//               {/* <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
//                 {companyName}
//               </div> */}
//             </div>
//           ) : (
//             <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
//               {companyName}
//             </div>
//           )}
//         </div>

//         {/* Center: Title */}
//         <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group">
//           <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
//             4M CHANGE MANAGEMENT SYSTEM
//           </h1>
//           <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
//         </div>

//         {/* Right: User Avatar */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="focus:outline-none group"
//           >
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg">
//               {initials}
//             </div>
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//           </button>

//           {/* Dropdown Menu */}
//           <div className={`absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl transform transition-all duration-300 origin-top-right ${
//             menuOpen 
//               ? 'scale-100 opacity-100 translate-y-0' 
//               : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
//           }`}>
//             {/* Header */}
//             <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
//               <button 
//                 onClick={() => setMenuOpen(false)} 
//                 className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
              
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/30">
//                   {initials}
//                 </div>
//                 <p className="mt-3 text-xl font-semibold">Hi, {username.split(" ")[0]}!</p>
//                 <p className="text-sm text-white/80 mt-1">{email}</p>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-6">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center gap-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-3 px-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
//                 </svg>
//                 <span className="font-medium">Sign Out</span>
//               </button>
//             </div>

//             {/* Footer */}
//             <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
//               <div className="flex justify-center gap-4 text-sm text-gray-500">
//                 <button className="hover:text-blue-600 transition-colors duration-200 hover:underline">
//                   Privacy policy
//                 </button>
//                 <span className="text-gray-300">|</span>
//                 <button className="hover:text-blue-600 transition-colors duration-200 hover:underline">
//                   Terms of service
//                 </button>
//                 <span className="text-gray-300">|</span>
//                 <span>Version {version}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Backdrop for dropdown */}
//       {menuOpen && (
//         <div 
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
//           onClick={() => setMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { LogOut, X, LayoutDashboard, HomeIcon } from "lucide-react"; // Imported LayoutDashboard for the Home button

interface NavbarProps {
  username: string;
  email: string;
  version: string;
  logo1?: string; // optional logo URL
  logoAlt?: string; // optional alt text for logo
  companyName?: string; // optional company name to show with logo
  
  // NEW PROP ADDED for the Home button functionality
  onHomeClick: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({
  username,
  email,
  version,
  logo1,
  logoAlt = "Company Logo",
  companyName = "4M System",
  onHomeClick // Destructured the new prop
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // TODO: Connect with your API
    alert("Logged out!");
  };

  // Get initials for avatar
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Fixed Header - Dark Theme */}
      <nav
        className={`fixed top-0 left-0 right-0 px-6 lg:px-8 py-6 flex justify-between items-center z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-gray-50/95 backdrop-blur-md shadow-2xl border-gray-200'
            : 'bg-gray-50/90 backdrop-blur-sm border-gray-200'
        }`}
      >
        
        {/* Left: Logo and Company Name (Always visible in this header) */}
        <div className="flex items-center gap-3 md:gap-4">
            {logo1 ? (
                // Show logo if provided
                <img 
                    src={logo1} 
                    alt={logoAlt}
                    // Reduced size for better header fit, adjust h-8/w-auto as needed
                    className="h-12 w-auto object-contain" 
                />
            ) : (
                // Fallback for logo
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="text-white font-bold text-lg">4M</span>
                </div>
            )}
            
            {/* Company Name next to the logo */}
            {/* <div className="text-xl font-bold text-white hidden sm:block">
                {companyName}
            </div> */}
        </div>

        {/* Center: Main Title/Placeholder (Kept the title but reduced font size) */}
        {/* <div className="flex-1 flex justify-center min-w-0">
            <div className="text-base font-semibold text-slate-300 hidden sm:block">
                4M Change Management System
            </div>
        </div> */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group">
           <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
             4M CHANGE MANAGEMENT SYSTEM
           </h1>
         <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Right: Home Button and User Avatar (Removed Search and Bell) */}
        <div className="flex items-center gap-4">
          
          {/* 1. Home Button */}
          <button 
            onClick={onHomeClick} // Use the new prop
            title="Go to Dashboard"
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
          >
            <HomeIcon className="h-7 w-7" />
          </button>
          
          {/* 2. User Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-cyan-500/30 transform transition-all duration-200 group-hover:scale-105">
                {initials}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </button>

            {/* Dropdown Menu - Light Theme for contrast (Kept as is) */}
            <div
              className={`absolute right-0 mt-3 w-80 md:w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl transform transition-all duration-300 origin-top-right ${
                menuOpen
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-t-2xl p-6 text-white">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/30">
                    {initials}
                  </div>
                  <p className="mt-3 text-xl font-semibold">
                    Hi, {username.split(" ")[0]}!
                  </p>
                  <p className="text-sm text-white/80 mt-1">{email}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl py-3 px-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  <LogOut size={20} strokeWidth={2.5} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-cyan-600 transition-colors duration-200 hover:underline">
                    Privacy policy
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="hover:text-cyan-600 transition-colors duration-200 hover:underline">
                    Terms of service
                  </button>
                  <span className="text-gray-300">|</span>
                  <span className="text-slate-500">Version {version}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for dropdown */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;