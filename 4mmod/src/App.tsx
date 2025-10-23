import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Nav"; // Assuming Nav is your updated Navbar
import Footer from "./components/Navbar/Footer";
import Home from "./Home";

import logo from './assets/logo.png'; 
// import logos from './assets/app.png'; 
import logos from './assets/Images/logo.png'; 
// NOTE: Make sure the Navbar component file is renamed to Navbar.tsx or
// update the import path if it's still named NavModule.tsx

function App() {
    // 1. Lift state up to App.tsx
    const [selectedModule, setSelectedModule] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Function to handle the Home button click
    const handleHomeClick = () => {
        setSelectedModule('dashboard');
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                
                {/* 2. Pass the required props to Navbar */}
                <Navbar 
                    logo1={logos}
                    username="John Doe" 
                    email="john@example.com" 
                    version="1.0.0" 
                    onHomeClick={handleHomeClick} // <-- FIXES TS2741 ERROR
                />
                
                {/* 3. Pass state and setters to Home component */}
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
                
                {/* <Footer 
                    logo={logo}
                    logoAlt="NL Technologies Logo"
                /> */}
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
