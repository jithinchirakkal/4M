// src/App.tsx

import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nav"; 
import Footer from "./components/Navbar/Footer";
import Home from "./Home";

// ... (logo imports)
import logos from './assets/Images/logo.png'; 

function App() {
    const [selectedModule, setSelectedModule] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleHomeClick = () => {
        setSelectedModule('dashboard');
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                
                {/* 1. Navbar - FIXED and HIGH Z-INDEX */}
                {/* The Navbar needs to be fixed to the top and have a high Z-index (e.g., z-50) */}
                <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
                    <Navbar 
                        logo1={logos}
                        username="John Doe" 
                        email="john@example.com" 
                        version="1.0.0" 
                        onHomeClick={handleHomeClick}
                    />
                </div>
                
                {/* 2. Main Layout - Adjusted to push content down by Navbar height (e.g., pt-16) */}
                {/* The pt-16 is moved inside the main content area to clear the fixed navbar. 
                   The Home component will manage the layout of the sidebar and its content. */}
                <div className="flex-1 pt-16">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <Home 
                                    selectedModule={selectedModule}
                                    setSelectedModule={setSelectedModule}
                                    sidebarCollapsed={sidebarCollapsed}
                                    setSidebarCollapsed={setSidebarCollapsed}
                                />
                            } 
                        />
                    </Routes>
                </div>
                
                {/* Footer (assuming it's not fixed) */}
                {/* <Footer logo={logo} logoAlt="NL Technologies Logo" /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;





// // import React from 'react';
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Navbar from "./Navbar";
// import Navbar from "./components/Navbar/Nav";
// // import FourMNavbar from "./components/Navbar/FourMNavbar";
// import Home from "./Home";

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar username="John Doe" email="john@example.com" version="1.0.0" />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         {/* other routes */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;





// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import MaterialMovementCard from './components/4M-Material Movement/MaterialMovementCard';
// import FourMChangeTrackSheet from './components/4M-Change Tracking Sheet/track';
// import ControlPlanForm from './components/Control Plan/ControlPlanForm';
// import MachineCheckSheet from './components/MachineCheckSheet/MachineCheckSheet';
// import ProcessFlowDiagram from './components/ProcessFlowDiagram/ProcessFlowDiagram';
// import RetroactiveCheckRecord from './components/RetroactiveCheckRecord/RetroactiveCheckRecord';
// import InspectionForm from './components/InspectionForm/inspection';
// import ManMachineMatrix from './components/ManMachineMatrix/ManMachineMatrix';
// import DashboardView from './components/Dashboard/DashboardView';
// import ChangeManagementView from './components/cm/ChangeManagementView';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />}>
//           <Route index element={<DashboardView />} />
//           <Route path="mmc" element={<MaterialMovementCard />} />
//           <Route path="4m-cts" element={<FourMChangeTrackSheet />} />
//           <Route path="cpf" element={<ControlPlanForm />} />
//           <Route path="mcs" element={<MachineCheckSheet />} />
//           <Route path="pf" element={<ProcessFlowDiagram />} />
//           <Route path="rcr" element={<RetroactiveCheckRecord />} />
//           <Route path="iic-sar" element={<InspectionForm />} />
//           <Route path="mmm" element={<ManMachineMatrix />} />
//           <Route path="changemanagement" element={<ChangeManagementView />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;
