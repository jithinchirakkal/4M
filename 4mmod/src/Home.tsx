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
    // State initialization is removed, now using props
    
    // Determine the width class based on collapse status (using w-72 from new design)
    const contentMarginClass = sidebarCollapsed ? 'md:ml-20' : 'md:ml-72';

    return (
        <div className="flex min-h-screen">
            {/* Navigation Sidebar */}
            <Sidebar // Renamed from NavModule
                modules={navModules}
                selectedModule={selectedModule}
                setSelectedModule={setSelectedModule}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Area - Add pb-16 to account for fixed footer */}
            <div className={`
                flex-1 transition-all duration-300 
                ${contentMarginClass}
                min-h-screen pb-16
            `}>
                <main className="p-8">
                    {/* Content based on selectedModule */}
                    {selectedModule === 'dashboard' && <DashboardView />}
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
                </main>
            </div>
        </div>
    );
};

export default Home;