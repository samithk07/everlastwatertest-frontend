import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Logo from './components/logo';
import WaterTestForm from './components/watertestfrom';
import Dashboard from './components/dashbord';
import { MdOutlineWaterDrop } from "react-icons/md";

function App() {
  const [refreshDashboard, setRefreshDashboard] = useState(false);

  const handleFormSubmit = () => {
    setRefreshDashboard(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#222831',
            color: '#EEEEEE',
          },
          success: {
            iconTheme: {
              primary: '#00ADB5',
              secondary: '#EEEEEE',
            },
          },
        }}
      />
      
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Logo />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <WaterTestForm onFormSubmit={handleFormSubmit} />
        <Dashboard key={refreshDashboard} />
      </main>

      <footer className="bg-[#222831] text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#00ADB5] rounded-lg flex items-center justify-center">
                <MdOutlineWaterDrop className="text-white text-sm" />
              </div>
              <span className="text-sm">© 2024 Everlast Water Solution</span>
            </div>
            <div className="text-sm text-[#EEEEEE]">
              <span className="bg-[#00ADB5] px-3 py-1 rounded-full text-xs">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;