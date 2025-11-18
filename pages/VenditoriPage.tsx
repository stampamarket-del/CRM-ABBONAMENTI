import React, { useState, useMemo } from 'react';
import { Seller, Client, Product } from '../types';
import { PlusCircleIcon, PencilIcon, Trash2Icon, BriefcaseIcon, UsersIcon } from '../components/Icons';

interface AddSellerFormProps {
  onAddSeller: (seller: Omit<Seller, 'id'>) => void;
  onClose: () => void;
}

const AddSellerForm: React.FC<AddSellerFormProps> = ({ onAddSeller, onClose }) => {
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commissionRate || isNaN(parseFloat(commissionRate))) return;
    onAddSeller({ name, commissionRate: parseFloat(commissionRate) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold p-4 border-b">Aggiungi Nuovo Venditore</h2>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input type="text" placeholder="Nome Venditore" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="number" placeholder="Provvigione (%)" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} className="w-full px-3 py-2 border rounded" required step="0.1" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annulla</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Aggiungi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditSellerFormProps {
  seller: Seller;
  onUpdateSeller: (seller: Seller) => void;
  onClose: () => void;
}

const EditSellerForm: React.FC<EditSellerFormProps> = ({ seller, onUpdateSeller, onClose }) => {
  const [name, setName] = useState(seller.name);
  const [commissionRate, setCommissionRate] = useState(seller.commissionRate.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !commissionRate || isNaN(parseFloat(commissionRate))) return;
    onUpdateSeller({ ...seller, name, commissionRate: parseFloat(commissionRate) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold p-4 border-b">Modifica Venditore</h2>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input type="text" placeholder="Nome Venditore" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="number" placeholder="Provvigione (%)" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} className="w-full px-3 py-2 border rounded" required step="0.1" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annulla</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salva Modifiche</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Scheda Venditore
const SellerCard: React.FC<{
  seller: Seller;
  stats: {
    salesCount: number;
    totalRevenue: number;
    totalCommission: number;
  };
  onEdit: (seller: Seller) => void;
  onDelete: (sellerId: string) => void;
}> = ({ seller, stats, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{seller.name}</h3>
              <p className="text-md font-semibold text-indigo-600">Provvigione: {seller.commissionRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(seller)} className="text-gray-400 hover:text-blue-600 p-2 rounded-full" aria-label={`Modifica ${seller.name}`}>
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(seller.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full" aria-label={`Elimina ${seller.name}`}>
              <Trash2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t p-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm text-gray-500">Clienti</p>
          <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-1">
            <UsersIcon className="w-5 h-5 text-gray-400" /> {stats.salesCount}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Guadagno</p>
          <p className="text-lg font-bold text-gray-800">{stats.totalRevenue.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Provvigioni</p>
          <p className="text-lg font-bold text-green-600">{stats.totalCommission.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );
};

interface VenditoriPageProps {
  sellers: Seller[];
  clients: Client[];
  products: Product[];
  onAddSeller: (seller: Omit<Seller, 'id'>) => void;
  onUpdateSeller: (seller: Seller) => void;
  onDeleteSeller: (sellerId: string) => void;
}

const VenditoriPage: React.FC<VenditoriPageProps> = ({ sellers, clients, products, onAddSeller, onUpdateSeller, onDeleteSeller }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

   const sellerStats = useMemo(() => {
     return sellers.map(seller => {
       const sellerClients = clients.filter(client => client.sellerId === seller.id && new Date(client.subscription.endDate) > new Date());
       
       const report = sellerClients.reduce((acc, client) => {
         const product = products.find(p => p.id === client.productId);
         if (product) {
           const commission = (product.price * seller.commissionRate) / 100;
           acc.totalRevenue += product.price;
           acc.totalCommission += commission;
         }
         return acc;
       }, { totalRevenue: 0, totalCommission: 0 });

       return {
         ...seller,
         stats: {
           salesCount: sellerClients.length,
           ...report
         }
       };
     });
   }, [sellers, clients, products]);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
            <PlusCircleIcon className="w-5 h-5" />
            Aggiungi Venditore
        </button>
      </div>

      {sellers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sellerStats.map(seller => (
            <SellerCard
              key={seller.id}
              seller={seller}
              stats={seller.stats}
              onEdit={setEditingSeller}
              onDelete={onDeleteSeller}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
            <BriefcaseIcon className="mx-auto w-12 h-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Nessun venditore inserito.</h2>
            <p className="mt-2 text-gray-500">Aggiungi i membri del tuo team di vendita per iniziare.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 flex items-center mx-auto gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                <PlusCircleIcon className="w-5 h-5" />
                Aggiungi il primo Venditore
            </button>
        </div>
      )}

      {isModalOpen && <AddSellerForm onAddSeller={onAddSeller} onClose={() => setIsModalOpen(false)} />}
      {editingSeller && <EditSellerForm seller={editingSeller} onUpdateSeller={onUpdateSeller} onClose={() => setEditingSeller(null)} />}
    </div>
  );
};

export default VenditoriPage;