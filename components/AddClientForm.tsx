import React, { useState } from 'react';
import { Client, Product, Seller, SubscriptionType } from '../types';
import { XIcon } from './Icons';

interface AddClientFormProps {
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onClose: () => void;
  products: Product[];
  sellers: Seller[];
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onAddClient, onClose, products, sellers }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    companyName: '',
    vatNumber: '',
    address: '',
    email: '',
    iban: '',
    otherInfo: '',
    startDate: '',
    endDate: '',
    productId: '',
    sellerId: '',
    subscriptionType: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, surname, email, address, startDate, endDate, productId, subscriptionType } = formData;
    if (!name || !surname || !email || !address || !startDate || !endDate || !productId || !subscriptionType) {
      setError('Compilare tutti i campi obbligatori, inclusi nome, cognome, email, indirizzo, prodotto, date e tipo abbonamento.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      setError("La data di fine deve essere successiva alla data di inizio.");
      return;
    }

    setError(null);
    onAddClient({
      name: formData.name,
      surname: formData.surname,
      companyName: formData.companyName,
      vatNumber: formData.vatNumber,
      address: formData.address,
      email: formData.email,
      iban: formData.iban,
      otherInfo: formData.otherInfo,
      productId: formData.productId,
      sellerId: formData.sellerId,
      subscriptionType: formData.subscriptionType as SubscriptionType,
      subscription: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Aggiungi Nuovo Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="text" name="surname" placeholder="Cognome" value={formData.surname} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="companyName" placeholder="Nome Azienda (Opzionale)" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="vatNumber" placeholder="Partita IVA (Opzionale)" value={formData.vatNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="productId" value={formData.productId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Seleziona Prodotto *</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price}€</option>)}
            </select>
            <select name="sellerId" value={formData.sellerId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleziona Venditore</option>
              {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Abbonamento *</label>
              <select name="subscriptionType" value={formData.subscriptionType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Seleziona Tipo</option>
                  <option value="monthly">Mensile</option>
                  <option value="annual">Annuale</option>
                  <option value="trial">Prova</option>
              </select>
            </div>
          <input type="text" name="address" placeholder="Indirizzo" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="text" name="iban" placeholder="IBAN" value={formData.iban} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea name="otherInfo" placeholder="Altre Informazioni" value={formData.otherInfo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2}></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inizio Abbonamento *</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fine Abbonamento *</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Annulla</button>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Aggiungi Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientForm;