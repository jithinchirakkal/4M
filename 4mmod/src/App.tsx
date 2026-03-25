import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Nav"; 
import LoginPage from "./components/Auth/Login";
import Home from "./Home";
// import Suspected from ""; // ADD THIS IMPORT
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import logos from './assets/Images/logo.png'; 
import Suspected from "./components/suspected/suspected";
import SuspectedLotViewer from "./components/suspected/Suspectedlotviewer ";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Main App Content Component
const AppContent = () => {
  const [selectedModule, setSelectedModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleHomeClick = () => {
    setSelectedModule('dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar - FIXED and HIGH Z-INDEX */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
          <Navbar 
            logo1={logos}
            username={user?.name || "User"} 
            email={user?.email || ""} 
            version="1.0.0" 
            onHomeClick={handleHomeClick}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className={isAuthenticated ? "flex-1 pt-16" : "flex-1"}>
        <Routes>
          {/* PUBLIC ROUTE FOR QR CODE - ADD THIS BEFORE OTHER ROUTES */}
          <Route path="/suspected-lot/:id" element={<Suspected />} />
          <Route path="/suspected-lot-viewer" element={<SuspectedLotViewer />} />
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home 
                  selectedModule={selectedModule}
                  setSelectedModule={setSelectedModule}
                  sidebarCollapsed={sidebarCollapsed}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any unknown routes */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </div>
  );
};

// Main App Component with AuthProvider
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
