import React from "react";
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
import PerishableToolSheet from './components/PerishableToolChangeFrequencyCheckSheet/PerishableToolChangeFrequencyCheckSheet';
import ProductCharacteristicsSheet from './components/ProductCharacteristicCheckSheet/ProductCharacteristicCheckSheet';
import ProcessCheckSheet from './components/ProcessCheckSheet/ProcessCheckSheet';
import PaintQualitySheet from './components/PaintshopQualityChecksheet/PaintshopQualitychecksheet'
import UserManagement from './components/Usermanagement/Usermanagement'
import ApprovalsPage from './components/Approvals/ApprovalsPage';
import CustomerApprovalsPage from './components/CustomerApprovalsView/CustomerApprovalsView';
import IdentificationPage from './components/IDPSN/IdentificationPage';
import Containment from "./components/Containment/Containment";
import FourMChangeHistory from "./components/FourMChangeHistory/FourMChangeHistory";
import CustomerApprovalSheet from "./components/CustomerApprovalsView/CustomerApprovalSheet";
import OnJobTraining from "./components/Level2OjtTable/Level2OjtTable";
import StationConfiguration from "./components/StationConfiguration/StationConfiguration";
import EmployeeManagement from "./components/EmployeeManagement/EmployeeManagement";
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
  const contentMarginClass = sidebarCollapsed ? "md:ml-24" : "md:ml-80";

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
      <div
        className={`
                flex-1 transition-all duration-300 
                ${contentMarginClass}
                min-h-screen
            `}
      >
        {/* Apply pt-16 (or pt-20 for margin) to push the content down past the fixed Navbar.
                    This margin only applies to the main content area *next to* the fixed sidebar.
                */}
        <main className="p-8 bg-gray-200 min-h-screen">
          {/* Content based on selectedModule */}
          {selectedModule === "dashboard" && <DashboardView />}
          {/* ... (all other module routes) ... */}
          {selectedModule === "mmc" && <MaterialMovementCard />}
          {/* {selectedModule === "4m-cts" && <FourMChangeTrackSheet />} */}
          {selectedModule === "4m-cts" && <FourMChangeTrackSheet setSelectedModule={setSelectedModule} />}
          {selectedModule === "cpf" && <ControlPlanForm />}
          {/* {selectedModule === "mcs" && <MachineCheckSheet />} */}
          {selectedModule === "mcs" && (  <MachineCheckSheet  onBack={() => setSelectedModule("cm")}  />)}

          {selectedModule === "pf" && (
            <ProcessFlowDiagram onNavigate={setSelectedModule} />
          )}
          {selectedModule === "rcr" && <RetroactiveCheckRecord setSelectedModule={setSelectedModule} />}
          {selectedModule === "iic-sar" && <InspectionForm />}
          {selectedModule === "mmm" && <ManMachineMatrix />}
          {/* {selectedModule === 'cm' && <ChangeManagementView />} */}
          {selectedModule === "cm" && (
            <ChangeManagementView setSelectedModule={setSelectedModule} />
          )}
          {selectedModule === "approvals" && <ApprovalsPage setSelectedModule={setSelectedModule} />}
          {selectedModule === "cdb" && <ChangeDisplayBoard />}
          {selectedModule === "4m-flow" && <FlowDiagram />}
          {selectedModule === "4m" && <FourMChangeResponsibility />}
          {selectedModule === "4MP" && <FourMChangeProcedure />}
          {selectedModule === "valid" && <ChangeValidationForm />}
          {selectedModule === "sps" && <Suspected />}
          {selectedModule === "CIN" && <ChangeInformationNote />}
          {selectedModule === "4m-method" && <FourMMethodPage />}
          {/* {selectedModule === "ojt" && <Ojtform />} */}
          {selectedModule === "ojt" && (
            <OnJobTraining
              onBack={() => setSelectedModule("cm")}     // ← returns to main detail / change management view
            />
          )}
          {/* {selectedModule === "process-characteritics" && <ProcessCheckSheet />} */}
          {/* {selectedModule === "tool-sheet" && <PerishableToolSheet />} */}
          {/* {selectedModule === "product-sheet" && <ProductCharacteristicsSheet />} */}
          {/* {selectedModule === 'paint-sheet' && <PaintQualitySheet />} */}
          {selectedModule === "process-sheet" && (
             <ProcessCheckSheet onBack={() => setSelectedModule("cm")} />
          )}

          {selectedModule === "tool-sheet" && (
             <PerishableToolSheet onBack={() => setSelectedModule("cm")} />
          )}

          {selectedModule === "product-sheet" && (
             <ProductCharacteristicsSheet onBack={() => setSelectedModule("cm")} />
          )}

          {selectedModule === 'paint-sheet' && (
             <PaintQualitySheet onBack={() => setSelectedModule("cm")} />
          )}
          {selectedModule === 'users' && <UserManagement />}
          {selectedModule === 'FourMChangeHistory' && <FourMChangeHistory />}
          {/* {selectedModule === "containment-form" && <Containment />} */}
          {selectedModule === "containment-form" && (
          <Containment
          onReturnToDetail={() => setSelectedModule("cm")}   // ← important change
            />)}
          {selectedModule === 'customer-approvals' && <CustomerApprovalsPage setSelectedModule={setSelectedModule} />}
          {selectedModule === "identification" && (
              <IdentificationPage setSelectedModule={setSelectedModule} />

          )}

          {selectedModule === 'customer-sheet' && (
              <CustomerApprovalSheet 
                  onBack={() => setSelectedModule('cm')} 
              />
          )}
          {selectedModule === 'station-settings' && <StationConfiguration />}
          {selectedModule === 'mastertable'  && <EmployeeManagement/>}
          

        </main>
      </div>
    </div>
  );
};

export default Home;
