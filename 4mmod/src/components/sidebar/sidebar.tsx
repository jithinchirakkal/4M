// // // import React from 'react';
// // // import { 
// // //   LayoutDashboard,
// // //   FileText,
// // //   Package,
// // //   Activity,
// // //   Shield,
// // //   Settings,
// // //   Globe,
// // //   Clock,
// // //   AlertTriangle,
// // //   Database,
// // //   Menu
// // // } from 'lucide-react';
// // // import styles from './sidebar.module.css';
// // // import logo from '../../assets/4m.png';

// // // interface NavModule {
// // //   id: string;
// // //   title: string;
// // //   fullName: string;
// // //   color: string;
// // //   icon: React.ComponentType<{ size?: number; className?: string }>;
// // //   description: string;
// // //   status: 'active' | 'development' | 'beta';
// // // }

// // // interface NavModuleProps {
// // //   modules: NavModule[];
// // //   selectedModule: string;
// // //   setSelectedModule: (id: string) => void;
// // //   sidebarCollapsed: boolean;
// // // }

// // // const NavModule: React.FC<NavModuleProps> = ({ 
// // //   modules, 
// // //   selectedModule, 
// // //   setSelectedModule, 
// // //   sidebarCollapsed 
// // // }) => {
// // //   return (
// // //     <div className={`
// // //       fixed left-0 top-0 h-full bg-white/80 dark:bg-gray-900 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-40
// // //       transition-all duration-300 ease-in-out overflow-hidden
// // //       ${sidebarCollapsed ? 'w-20' : 'w-80'}
// // //     `}>
// // //       <div className="h-full flex flex-col">
// // //         {/* Header section */}
// // //         <div className="p-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
// // //           <div className="flex items-center justify-between mb-4">
// // //             {!sidebarCollapsed && (
// // //              <div className="flex flex-col items-center">
// // //             <img src={logo} alt="4m system logo" className="h-12 w-12 mb-2" />
// // //             <h2 className="text-xl font-bold text-gray-800 dark:text-white">4M System</h2>
// // //            <p className="text-sm text-gray-500 dark:text-gray-400">Change Management</p>
// // //           </div>
// // //             )}
// // //             <button
// // //               className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
// // //             >
// // //               <Menu size={20} className="text-gray-600 dark:text-gray-300" />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Scrollable content */}
// // //         <div className={`flex-1 overflow-y-auto ${styles.customScrollbar} py-4`}>
// // //           <nav className="space-y-2 px-4">
// // //             {modules.map((module) => {
// // //               const IconComponent = module.icon;
// // //               return (
// // //                 <button
// // //                   key={module.id}
// // //                   onClick={() => setSelectedModule(module.id)}
// // //                   className={`
// // //                     w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200
// // //                     ${selectedModule === module.id 
// // //                       ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300' 
// // //                       : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
// // //                     }
// // //                     ${sidebarCollapsed ? 'justify-center' : ''}
// // //                   `}
// // //                 >
// // //                   <div className={`
// // //                     p-2 rounded-xl transition-all duration-200 flex-shrink-0
// // //                     ${selectedModule === module.id 
// // //                       ? `bg-gradient-to-r ${module.color} text-white shadow-lg` 
// // //                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
// // //                     }
// // //                   `}>
// // //                     <IconComponent size={20} />
// // //                   </div>
// // //                   {!sidebarCollapsed && (
// // //                     <div className="flex-1 text-left min-w-0">
// // //                       <div className="flex items-center justify-between">
// // //                         <span className="font-medium truncate">{module.title}</span>
// // //                         {module.status === 'beta' && (
// // //                           <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">
// // //                             Beta
// // //                           </span>
// // //                         )}
// // //                         {module.status === 'development' && (
// // //                           <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">
// // //                             Dev
// // //                           </span>
// // //                         )}
// // //                       </div>
// // //                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{module.description}</p>
// // //                     </div>
// // //                   )}
// // //                 </button>
// // //               );
// // //             })}
// // //           </nav>
// // //         </div>

