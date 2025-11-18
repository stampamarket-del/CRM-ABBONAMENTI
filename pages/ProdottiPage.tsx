import React, { useState, useMemo } from 'react';
import { Product, Client } from '../types';
import { PlusCircleIcon, PencilIcon, Trash2Icon, PackageIcon, UsersIcon } from '../components/Icons';
import ProductBarChart from '../components/ProductBarChart';

// Form per Aggiungere
interface AddProductFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || isNaN(parseFloat(price))) return;
    onAddProduct({ name, price: parseFloat(price) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold p-4 border-b">Aggiungi Nuovo Prodotto</h2>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input type="text" placeholder="Nome Prodotto" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="number" placeholder="Prezzo" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded" required step="0.01" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annulla</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Aggiungi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Form per Modificare
interface EditProductFormProps {
  product: Product;
  onUpdateProduct: (product: Product) => void;
  onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onUpdateProduct, onClose }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || isNaN(parseFloat(price))) return;
    onUpdateProduct({ ...product, name, price: parseFloat(price) });
    onClose();
  };
  
  return (
     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-bold p-4 border-b">Modifica Prodotto</h2>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input type="text" placeholder="Nome Prodotto" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          <input type="number" placeholder="Prezzo" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border rounded" required step="0.01" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annulla</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salva Modifiche</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Scheda Prodotto
const ProductCard: React.FC<{
  product: Product;
  clientCount: number;
  totalRevenue: number;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}> = ({ product, clientCount, totalRevenue, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <PackageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
              <p className="text-2xl font-extrabold text-blue-600">{product.price.toFixed(2)}€</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-blue-600 p-2 rounded-full" aria-label={`Modifica ${product.name}`}>
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(product.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full" aria-label={`Elimina ${product.name}`}>
              <Trash2Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t p-4 flex justify-around text-center">
        <div>
          <p className="text-sm text-gray-500">Clienti Attivi</p>
          <p className="text-xl font-bold text-gray-800 flex items-center justify-center gap-1"><UsersIcon className="w-5 h-5 text-gray-400" /> {clientCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Guadagno Totale</p>
          <p className="text-xl font-bold text-gray-800">{totalRevenue.toFixed(2)}€</p>
        </div>
      </div>
    </div>
  );
};

interface ProdottiPageProps {
  products: Product[];
  clients: Client[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProdottiPage: React.FC<ProdottiPageProps> = ({ products, clients, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const productStats = useMemo(() => {
    return products.map(product => {
      const activeClients = clients.filter(c => c.productId === product.id && new Date(c.subscription.endDate) > new Date());
      const totalRevenue = activeClients.reduce((sum) => {
          return sum + product.price;
      }, 0);
      return {
        ...product,
        clientCount: activeClients.length,
        totalRevenue,
      };
    });
  }, [products, clients]);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
          <PlusCircleIcon className="w-5 h-5" />
          Aggiungi Prodotto
        </button>
      </div>
      
      <ProductBarChart data={productStats} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productStats.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              clientCount={product.clientCount}
              totalRevenue={product.totalRevenue}
              onEdit={setEditingProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
            <PackageIcon className="mx-auto w-12 h-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Nessun prodotto ancora creato.</h2>
            <p className="mt-2 text-gray-500">Inizia aggiungendo il tuo primo prodotto o servizio.</p>
            <button onClick={() => setAddModalOpen(true)} className="mt-6 flex items-center mx-auto gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
                <PlusCircleIcon className="w-5 h-5" />
                Crea il primo Prodotto
            </button>
        </div>
      )}

      {isAddModalOpen && <AddProductForm onAddProduct={onAddProduct} onClose={() => setAddModalOpen(false)} />}
      {editingProduct && <EditProductForm product={editingProduct} onUpdateProduct={onUpdateProduct} onClose={() => setEditingProduct(null)} />}
    </div>
  );
};

export default ProdottiPage;