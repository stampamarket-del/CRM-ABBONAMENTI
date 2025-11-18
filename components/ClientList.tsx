
import React, { useMemo } from 'react';
import { Client, Product, Seller } from '../types';
import ClientCard from './ClientCard';
import Calendar from './Calendar';

interface ClientListProps {
  clients: Client[];
  allClientsForCalendar: Client[];
  totalClientsCount: number;
  onDeleteClient: (clientId: string) => void;
  onEditClient: (client: Client) => void;
  products: Product[];
  sellers: Seller[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  allClientsForCalendar,
  totalClientsCount, 
  onDeleteClient, 
  onEditClient, 
  products, 
  sellers,
  selectedDate,
  setSelectedDate
}) => {

  const expiryEvents = useMemo(() => {
    return allClientsForCalendar.map(c => new Date(c.subscription.endDate));
  }, [allClientsForCalendar]);

  const handleDateSelect = (date: Date) => {
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      setSelectedDate(null); // Deselect if the same date is clicked
    } else {
      setSelectedDate(date);
    }
  };

  const renderClientGrid = () => {
    if (clients.length === 0) {
      return (
        <div className="text-center py-16 col-span-1 md:col-span-2 xl:col-span-3">
          <h2 className="text-2xl font-semibold text-gray-600">Nessun cliente corrisponde ai filtri.</h2>
          <p className="text-gray-500 mt-2">Prova a modificare la ricerca o a resettare i filtri.</p>
        </div>
      );
    }
    return (
      <>
        {clients.map(client => (
          <ClientCard 
            key={client.id} 
            client={client} 
            onDelete={onDeleteClient}
            onEdit={onEditClient}
            product={products.find(p => p.id === client.productId)}
            seller={sellers.find(s => s.id === client.sellerId)}
          />
        ))}
      </>
    );
  };
  
  if (totalClientsCount === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-600">Nessun cliente trovato.</h2>
        <p className="text-gray-500 mt-2">Clicca su "Aggiungi Nuovo Cliente" per iniziare!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="sticky top-8">
            <Calendar 
                events={expiryEvents}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />
            {selectedDate && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Mostrando scadenze per: <span className="font-bold">{selectedDate.toLocaleDateString('it-IT')}</span>
                    </p>
                    <button 
                        onClick={() => setSelectedDate(null)}
                        className="bg-gray-200 text-gray-800 text-xs font-semibold py-1 px-3 rounded-full hover:bg-gray-300"
                    >
                        Mostra tutti
                    </button>
                </div>
            )}
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {renderClientGrid()}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
