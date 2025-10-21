// import React, { useState, useRef, useEffect } from "react";

// interface NavbarProps {
//   username: string;
//   email: string;
//   version: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ username, email, version }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
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
//     <nav className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-md px-10 py-3 flex items-center justify-between w-full">
//       {/* Logo */}
//       <div className="text-2xl font-bold text-white tracking-wide">MyApp</div>

//       {/* Nav Links */}
//       <div className="hidden md:flex space-x-10">
//         {/* <a href="/" className="text-white hover:text-blue-100 transition">Home</a>
//         <a href="/about" className="text-white hover:text-blue-100 transition">About</a>
//         <a href="/features" className="text-white hover:text-blue-100 transition">Features</a>
//         <a href="/pricing" className="text-white hover:text-blue-100 transition">Pricing</a>
//         <a href="/contact" className="text-white hover:text-blue-100 transition">Contact</a> */} 

//         <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow">
//           4M SYSTEM MANAGEMENT
//         </h1>
//       </div>

//       {/* User Avatar */}
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={() => setMenuOpen((prev) => !prev)}
//           className="flex items-center focus:outline-none"
//         >
//           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold border-2 border-blue-300 shadow">
//             {initials}
//           </div>
//         </button>
//         {/* Dropdown */}
//         {menuOpen && (
//           <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl z-20 flex flex-col">
//             {/* Top Section */}
//             <div className="relative flex flex-col items-center px-8 pt-8 pb-6">
//               <span
//                 className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-gray-600 text-2xl"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 ×
//               </span>
//               <div className="text-gray-500 text-sm mb-2">{email}</div>
//               <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow">
//                 {initials}
//               </div>
//               <div className="text-2xl font-semibold mb-4">Hi, {username.split(" ")[0]}!</div>
//               <button
//                 onClick={handleLogout}
//                 className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-8 py-2 font-medium shadow hover:from-blue-600 hover:to-purple-600 transition mb-2 flex items-center gap-2"
//               >
//                 <span>&rarr;</span> Sign Out
//               </button>
//             </div>
//             {/* Footer */}
//             <div className="flex justify-center items-center border-t px-6 py-4 text-gray-400 text-base space-x-6 rounded-b-2xl bg-gray-50">
//               <a href="/privacy-policy" className="hover:text-blue-700">Privacy policy</a>
//               <span>|</span>
//               <a href="/terms-of-service" className="hover:text-blue-700">Terms of service</a>
//               <span>|</span>
//               <span>Version {version}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// Updated Navbar Component - Replace your existing one
// import React, { useState, useRef, useEffect } from "react";

// interface NavbarProps {
//   username: string;
//   email: string;
//   version: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ username, email, version }) => {
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
//           <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            
//           </div>
//         </div>

//         {/* Center: Title */}
//         <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group">
//           <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
//             4M CHANGE  MANAGEMENT SYSTEM
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

interface NavbarProps {
  username: string;
  email: string;
  version: string;
  logo1?: string;          // optional logo URL
  logoAlt?: string;       // optional alt text for logo
  companyName?: string;   // optional company name to show with logo
}

const Navbar: React.FC<NavbarProps> = ({ 
  username, 
  email, 
  version, 
  logo1, 
  logoAlt = "Company Logo",
  companyName = "4M System"
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* Fixed Header - positioned above sidebar */}
      <nav className={`fixed top-0 left-0 right-0 px-6 lg:px-8 py-4 flex justify-between items-center z-50 transition-all duration-300 border-b border-purple-200 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          {logo1 ? (
            <div className="flex items-center gap-3">
              <img 
                src={logo1} 
                alt={logoAlt}
                className="h-10 w-auto max-w-[200px] object-contain scale-150"
              />
              {/* <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                {companyName}
              </div> */}
            </div>
          ) : (
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {companyName}
            </div>
          )}
        </div>

        {/* Center: Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
            4M CHANGE MANAGEMENT SYSTEM
          </h1>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Right: User Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </button>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-3 w-96 bg-white border border-gray-100 rounded-2xl shadow-2xl transform transition-all duration-300 origin-top-right ${
            menuOpen 
              ? 'scale-100 opacity-100 translate-y-0' 
              : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white">
              <button 
                onClick={() => setMenuOpen(false)} 
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-white/30">
                  {initials}
                </div>
                <p className="mt-3 text-xl font-semibold">Hi, {username.split(" ")[0]}!</p>
                <p className="text-sm text-white/80 mt-1">{email}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-3 px-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <div className="flex justify-center gap-4 text-sm text-gray-500">
                <button className="hover:text-blue-600 transition-colors duration-200 hover:underline">
                  Privacy policy
                </button>
                <span className="text-gray-300">|</span>
                <button className="hover:text-blue-600 transition-colors duration-200 hover:underline">
                  Terms of service
                </button>
                <span className="text-gray-300">|</span>
                <span>Version {version}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for dropdown */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