// // //         {/* Optional footer section */}
// // //         {!sidebarCollapsed && (
// // //           <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
// // //             <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
// // //               v2.4.0 · © 2023 4M System
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default NavModule;


// import React, { useState } from 'react';
// import { 
//   LayoutDashboard,
//   FileText,
//   Package,
//   Activity,
//   Shield,
//   Settings,
//   Globe,
//   Clock,
//   AlertTriangle,
//   Database,
//   Menu,
//   X
// } from 'lucide-react';
// import styles from './sidebar.module.css';
// import logo from '../../assets/4M (2).png';

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
// }

// const NavModule: React.FC<NavModuleProps> = ({ 
//   modules, 
//   selectedModule, 
//   setSelectedModule, 
//   sidebarCollapsed 
// }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Sidebar content as a variable for reuse
//   const sidebarContent = (
//     <div className="h-full flex flex-col">
//       {/* Header section */}
//       <div className="p-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
//         <div className="flex items-center justify-between mb-4">
//           {!sidebarCollapsed && (
//             <div className="flex flex-col items-center">
//               <img src={logo} alt="4m system logo" className="h-32 w-32 " />
//               {/* <h2 className="text-xl font-bold text-gray-800 dark:text-white">4M Change Management</h2> */}
//               {/* <p className="text-sm text-gray-500 dark:text-gray-400">Change Management</p> */}
//             </div>
//           )}
//           {/* Close button for mobile */}
//           <button
//             className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block md:hidden"
//             onClick={() => setMobileOpen(false)}
//             aria-label="Close sidebar"
//           >
//             <X size={20} className="text-gray-600 dark:text-gray-300" />
//           </button>
//         </div>
//       </div>

//       {/* Scrollable content */}
//       <div className={`flex-1 overflow-y-auto ${styles.customScrollbar} py-4`}>
//         <nav className="space-y-2 px-4">
//           {modules.map((module) => {
//             const IconComponent = module.icon;
//             return (
//               <button
//                 key={module.id}
//                 onClick={() => {
//                   setSelectedModule(module.id);
//                   setMobileOpen(false); // close sidebar on mobile after selection
//                 }}
//                 className={`
//                   w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200
//                   ${selectedModule === module.id 
//                     ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300' 
//                     : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
//                   }
//                   ${sidebarCollapsed ? 'justify-center' : ''}
//                 `}
//               >
//                 <div className={`
//                   p-2 rounded-xl transition-all duration-200 flex-shrink-0
//                   ${selectedModule === module.id 
//                     ? `bg-gradient-to-r ${module.color} text-white shadow-lg` 
//                     : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
//                   }
//                 `}>
//                   <IconComponent size={20} />
//                 </div>
//                 {!sidebarCollapsed && (
//                   <div className="flex-1 text-left min-w-0">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium truncate">{module.title}</span>
//                       {module.status === 'beta' && (
//                         <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">
//                           Beta
//                         </span>
//                       )}
//                       {module.status === 'development' && (
//                         <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 px-2 py-1 rounded-full flex-shrink-0 ml-2">
//                           Dev
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{module.description}</p>
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Optional footer section */}
//       {!sidebarCollapsed && (
//         <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
//           <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
//             v2.4.0 · © 2023 4M System
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Hamburger button: only visible on small screens, in normal flow */}
//       <div className="md:hidden">
//         <button
//           className="p-2 rounded-xl bg-white/80 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
//           aria-label="Open sidebar"
//           onClick={() => setMobileOpen(true)}
//           style={{ margin: 16 }}
//         >
//           <Menu size={24} className="text-gray-600 dark:text-gray-300" />
//         </button>
//       </div>

//       {/* Sidebar: only visible on md and up */}
//       <div className={`
//         fixed left-0 top-0 h-full bg-white/80 dark:bg-gray-900 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-40
//         transition-all duration-300 ease-in-out overflow-hidden
//         ${sidebarCollapsed ? 'w-20' : 'w-80'}
//         hidden md:block
//       `}>
//         {sidebarContent}
//       </div>

