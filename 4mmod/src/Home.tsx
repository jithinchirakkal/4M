import React, { useState } from 'react';
import NavModule from './components/sidebar/sidebar';
import { navModules } from './components/sidebar/navModules';
import MaterialMovementCard from './components/4M-Material Movement/MaterialMovementCard';
import FourMChangeTrackSheet from './components/4M-Change Tracking Sheet/track';
import ControlPlanForm from './components/Control Plan/ControlPlanForm';
import MachineCheckSheet from './components/MachineCheckSheet/MachineCheckSheet';
import ProcessFlowDiagram from './components/ProcessFlowDiagram/ProcessFlowDiagram';
import RetroactiveCheckRecord from './components/RetroactiveCheckRecord/RetroactiveCheckRecord';
import InspectionForm from './components/InspectionForm/inspection';
import ManMachineMatrix from './components/ManMachineMatrix/ManMachineMatrix';
import DashboardView from './components/Dashboard/DashboardView';
import ChangeManagementView from './components/cm/ChangeManagementView';
import ChangeDisplayBoard from './components/ChangeDisplayBoard/ChangeDisplayBoard';

const Home = () => {
    const [selectedModule, setSelectedModule] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Navigation Sidebar */}
            <NavModule
                modules={navModules}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Area - Add pb-16 to account for fixed footer */}
            <div className={`
                flex-1 transition-all duration-300 
                ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}
                min-h-screen pb-16
            `}>
                <main className="p-8">
                    {/* Content based on selectedModule */}
                    {selectedModule === 'dashboard' && <DashboardView />}
                    {selectedModule === 'mmc' && <MaterialMovementCard />}
                    {selectedModule === '4m-cts' && <FourMChangeTrackSheet />}
                    {selectedModule === 'cpf' && <ControlPlanForm />}
                    {selectedModule === 'mcs' && <MachineCheckSheet />}
                    {selectedModule === 'pf' && <ProcessFlowDiagram />}
                    {selectedModule === 'rcr' && <RetroactiveCheckRecord />}
                    {selectedModule === 'iic-sar' && <InspectionForm />}
                    {selectedModule === 'mmm' && <ManMachineMatrix />}
                    {selectedModule === 'cm' && <ChangeManagementView />}
                    {selectedModule === 'cdb' && <ChangeDisplayBoard />}
                </main>
            </div>
        </div>
    );
};

export default Home;





// import React, { useState } from 'react';
// import NavModule from './components/sidebar/sidebar';
// import { navModules } from './components/sidebar/navModules';
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

// const Home = () => {
//     const [selectedModule, setSelectedModule] = useState('dashboard');
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//     return (
//         <div className="flex min-h-screen">
//             {/* Navigation Sidebar */}
//             <NavModule
//                 modules={navModules}
//                 selectedModule={selectedModule}
//                 setSelectedModule={setSelectedModule}
//                 sidebarCollapsed={sidebarCollapsed}
//             />

//             {/* Main Content Area - FIXED: Now accounts for sidebar properly */}
//             <div className={`
//                 flex-1 transition-all duration-300 
//                 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}
//                 min-h-screen
//             `}>
//                 <main className="p-8">
//                     {/* Content based on selectedModule */}
//                     {selectedModule === 'dashboard' && <DashboardView />}
//                     {selectedModule === 'mmc' && <MaterialMovementCard />}
//                     {selectedModule === '4m-cts' && <FourMChangeTrackSheet />}
//                     {selectedModule === 'cpf' && <ControlPlanForm />}
//                     {selectedModule === 'mcs' && <MachineCheckSheet />}
//                     {selectedModule === 'pf' && <ProcessFlowDiagram />}
//                     {selectedModule === 'rcr' && <RetroactiveCheckRecord />}
//                     {selectedModule === 'iic-sar' && <InspectionForm />}
//                     {selectedModule === 'mmm' && <ManMachineMatrix />}
//                     {selectedModule === 'cm' && <ChangeManagementView />}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Home;

// import React, { useState } from 'react';
// import NavModule from './components/sidebar/sidebar';
// import { navModules } from './components/sidebar/navModules';
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

// // 

// const Home = () => {
//     const [selectedModule, setSelectedModule] = useState('dashboard');
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//     return (
//         <div className="flex min-h-screen">
//             {/* Navigation Sidebar */}
//             <NavModule
//                 modules={navModules}
//                 selectedModule={selectedModule}
//                 setSelectedModule={setSelectedModule}
//                 sidebarCollapsed={sidebarCollapsed}
//             />

//             {/* Main Content Area */}
//             <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
//                 {/* Your header, main content, etc. would go here */}
//                 <main className="p-8">
//                     {/* Content based on selectedModule */}
//                     {selectedModule === 'dashboard' && <DashboardView />}
                   
                    
//                     {selectedModule === 'mmc' && <MaterialMovementCard />}
//                     {selectedModule === '4m-cts' && <FourMChangeTrackSheet />}
//                     {selectedModule === 'cpf' && <ControlPlanForm />}
//                     {selectedModule === 'mcs' && <MachineCheckSheet />}
//                     {selectedModule === 'pf' && <ProcessFlowDiagram />}
//                     {selectedModule === 'rcr' && <RetroactiveCheckRecord />}
//                     {selectedModule === 'iic-sar' && <InspectionForm />}
//                     {selectedModule === 'mmm' && <ManMachineMatrix />}
//                     {selectedModule === 'cm' && <ChangeManagementView />}


             
//                     {/* Other module views */}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Home;



// import React, { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import NavModule from './components/sidebar/sidebar';
// import { navModules } from './components/sidebar/navModules';

// const Home = () => {
//     // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//     const location = useLocation();
//     const [selectedModule, setSelectedModule] = useState('dashboard');
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


//     return (
//         <div className="flex min-h-screen">
//             {/* <NavModule
//                 modules={navModules}
//                 sidebarCollapsed={sidebarCollapsed}
//             /> */}
//              <NavModule
//                 modules={navModules}
//                 selectedModule={selectedModule}
//                 setSelectedModule={setSelectedModule}
//                 sidebarCollapsed={sidebarCollapsed}
//             />
//             <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
//                 <main className="p-8">
//                     {/* Show the current path */}
//                     <div className="text-gray-500 mb-4">
//                         Current path: {location.pathname}
//                     </div>
//                     {/* This is where the routed content will appear */}
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Home;