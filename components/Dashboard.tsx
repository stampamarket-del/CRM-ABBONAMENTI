
import React, { useMemo } from 'react';
import { Client, Product } from '../types';
import { MailIcon, BarChartIcon, UsersIcon } from './Icons';

interface DashboardProps {
  clients: Client[];
  products: Product[];
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

// Componente helper per i grafici della dashboard
const DashboardBarChart: React.FC<{
  title: string;
  icon: React.ReactNode;
  data: { label: string; value: number }[];
  colorClass: string; // es. 'bg-blue-500'
  textColorClass: string; // es. 'text-blue-700'
  formatValue?: (val: number) => string;
}> = ({ title, icon, data, colorClass, textColorClass, formatValue }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);
  const scale = maxValue > 0 ? maxValue : 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gray-100 ${textColorClass}`}>
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`font-bold ${textColorClass}`}>
                  {formatValue ? formatValue(item.value) : item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${colorClass} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / scale) * 100}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic text-center py-4">Nessun dato disponibile</p>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ clients, products }) => {
  const activeClients = clients.filter(c => new Date(c.subscription.endDate) > new Date());
  
  const totalRevenue = clients.reduce((acc, client) => {
    const product = products.find(p => p.id === client.productId);
    return acc + (product?.price || 0);
  }, 0);

  const expiringSoonClients = clients.filter(client => {
    const endDate = new Date(client.subscription.endDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return endDate > now && endDate <= thirtyDaysFromNow;
  });

  // Calcolo statistiche per i grafici
  const chartsData = useMemo(() => {
    // Ordina prodotti per nome o altro criterio se necessario
    return products.map(product => {
      const productActiveClients = activeClients.filter(c => c.productId === product.id);
      const count = productActiveClients.length;
      const revenue = count * product.price;
      return {
        name: product.name,
        activeCount: count,
        revenue: revenue
      };
    }).sort((a, b) => b.revenue - a.revenue); // Ordina per revenue decrescente
  }, [products, activeClients]);

  const activeClientsData = chartsData.map(d => ({ label: d.name, value: d.activeCount }));
  const revenueData = chartsData.map(d => ({ label: d.name, value: d.revenue }));

  const handleSendReminder = (client: Client) => {
    const product = products.find(p => p.id === client.productId);
    const endDate = new Date(client.subscription.endDate).toLocaleDateString('it-IT');

    const subject = `Promemoria Scadenza Abbonamento`;
    const body = `Ciao ${client.name},

Ti scriviamo per ricordarti che il tuo abbonamento per "${product?.name || 'il nostro servizio'}" è in scadenza il ${endDate}.

Se desideri rinnovare o discutere le opzioni disponibili, non esitare a contattarci.

Grazie,
Il Tuo Team`;

    const mailtoLink = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Clienti Totali" value={clients.length} />
        <StatCard title="Abbonamenti Attivi" value={activeClients.length} />
        <StatCard title="Guadagno Totale Stimato" value={`${totalRevenue.toFixed(2)}€`} />
      </div>

      {/* Grafici */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardBarChart 
            title="Clienti Attivi per Prodotto" 
            icon={<UsersIcon className="w-6 h-6" />}
            data={activeClientsData}
            colorClass="bg-blue-500"
            textColorClass="text-blue-600"
        />
        <DashboardBarChart 
            title="Guadagno Attivo per Prodotto" 
            icon={<BarChartIcon className="w-6 h-6" />}
            data={revenueData}
            colorClass="bg-green-500"
            textColorClass="text-green-600"
            formatValue={(val) => `${val.toFixed(2)}€`}
        />
      </div>

      {/* Tabella Scadenze */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Abbonamenti in Scadenza (Prossimi 30gg)</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {expiringSoonClients.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Scadenza</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giorni Rimanenti</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azione</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expiringSoonClients.map(client => {
                    const endDate = new Date(client.subscription.endDate);
                    const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    let daysClass = "text-gray-900";
                    if(daysLeft < 0) daysClass = "text-red-600 font-bold";
                    else if(daysLeft <= 7) daysClass = "text-red-500 font-bold";
                    else if(daysLeft <= 30) daysClass = "text-yellow-600 font-bold";
                    else daysClass = "text-green-600 font-bold";

                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name} {client.surname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endDate.toLocaleDateString('it-IT')}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${daysClass}`}>{daysLeft}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                           <button 
                              onClick={() => handleSendReminder(client)}
                              className="flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold py-1 px-3 rounded-full text-xs hover:bg-indigo-200 transition-colors"
                            >
                              <MailIcon className="w-4 h-4" />
                              Invia Promemoria
                            </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-center text-gray-500">Nessun abbonamento in scadenza nei prossimi 30 giorni.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