//       {/* Mobile Drawer Sidebar: only rendered when open */}
//       {mobileOpen && (
//         <div
//           className={`
//             fixed inset-0 z-50 transition-all duration-300 ease-in-out
//             md:hidden
//           `}
//           style={{ background: 'rgba(0,0,0,0.3)' }}
//           onClick={() => setMobileOpen(false)}
//         >
//           <div
//             className={`
//               fixed left-0 top-0 h-full bg-white/90 dark:bg-gray-900 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50
//               transition-transform duration-300 ease-in-out
//               ${sidebarCollapsed ? 'w-20' : 'w-80'}
//               shadow-2xl
//             `}
//             onClick={e => e.stopPropagation()} // Prevent closing when clicking inside sidebar
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
  X
} from 'lucide-react';
import styles from './sidebar.module.css'; // Assuming this holds your custom scrollbar
import logo from '../../assets/4M (2).png'; // Kept for completeness, though not rendered

interface NavModule {
  id: string;
  title: string;
  fullName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  status: 'active' | 'development' | 'beta';
}

interface NavModuleProps {
  modules: NavModule[];
  selectedModule: string;
  setSelectedModule: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const NavModule: React.FC<NavModuleProps> = ({
  modules,
  selectedModule,
  setSelectedModule,
  sidebarCollapsed,
  setSidebarCollapsed
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ───────────────────────── Sidebar inner content ───────────────────────── */
  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                4 M{/* 4M System */}
              </h2>
              {/* <p className="text-sm text-gray-500">
                Change Management
              </p> */}
            </div>
          )}

          {/* Toggle (desktop) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:block p-2 rounded-xl hover:bg-blue-50 transition-colors" // Light blue hover
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Close (mobile) */}
          <button
            className="block md:hidden p-2 rounded-xl hover:bg-blue-50 transition-colors" // Light blue hover
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* ── Scrollable nav list ─────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-y-auto ${styles.customScrollbar}`}>
        <div className="p-6 pt-4 pb-12">
          <nav className="space-y-2">
            {modules.map((m) => {
              const Icon = m.icon;
              const active = selectedModule === m.id;
              
              // Determine the color for the active state text
              // Using a default of blue-700 if m.color is not structured for text-
              const activeTextColor = m.color.includes('from-') ? 'text-blue-700' : 'text-blue-700'; 
              
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModule(m.id);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-2xl
                    transition-all duration-200
                    ${active
                      ? `bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-2 border-blue-300 ${activeTextColor}` // Light blue/purple gradient background, blue border
                      : 'hover:bg-blue-50 text-gray-600'} // Light blue hover
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <div
                    className={`
                      p-2 rounded-xl flex-shrink-0 transition-all duration-200
                      ${active
                        ? `bg-gradient-to-r ${m.color} text-white shadow-lg` // Original color for the icon background
                        : 'bg-gray-100 text-gray-600'} // Light gray background for inactive icon
                    `}
                  >
                    <Icon size={20} />
                  </div>

                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{m.title}</span>

                        {m.status === 'beta' && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            Beta
                          </span>
                        )}
                        {m.status === 'development' && (
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                            Dev
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1 truncate text-gray-500">
                        {m.description}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );

  /* ───────────────────────────── JSX return ──────────────────────────────── */
  return (
    <>
      {/* ── Mobile hamburger ──────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button
          className="p-2 rounded-xl bg-white border border-gray-200 shadow-lg" // White background, light border
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>

      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <div
        className={`
          fixed left-0 top-16 bottom-0
          ${sidebarCollapsed ? 'w-20' : 'w-80'}
          hidden md:block
          bg-white/90 backdrop-blur-xl // Predominantly white
          border-r border-gray-200
          transition-all duration-300 ease-in-out overflow-hidden
          z-30
        `}
      >
        {sidebarContent}
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden transition-all"
          style={{ background: 'rgba(0,0,0,0.3)', top: 64 }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={`
              fixed left-0 top-0 bottom-0
              ${sidebarCollapsed ? 'w-20' : 'w-80'}
              bg-white/90 backdrop-blur-xl // Predominantly white
              border-r border-gray-200
              shadow-2xl transition-transform
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

export default NavModule;