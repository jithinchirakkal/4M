import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
// import logo from '../../assets/Images/logo.png';
// import logo from '../../assets/Images/logobr.png';
import logo from '../../assets/Images/logo1.png';
import { useAuth } from '../../contexts/AuthContext';

// Re-using your original prop and module interfaces for type compatibility
interface NavModule {
  id: string;
  title: string;
  fullName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }> | LucideIcon;
  description: string;
  status: 'active' | 'development' | 'beta';
}

interface NavModuleProps {
  modules: NavModule[];
  selectedModule: string;
  setSelectedModule: (id: string) => void;
  sidebarCollapsed: boolean; 
  setSidebarCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<NavModuleProps> = ({
  modules,
  selectedModule,
  setSelectedModule,
  sidebarCollapsed, 
  setSidebarCollapsed
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const { user } = useAuth(); 

  const collapsed = sidebarCollapsed;
  const setCollapsed = setSidebarCollapsed;

  /* ───────────────────────── Sidebar inner content (Crisp White & Sky Blue Theme) ───────────────────────── */
  const sidebarContent = (
    // Base: Bright white background with subtle shadow for lift
    <div className="h-full flex flex-col bg-white text-gray-900 shadow-2xl shadow-gray-300/80 border-r border-gray-200">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {/* Light header with a subtle blue bottom border */}
      <div className="p-4 border-b border-blue-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-4">
              {/* Logo: Vibrant Blue Neon Glow Effect (Kept vibrant for contrast) */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center 
                          shadow-xl ">
                <img
                  src={logo}
                />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-wide">4M System</h2>
                <p className="text-xs text-blue-600 font-medium">Change Management</p>
              </div>
            </div>
          )}

          {/* Toggle (desktop): Sleek, Light Neomorphic Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden md:flex p-2 rounded-xl transition-all duration-300 text-gray-400 
              bg-white hover:bg-blue-50 shadow-lg shadow-gray-200 hover:shadow-blue-200
              border border-gray-200 hover:border-blue-400/50
              ${collapsed ? 'ml-auto' : ''}
            `}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight size={20} className="hover:text-blue-600" />
            ) : (
              <ChevronLeft size={20} className="hover:text-blue-600" />
            )}
          </button>

          {/* Close (mobile) */}
          <button
            className="block md:hidden p-2 rounded-full bg-gray-200 text-gray-700"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Scrollable nav list ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = selectedModule === module.id;
            const isHovered = hoveredModule === module.id;

            return (
              <button
                key={module.id}
                onClick={() => {
                  setSelectedModule(module.id);
                  setMobileOpen(false);
                }}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-2xl
                  transition-all duration-300 group relative z-10
                  
                  // Base state: White background, subtle shadow
                  bg-white hover:bg-blue-50 shadow-md shadow-gray-100 
                  border border-gray-200 
                  
                  // Active/Hover state: Stronger Blue/Cyan ring and lift
                  ${isActive 
                    ? 'ring-2 ring-blue-500/80 shadow-blue-200/60 transform scale-[1.01] border-blue-300'
                    : 'hover:ring-1 hover:ring-blue-100 hover:shadow-gray-300/70'
                  }

                  ${collapsed ? 'justify-center w-14 h-14 p-0' : ''}
                `}
              >
                {/* Visual Glow Effect for Active/Hover (Light Blue Wash) */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl transition-opacity duration-300
                    bg-gradient-to-r from-blue-100/30 to-cyan-100/30
                    ${isActive ? 'opacity-100' : isHovered ? 'opacity-50' : 'opacity-0'}
                  `}
                />

                {/* Icon Container: Central Focal Point with Gradient */}
                <div
                  className={`
                    relative p-2 rounded-xl flex-shrink-0 z-20
                    transition-all duration-300 ease-out
                    ${isActive
                      // Active: Vibrant Gradient Background, White Icon
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-400/60 ring-2 ring-white/70'
                      // Inactive: Light Background, Gray Icon
                      : 'bg-gray-100/80 group-hover:bg-blue-50/80 shadow-md shadow-gray-200/70'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`
                      transition-all duration-300
                      ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
                      ${isHovered ? 'scale-110' : 'scale-100'}
                    `}
                  />
                </div>

                {/* Text Content */}
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left relative z-20">
                    <div className="flex items-center justify-between">
                      <span
                        className={`
                          font-extrabold text-sm truncate transition-colors duration-200
                          ${isActive ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-700'}
                        `}
                      >
                        {module.title}
                      </span>

                      {/* Status Tags: Highly stylized chip design */}
                      {module.status && module.status !== 'active' && (
                        <span
                          className={`
                            text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all duration-200
                            ${module.status === 'beta'
                              ? 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                            }
                            ${isHovered ? 'scale-105' : 'scale-100'}
                          `}
                        >
                          {module.status}
                        </span>
                      )}
                    </div>
                    <p className={`
                      text-xs mt-0.5 truncate transition-colors duration-200
                      ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}
                    `}>
                      {module.description}
                    </p>
                  </div>
                )}

                {/* Active Indicator Bar (Vibrant vertical line) */}
                {isActive && !collapsed && (
                  <div className="absolute left-0 inset-y-2 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full shadow-lg shadow-blue-400/50" />
                )}
                {/* Collapsed Active Dot */}
                {isActive && collapsed && (
                   <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-400/50 ring-1 ring-white/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        {/* Light Footer Text */}
        {!collapsed && (
          <div className="text-gray-500 text-center">
              <p className="font-semibold text-lg text-gray-600">NL Technologies Pvt. Ltd.</p>
              <p className="text-xs mt-1">© 2025 All rights reserved</p>
          </div>
        )}
      </div>
    </div>
  );

  /* ───────────────────────────── JSX return ──────────────────────────────── */
  return (
    <>
      {/* ── Mobile hamburger (Highly Visible) ─────────────────────────────────── */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          className="p-3 rounded-xl bg-blue-600 border border-blue-700 shadow-xl shadow-blue-300/50 hover:shadow-blue-400/50 transition-all duration-300 hover:scale-105"
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
        >
          {/* Menu icon is now dark for light theme */}
          <Menu size={24} className="text-white" /> 
        </button>
      </div>

      {/* ── Desktop sidebar (Offset from top) ──────────────────────────────────── */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 
          ${collapsed ? 'w-24' : 'w-80'}
          hidden md:block
          transition-all duration-300 ease-in-out
          z-50
        `}
      >
        {sidebarContent}
      </div>

      {/* ── Mobile drawer (Light Theme) ────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden transition-all"
          style={{ top: '4rem' }} 
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop: Light and subtle for light theme */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" /> 
          
          {/* Drawer Content */}
          <div
            className={`
              absolute left-0 top-0 bottom-0
              w-72 
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

// import React, { useState } from 'react';
// import {
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   LucideIcon // Add this for type hint if not already imported globally
// } from 'lucide-react';
// // import styles from './sidebar.module.css'; // Removed, custom scrollbar handled with utility classes/plugins
// // import logo from '../../assets/4M (2).png'; // Removed as not used in the new design

// // Re-using your original prop and module interfaces for type compatibility
// interface NavModule {
//   id: string;
//   title: string;
//   fullName: string;
//   color: string;
//   icon: React.ComponentType<{ size?: number; className?: string }> | LucideIcon; // Added LucideIcon for better typing
//   description: string;
//   status: 'active' | 'development' | 'beta';
// }

// interface NavModuleProps {
//   modules: NavModule[];
//   selectedModule: string;
//   setSelectedModule: (id: string) => void;
//   // Kept original prop name for compatibility
//   sidebarCollapsed: boolean; 
//   setSidebarCollapsed: (collapsed: boolean) => void;
// }

// // Renamed component for better semantics (optional: rename the file too)
// const Sidebar: React.FC<NavModuleProps> = ({
//   modules,
//   selectedModule,
//   setSelectedModule,
//   // Using original prop name
//   sidebarCollapsed, 
//   setSidebarCollapsed
// }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [hoveredModule, setHoveredModule] = useState<string | null>(null);

//   // Use the prop name `sidebarCollapsed` within the component logic
//   const collapsed = sidebarCollapsed;
//   const setCollapsed = setSidebarCollapsed;

//   /* ───────────────────────── Sidebar inner content (Dark Theme) ───────────────────────── */
//   const sidebarContent = (
//     // Dark background gradient
//     <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      
//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="p-6 border-b border-slate-700/50">
//         <div className="flex items-center justify-between">
//           {!collapsed && (
//             <div className="flex items-center gap-3">
//               {/* Logo/Icon Area */}
//               <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
//                 <span className="text-white font-bold text-xl">4M</span>
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-white">4M System</h2>
//                 <p className="text-xs text-slate-400">Change Management</p>
//               </div>
//             </div>
//           )}

//           {/* Toggle (desktop) */}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className={`
//               hidden md:flex p-2 rounded-lg transition-all duration-200 text-slate-400 group
//               ${collapsed ? 'hover:bg-slate-700/50' : 'hover:bg-slate-700/50'}
//               ${collapsed ? 'ml-auto' : ''}
//             `}
//           >
//             {collapsed ? (
//               <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform hover:text-white" />
//             ) : (
//               <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform hover:text-white" />
//             )}
//           </button>

//           {/* Close (mobile) */}
//           <button
//             className="block md:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-white"
//             onClick={() => setMobileOpen(false)}
//             aria-label="Close sidebar"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>

//       {/* ── Scrollable nav list ─────────────────────────────────────────────── */}
//       {/* Note: scrollbar-thin, scrollbar-thumb-slate-700, scrollbar-track-transparent 
//          require the 'tailwind-scrollbar' plugin to be installed and configured. 
//          If you don't use this plugin, you'll need a custom CSS solution.
//       */}
//       <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
//         <div className="p-4 space-y-2">
//           {modules.map((module) => {
//             const Icon = module.icon;
//             const isActive = selectedModule === module.id;
//             const isHovered = hoveredModule === module.id;

//             return (
//               <button
//                 key={module.id}
//                 onClick={() => {
//                   setSelectedModule(module.id);
//                   setMobileOpen(false);
//                 }}
//                 onMouseEnter={() => setHoveredModule(module.id)}
//                 onMouseLeave={() => setHoveredModule(null)}
//                 className={`
//                   w-full flex items-center gap-3 px-4 py-3 rounded-xl
//                   transition-all duration-300 group relative overflow-hidden
//                   ${isActive
//                     ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
//                     : 'hover:bg-slate-700/50 border border-transparent'
//                   }
//                   ${collapsed ? 'justify-center' : ''}
//                 `}
//               >
//                 {/* Hover/Active Background Overlay */}
//                 <div
//                   className={`
//                     absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10
//                     transition-transform duration-300 ease-out
//                     ${isHovered && !isActive ? 'translate-x-0' : '-translate-x-full'}
//                   `}
//                 />

//                 {/* Icon Container */}
//                 <div
//                   className={`
//                     relative p-2 rounded-lg flex-shrink-0
//                     transition-all duration-300
//                     ${isActive
//                       ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
//                       : 'bg-slate-700/50 group-hover:bg-slate-600/50'
//                     }
//                   `}
//                 >
//                   <Icon
//                     size={20}
//                     className={`
//                       transition-all duration-300
//                       ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
//                       ${isHovered ? 'scale-110' : 'scale-100'}
//                     `}
//                   />
//                 </div>

//                 {/* Text Content */}
//                 {!collapsed && (
//                   <div className="flex-1 min-w-0 text-left relative">
//                     <div className="flex items-center justify-between">
//                       <span
//                         className={`
//                           font-medium text-sm truncate transition-colors duration-200
//                           ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
//                         `}
//                       >
//                         {module.title}
//                       </span>

//                       {/* Status Tags */}
//                       {module.status && module.status !== 'active' && (
//                         <span
//                           className={`
//                             text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200
//                             ${module.status === 'beta'
//                               ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
//                               : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
//                             }
//                             ${isHovered ? 'scale-105' : 'scale-100'}
//                           `}
//                         >
//                           {module.status}
//                         </span>
//                       )}
//                     </div>
//                     <p className={`
//                       text-xs mt-0.5 truncate transition-colors duration-200
//                       ${isActive ? 'text-cyan-300/80' : 'text-slate-500 group-hover:text-slate-400'}
//                     `}>
//                       {module.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* Active Indicator Bar */}
//                 {isActive && (
//                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full" />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Footer ──────────────────────────────────────────────────────────── */}
//       {!collapsed && (
//         <div className="p-4 border-t border-slate-700/50">
//           <div className="text-xs text-slate-500 text-center">
//             <p>NL Technologies Pvt. Ltd.</p>
//             <p className="mt-1">© 2025 All rights reserved</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   /* ───────────────────────────── JSX return ──────────────────────────────── */
//   return (
//     <>
//       {/* ── Mobile hamburger (Dark Theme) ─────────────────────────────────── */}
//       <div className="md:hidden fixed top-20 left-4 z-50">
//         <button
//           className="p-3 rounded-xl bg-slate-800 border border-slate-700 shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-105"
//           aria-label="Open sidebar"
//           onClick={() => setMobileOpen(true)}
//         >
//           <Menu size={24} className="text-white" />
//         </button>
//       </div>

//       {/* ── Desktop sidebar (Dark Theme) ──────────────────────────────────── */}
//       <div
//         className={`
//           fixed left-0 top-16 bottom-0
//           ${collapsed ? 'w-20' : 'w-72'}
//           hidden md:block
//           transition-all duration-300 ease-in-out
//           z-30 shadow-2xl
//         `}
//       >
//         {sidebarContent}
//       </div>

//       {/* ── Mobile drawer (Dark Theme) ────────────────────────────────────── */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-50 md:hidden transition-all"
//           style={{ top: 64 }}
//           onClick={() => setMobileOpen(false)}
//         >
//           {/* Backdrop */}
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
//           {/* Drawer Content */}
//           <div
//             className={`
//               absolute left-0 top-0 bottom-0
//               ${collapsed ? 'w-20' : 'w-72'}
//               shadow-2xl
//             `}
//             onClick={(e) => e.stopPropagation()}
//           >
//             {sidebarContent}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar; // Or NavModule, depending on your file name