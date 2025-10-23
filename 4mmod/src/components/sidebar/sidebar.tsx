// import React, { useState } from 'react';
// import {
//   Menu,
//   X
// } from 'lucide-react';
// import styles from './sidebar.module.css'; // Assuming this holds your custom scrollbar
// import logo from '../../assets/4M (2).png'; // Kept for completeness, though not rendered

// interface NavModule {
//   id: string;
//   title: string;
//   fullName: string;
//   color: string;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   description: string;
//   status: 'active' | 'development' | 'beta';
// }

// interface NavModuleProps {
//   modules: NavModule[];
//   selectedModule: string;
//   setSelectedModule: (id: string) => void;
//   sidebarCollapsed: boolean;
//   setSidebarCollapsed: (collapsed: boolean) => void;
// }

// const NavModule: React.FC<NavModuleProps> = ({
//   modules,
//   selectedModule,
//   setSelectedModule,
//   sidebarCollapsed,
//   setSidebarCollapsed
// }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   /* ───────────────────────── Sidebar inner content ───────────────────────── */
//   const sidebarContent = (
//     <div className="h-full flex flex-col">
//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           {!sidebarCollapsed && (
//             <div>
//               {/* <h2 className="text-xl font-bold text-gray-800">
//                 4 M
//               </h2> */}
//               {/* <p className="text-sm text-gray-500">
//                 Change Management
//               </p> */}
//             </div>
//           )}

//           {/* Toggle (desktop) */}
//           <button
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//             className="hidden md:block p-2 rounded-xl hover:bg-blue-50 transition-colors" // Light blue hover
//           >
//             <Menu size={20} className="text-gray-600" />
//           </button>

//           {/* Close (mobile) */}
//           <button
//             className="block md:hidden p-2 rounded-xl hover:bg-blue-50 transition-colors" // Light blue hover
//             onClick={() => setMobileOpen(false)}
//             aria-label="Close sidebar"
//           >
//             <X size={20} className="text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* ── Scrollable nav list ─────────────────────────────────────────────── */}
//       <div className={`flex-1 overflow-y-auto ${styles.customScrollbar}`}>
//         <div className="p-6 pt-4 pb-12">
//           <nav className="space-y-2">
//             {modules.map((m) => {
//               const Icon = m.icon;
//               const active = selectedModule === m.id;
              
//               // Determine the color for the active state text
//               // Using a default of blue-700 if m.color is not structured for text-
//               const activeTextColor = m.color.includes('from-') ? 'text-blue-700' : 'text-blue-700'; 
              
//               return (
//                 <button
//                   key={m.id}
//                   onClick={() => {
//                     setSelectedModule(m.id);
//                     setMobileOpen(false);
//                   }}
//                   className={`
//                     w-full flex items-center space-x-3 px-4 py-3 rounded-2xl
//                     transition-all duration-200
//                     ${active
//                       ? `bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-2 border-blue-300 ${activeTextColor}` // Light blue/purple gradient background, blue border
//                       : 'hover:bg-blue-50 text-gray-600'} // Light blue hover
//                     ${sidebarCollapsed ? 'justify-center' : ''}
//                   `}
//                 >
//                   <div
//                     className={`
//                       p-2 rounded-xl flex-shrink-0 transition-all duration-200
//                       ${active
//                         ? `bg-gradient-to-r ${m.color} text-white shadow-lg` // Original color for the icon background
//                         : 'bg-gray-100 text-gray-600'} // Light gray background for inactive icon
//                     `}
//                   >
//                     <Icon size={20} />
//                   </div>

//                   {!sidebarCollapsed && (
//                     <div className="flex-1 min-w-0 text-left">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium truncate">{m.title}</span>

//                         {m.status === 'beta' && (
//                           <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                             Beta
//                           </span>
//                         )}
//                         {m.status === 'development' && (
//                           <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
//                             Dev
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-xs mt-1 truncate text-gray-500">
//                         {m.description}
//                       </p>
//                     </div>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       </div>
//     </div>
//   );

//   /* ───────────────────────────── JSX return ──────────────────────────────── */
//   return (
//     <>
//       {/* ── Mobile hamburger ──────────────────────────────────────────────── */}
//       <div className="md:hidden fixed top-20 left-4 z-50">
//         <button
//           className="p-2 rounded-xl bg-white border border-gray-200 shadow-lg" // White background, light border
//           aria-label="Open sidebar"
//           onClick={() => setMobileOpen(true)}
//         >
//           <Menu size={24} className="text-gray-600" />
//         </button>
//       </div>

//       {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
//       <div
//         className={`
//           fixed left-0 top-16 bottom-0
//           ${sidebarCollapsed ? 'w-20' : 'w-80'}
//           hidden md:block
//           bg-white/90 backdrop-blur-xl // Predominantly white
//           border-r border-gray-200
//           transition-all duration-300 ease-in-out overflow-hidden
//           z-30
//         `}
//       >
//         {sidebarContent}
//       </div>

