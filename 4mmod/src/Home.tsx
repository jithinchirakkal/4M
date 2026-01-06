import React from 'react';
// Renamed NavModule to Sidebar for clarity, update import path if needed.
import Sidebar from './components/sidebar/sidebar'; 
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
import FlowDiagram from './components/ProcessFlowDiagram/4MFlow';
import FourMChangeResponsibility from './components/FourMChangeResponsibility/FourMChangeResponsibility';
import FourMChangeProcedure from './components/FourMChangeProcedure/FourMChangeProcedure';
import ChangeValidationForm from './components/ChangeValidationForm/ChangeValidationForm';
import Suspected from './components/suspected/suspected';
import ChangeInformationNote from './components/ChangeInformationNote/ChangeInformationNote';
import FourMMethodPage from './components/cm/method';
import Ojtform from './components/Level2OjtTable/Level2OjtTable';
import ProcessCheckSheet from './components/ProductCharcteristics/ProductCharacteristics'

// Define the Props interface for Home
interface HomeProps {
    selectedModule: string;
    setSelectedModule: (id: string) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}


// Update Home component to receive props
const Home: React.FC<HomeProps> = ({
    selectedModule,
    setSelectedModule,
    sidebarCollapsed,
    setSidebarCollapsed,
}) => {
    // Determine the width class based on collapse status 
    const contentMarginClass = sidebarCollapsed ? 'md:ml-24' : 'md:ml-80';

    return (
        <div className="flex min-h-screen">
            
            {/* Navigation Sidebar */}
            {/* The Sidebar component's internal positioning needs the z-index and top: 0 */}
            <Sidebar 
                modules={navModules}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Area: Use a high top margin (e.g., pt-20) to clear the FIXED Navbar for the section next to the sidebar. */}
            <div className={`
                flex-1 transition-all duration-300 
                ${contentMarginClass}
                min-h-screen
            `}>
                {/* Apply pt-16 (or pt-20 for margin) to push the content down past the fixed Navbar.
                    This margin only applies to the main content area *next to* the fixed sidebar.
                */}
                <main className="p-8 bg-gray-200 min-h-screen"> 
                    {/* Content based on selectedModule */}
                    {selectedModule === 'dashboard' && <DashboardView />}
                    {/* ... (all other module routes) ... */}
                    {selectedModule === 'mmc' && <MaterialMovementCard />}
                    {selectedModule === '4m-cts' && <FourMChangeTrackSheet />}
                    {selectedModule === 'cpf' && <ControlPlanForm />}
                    {selectedModule === 'mcs' && <MachineCheckSheet />}
                    {selectedModule === 'pf' && <ProcessFlowDiagram onNavigate={setSelectedModule} />}
                    {selectedModule === 'rcr' && <RetroactiveCheckRecord />}
                    {selectedModule === 'iic-sar' && <InspectionForm />}
                    {selectedModule === 'mmm' && <ManMachineMatrix />}
                    {selectedModule === 'cm' && <ChangeManagementView />}
                    {selectedModule === 'cdb' && <ChangeDisplayBoard />}
                    {selectedModule === '4m-flow' && <FlowDiagram />}
                    {selectedModule === '4m' && <FourMChangeResponsibility />}
                    {selectedModule === '4MP' && < FourMChangeProcedure />}
                    {selectedModule === 'valid' && <ChangeValidationForm />}
                    {selectedModule === 'sps' && <Suspected />}
                    {selectedModule === 'CIN' && <ChangeInformationNote />}
                    {selectedModule === '4m-method' && <FourMMethodPage />}
                    {selectedModule === 'ojt' && <Ojtform />}
                    {selectedModule === 'process-characteritics' && <ProcessCheckSheet/>}
                    
                </main>
            </div>
        </div>
    );
};

export default Home;