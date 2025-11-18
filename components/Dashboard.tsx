import React from 'react';
import { Client, Product } from '../types';
import { MailIcon } from './Icons';

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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Clienti Totali" value={clients.length} />
        <StatCard title="Abbonamenti Attivi" value={activeClients.length} />
        <StatCard title="Guadagno Totale Stimato" value={`${totalRevenue.toFixed(2)}€`} />
      </div>

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
                    return (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name} {client.surname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{endDate.toLocaleDateString('it-IT')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-bold">{daysLeft}</td>
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