//       {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
//       {mobileOpen && (
//         <div
//           className="fixed inset-0 z-50 md:hidden transition-all"
//           style={{ background: 'rgba(0,0,0,0.3)', top: 64 }}
//           onClick={() => setMobileOpen(false)}
//         >
//           <div
//             className={`
//               fixed left-0 top-0 bottom-0
//               ${sidebarCollapsed ? 'w-20' : 'w-80'}
//               bg-white/90 backdrop-blur-xl // Predominantly white
//               border-r border-gray-200
//               shadow-2xl transition-transform
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

// export default NavModule;

import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LucideIcon // Add this for type hint if not already imported globally
} from 'lucide-react';
// import styles from './sidebar.module.css'; // Removed, custom scrollbar handled with utility classes/plugins
// import logo from '../../assets/4M (2).png'; // Removed as not used in the new design

// Re-using your original prop and module interfaces for type compatibility
interface NavModule {
  id: string;
  title: string;
  fullName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }> | LucideIcon; // Added LucideIcon for better typing
  description: string;
  status: 'active' | 'development' | 'beta';
}

interface NavModuleProps {
  modules: NavModule[];
  selectedModule: string;
  setSelectedModule: (id: string) => void;
  // Kept original prop name for compatibility
  sidebarCollapsed: boolean; 
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// Renamed component for better semantics (optional: rename the file too)
const Sidebar: React.FC<NavModuleProps> = ({
  modules,
  selectedModule,
  setSelectedModule,
  // Using original prop name
  sidebarCollapsed, 
  setSidebarCollapsed
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  // Use the prop name `sidebarCollapsed` within the component logic
  const collapsed = sidebarCollapsed;
  const setCollapsed = setSidebarCollapsed;

  /* ───────────────────────── Sidebar inner content (Dark Theme) ───────────────────────── */
  const sidebarContent = (
    // Dark background gradient
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              {/* Logo/Icon Area */}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-xl">4M</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">4M System</h2>
                <p className="text-xs text-slate-400">Change Management</p>
              </div>
            </div>
          )}

          {/* Toggle (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              hidden md:flex p-2 rounded-lg transition-all duration-200 text-slate-400 group
              ${collapsed ? 'hover:bg-slate-700/50' : 'hover:bg-slate-700/50'}
              ${collapsed ? 'ml-auto' : ''}
            `}
          >
            {collapsed ? (
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform hover:text-white" />
            ) : (
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform hover:text-white" />
            )}
          </button>

          {/* Close (mobile) */}
          <button
            className="block md:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Scrollable nav list ─────────────────────────────────────────────── */}
      {/* Note: scrollbar-thin, scrollbar-thumb-slate-700, scrollbar-track-transparent 
         require the 'tailwind-scrollbar' plugin to be installed and configured. 
         If you don't use this plugin, you'll need a custom CSS solution.
      */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
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
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 group relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    : 'hover:bg-slate-700/50 border border-transparent'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                {/* Hover/Active Background Overlay */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                    transition-transform duration-300 ease-out
                    ${isHovered && !isActive ? 'translate-x-0' : '-translate-x-full'}
                  `}
                />

                {/* Icon Container */}
                <div
                  className={`
                    relative p-2 rounded-lg flex-shrink-0
                    transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`
                      transition-all duration-300
                      ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                      ${isHovered ? 'scale-110' : 'scale-100'}
                    `}
                  />
                </div>

                {/* Text Content */}
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left relative">
                    <div className="flex items-center justify-between">
                      <span
                        className={`
                          font-medium text-sm truncate transition-colors duration-200
                          ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                        `}
                      >
                        {module.title}
                      </span>

                      {/* Status Tags */}
                      {module.status && module.status !== 'active' && (
                        <span
                          className={`
                            text-xs px-2 py-0.5 rounded-full font-medium transition-all duration-200
                            ${module.status === 'beta'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                      ${isActive ? 'text-cyan-300/80' : 'text-slate-500 group-hover:text-slate-400'}
                    `}>
                      {module.description}
                    </p>
                  </div>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-xs text-slate-500 text-center">
            <p>NL Technologies Pvt. Ltd.</p>
            <p className="mt-1">© 2025 All rights reserved</p>
          </div>
        </div>
      )}
    </div>
  );

  /* ───────────────────────────── JSX return ──────────────────────────────── */
  return (
    <>
      {/* ── Mobile hamburger (Dark Theme) ─────────────────────────────────── */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          className="p-3 rounded-xl bg-slate-800 border border-slate-700 shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 hover:scale-105"
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} className="text-white" />
        </button>
      </div>

      {/* ── Desktop sidebar (Dark Theme) ──────────────────────────────────── */}
      <div
        className={`
          fixed left-0 top-16 bottom-0
          ${collapsed ? 'w-20' : 'w-72'}
          hidden md:block
          transition-all duration-300 ease-in-out
          z-30 shadow-2xl
        `}
      >
        {sidebarContent}
      </div>

      {/* ── Mobile drawer (Dark Theme) ────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden transition-all"
          style={{ top: 64 }}
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Drawer Content */}
          <div
            className={`
              absolute left-0 top-0 bottom-0
              ${collapsed ? 'w-20' : 'w-72'}
              shadow-2xl
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

export default Sidebar; // Or NavModule, depending on your file name