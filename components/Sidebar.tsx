
import React from 'react';
import { DashboardIcon, UsersIcon, BriefcaseIcon, PackageIcon, BarChartIcon, CalculatorIcon, SaveIcon } from './Icons';

type View = 'dashboard' | 'clients' | 'sellers' | 'products' | 'reports' | 'business' | 'salva';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8 px-2">CRM</div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => setCurrentView('dashboard')}
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          label="Clienti"
          isActive={currentView === 'clients'}
          onClick={() => setCurrentView('clients')}
        />
        <NavItem
          icon={<BriefcaseIcon className="w-6 h-6" />}
          label="Venditori"
          isActive={currentView === 'sellers'}
          onClick={() => setCurrentView('sellers')}
        />
        <NavItem
          icon={<PackageIcon className="w-6 h-6" />}
          label="Prodotti"
          isActive={currentView === 'products'}
          onClick={() => setCurrentView('products')}
        />
        <NavItem
          icon={<BarChartIcon className="w-6 h-6" />}
          label="Report Vendite"
          isActive={currentView === 'reports'}
          onClick={() => setCurrentView('reports')}
        />
         <NavItem
          icon={<CalculatorIcon className="w-6 h-6" />}
          label="Business"
          isActive={currentView === 'business'}
          onClick={() => setCurrentView('business')}
        />
        <NavItem
          icon={<SaveIcon className="w-6 h-6" />}
          label="Backup Dati"
          isActive={currentView === 'salva'}
          onClick={() => setCurrentView('salva')}
        />
      </nav>
    </div>
  );
};

export default Sidebar;