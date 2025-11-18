import React from 'react';
import { Client, Product, Seller } from '../types';
import ClientCard from './ClientCard';

interface ClientListProps {
  clients: Client[];
  totalClientsCount: number;
  onDeleteClient: (clientId: string) => void;
  onEditClient: (client: Client) => void;
  products: Product[];
  sellers: Seller[];
}

const ClientList: React.FC<ClientListProps> = ({ clients, totalClientsCount, onDeleteClient, onEditClient, products, sellers }) => {
  if (totalClientsCount === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-600">Nessun cliente trovato.</h2>
        <p className="text-gray-500 mt-2">Clicca su "Aggiungi Nuovo Cliente" per iniziare!</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-600">Nessun cliente corrisponde ai filtri.</h2>
        <p className="text-gray-500 mt-2">Prova a modificare la ricerca o a resettare i filtri.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  );
};

export default ClientList;