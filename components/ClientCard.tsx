
import React from 'react';
import { Client, Product, Seller, SubscriptionType } from '../types';
import SubscriptionTimer from './SubscriptionTimer';
import { Trash2Icon, AlertTriangleIcon, PencilIcon, ClockIcon } from './Icons';

interface ClientCardProps {
  client: Client;
  onDelete: (clientId: string) => void;
  onEdit: (client: Client) => void;
  product?: Product;
  seller?: Seller;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete, onEdit, product, seller }) => {

  const commission = product && seller ? (product.price * seller.commissionRate) / 100 : 0;
  
  const isExpiringSoon = () => {
    const endDate = new Date(client.subscription.endDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return endDate > now && endDate <= thirtyDaysFromNow;
  };
  
  const isNotStarted = new Date(client.subscription.startDate) > new Date();

  const daysRemaining = Math.ceil((new Date(client.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  let badgeClass = 'bg-green-100 text-green-800';
  let badgeText = `${daysRemaining} GG`;

  if (isNotStarted) {
    badgeClass = 'bg-blue-100 text-blue-800';
    badgeText = 'FUTURO';
  } else if (daysRemaining < 0) {
    badgeClass = 'bg-red-100 text-red-800';
    badgeText = `SCADUTO (${Math.abs(daysRemaining)}gg)`;
  } else if (daysRemaining === 0) {
    badgeClass = 'bg-orange-100 text-orange-800';
    badgeText = 'OGGI';
  } else if (daysRemaining <= 7) {
    badgeClass = 'bg-red-100 text-red-800';
    badgeText = `${daysRemaining} GG`;
  } else if (daysRemaining <= 30) {
    badgeClass = 'bg-yellow-100 text-yellow-800';
    badgeText = `${daysRemaining} GG`;
  }

  const subscriptionTypeLabels: Record<SubscriptionType, string> = {
    monthly: 'Mensile',
    annual: 'Annuale',
    trial: 'Prova',
  };
  const subscriptionLabel = subscriptionTypeLabels[client.subscriptionType] || 'N/D';

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare il cliente ${client.name} ${client.surname}? Questa azione non può essere annullata.`)) {
      onDelete(client.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 flex flex-col relative">
      {isExpiringSoon() && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 p-2 rounded-full z-10" title="Abbonamento in scadenza a breve!">
          <AlertTriangleIcon className="w-5 h-5" />
        </div>
      )}
      {isNotStarted && (
        <div className="absolute top-4 right-4 bg-blue-400 text-blue-900 p-2 rounded-full z-10" title="Abbonamento non ancora iniziato!">
          <ClockIcon className="w-5 h-5" />
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
                 <h3 className="text-2xl font-bold text-gray-900 leading-none">{client.name} {client.surname}</h3>
                 <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${badgeClass}`}>
                    {badgeText}
                 </span>
            </div>
            {client.companyName && <p className="text-md font-semibold text-gray-700">{client.companyName}</p>}
            <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:underline">{client.email}</a>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button 
                onClick={() => onEdit(client)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full"
                aria-label="Modifica cliente"
            >
                <PencilIcon className="w-5 h-5" />
            </button>
            <button 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full"
                aria-label="Elimina cliente"
            >
                <Trash2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <div>
            <strong className="font-medium text-gray-800 block">Prodotto (Tipo)</strong>
            <span>
              {product ? `${product.name} (${product.price.toFixed(2)}€)` : 'N/D'}
              {' - '}
              <span className="font-semibold">{subscriptionLabel}</span>
            </span>
          </div>
           <div>
            <strong className="font-medium text-gray-800 block">Venditore (Provvigione)</strong>
            <span>
              {seller ? `${seller.name} (${commission.toFixed(2)}€ - ${seller.commissionRate}%)` : 'N/D'}
            </span>
          </div>
          <div>
            <strong className="font-medium text-gray-800 block">Partita IVA</strong>
            <span>{client.vatNumber || 'N/D'}</span>
          </div>
          <div>
            <strong className="font-medium text-gray-800 block">Indirizzo</strong>
            <span>{client.address || 'N/D'}</span>
          </div>
          <div>
            <strong className="font-medium text-gray-800 block">IBAN</strong>
            <span>{client.iban || 'N/D'}</span>
          </div>
          <div>
            <strong className="font-medium text-gray-800 block">Info Aggiuntive</strong>
            <p className="text-xs italic">{client.otherInfo || 'Nessuna'}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-6 border-t">
        <SubscriptionTimer subscription={client.subscription} />
      </div>
    </div>
  );
};

export default ClientCard;
