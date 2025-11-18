
import React, { useState, useCallback, useMemo } from 'react';
import { Client, Product, Seller } from './types';
import ClientList from './components/ClientList';
import AddClientForm from './components/AddClientForm';
import EditClientForm from './components/EditClientForm';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProdottiPage from './pages/ProdottiPage';
import VenditoriPage from './pages/VenditoriPage';
import ReportsPage from './pages/ReportsPage';
import BusinessPage from './pages/BusinessPage';
import SalvaPage from './pages/SalvaPage';
import { PlusCircleIcon, DownloadIcon, UploadIcon } from './components/Icons';
import ImportClientModal from './components/ImportClientModal';
import ClientFilterBar from './components/ClientFilterBar';

type View = 'dashboard' | 'clients' | 'sellers' | 'products' | 'reports' | 'business' | 'salva';

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1', name: 'Mario', surname: 'Rossi', companyName: 'Rossi S.R.L', vatNumber: 'IT12345678901', address: 'Via Roma 1, 00100 Roma', email: 'mario.rossi@example.com', iban: 'IT60X0542811101000000123456', otherInfo: 'Cliente iniziale, alta priorità.',
      subscription: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
      },
      subscriptionType: 'monthly',
      productId: 'p1', sellerId: 's1',
    },
    {
      id: '2', name: 'Giulia', surname: 'Bianchi', address: 'Corso Vittorio Emanuele 10, Milano', email: 'giulia.bianchi@example.com', iban: 'IT12A0306909606100000063749', otherInfo: 'Cliente a lungo termine.',
      subscription: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 80)).toISOString(),
      },
      subscriptionType: 'annual',
      productId: 'p2', sellerId: 's2',
    },
     {
      id: '4', name: 'Luca', surname: 'Verdi', companyName: 'Verdi Costruzioni', vatNumber: 'IT98765432109', address: 'Via Garibaldi 20, Torino', email: 'luca.verdi@example.com', iban: 'IT11A0200801694000105374827', otherInfo: 'Contratto in scadenza.',
      subscription: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 335)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
      },
      subscriptionType: 'annual',
      productId: 'p3', sellerId: 's1',
    },
    {
      id: '3', name: 'Cliente', surname: 'Scaduto', address: 'Piazza Maggiore 5, Bologna', email: 'cliente.scaduto@example.com', iban: 'IT11A0200801694000105374827', otherInfo: 'Abbonamento terminato.',
      subscription: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      },
      subscriptionType: 'monthly',
       productId: 'p1', sellerId: 's2',
    },
    {
      id: '5', name: 'Futuro', surname: 'Cliente', companyName: 'Startup Futura', vatNumber: 'IT00000000000', address: 'Via del Domani 1, Futuropoli', email: 'futuro.cliente@example.com', iban: 'IT00F00000000000000000000', otherInfo: 'Abbonamento non ancora attivo.',
      subscription: {
        startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
      },
      subscriptionType: 'trial',
       productId: 'p2', sellerId: 's1',
    },
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Abbonamento Base', price: 29.99 },
    { id: 'p2', name: 'Abbonamento Premium', price: 59.99 },
    { id: 'p3', name: 'Abbonamento Enterprise', price: 99.99 },
  ]);
  const [sellers, setSellers] = useState<Seller[]>([
    { id: 's1', name: 'Marco Neri', commissionRate: 10 },
    { id: 's2', name: 'Laura Gialli', commissionRate: 12 },
  ]);
  
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isAddClientModalOpen, setAddClientModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProductId, setFilterProductId] = useState('');
  const [filterSellerId, setFilterSellerId] = useState('');
  const [filterSubscriptionType, setFilterSubscriptionType] = useState('');
  const [sortOrder, setSortOrder] = useState('expiry_desc');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const addClient = useCallback((client: Omit<Client, 'id'>) => {
    setClients(prev => [...prev, { ...client, id: new Date().toISOString() }]);
  }, []);
  
  const importClients = useCallback((newClients: Omit<Client, 'id'>[]) => {
    const clientsToAdd = newClients.map(client => ({ ...client, id: `imported-${new Date().toISOString()}-${Math.random()}` }));
    setClients(prev => [...prev, ...clientsToAdd]);
    alert(`${clientsToAdd.length} clienti importati con successo!`);
  }, []);

  const deleteClient = useCallback((clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  }, []);

  const updateClient = useCallback((updatedClient: Client) => {
    setClients(prev => prev.map(client => client.id === updatedClient.id ? updatedClient : client));
    setEditingClient(null);
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: `p${Date.now()}` }]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto? I clienti associati non avranno più un prodotto.')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      // Un-assign clients from the deleted product
      setClients(prev => prev.map(client => 
        client.productId === productId ? { ...client, productId: undefined } : client
      ));
    }
  }, []);

  const addSeller = useCallback((seller: Omit<Seller, 'id'>) => {
    setSellers(prev => [...prev, { ...seller, id: `s${Date.now()}` }]);
  }, []);

  const deleteSeller = useCallback((sellerId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo venditore? I clienti associati non avranno più un venditore.')) {
      setSellers(prev => prev.filter(seller => seller.id !== sellerId));
      // Un-assign clients from the deleted seller
      setClients(prev => prev.map(client => 
        client.sellerId === sellerId ? { ...client, sellerId: undefined } : client
      ));
    }
  }, []);

  const updateSeller = useCallback((updatedSeller: Seller) => {
    setSellers(prev => prev.map(s => s.id === updatedSeller.id ? updatedSeller : s));
  }, []);
  
  const exportToCsv = useCallback((filename: string, data: object[]) => {
    if (!data || data.length === 0) {
      alert('Nessun dato da esportare.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header as keyof typeof row];
        const stringValue = value === null || value === undefined ? '' : String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleExportClients = useCallback(() => {
    const sortedClients = [...clients].sort((a, b) => new Date(a.subscription.endDate).getTime() - new Date(b.subscription.endDate).getTime());
    
    const dataToExport = sortedClients.map(client => {
      const product = products.find(p => p.id === client.productId);
      const seller = sellers.find(s => s.id === client.sellerId);
      return {
        'Nome': client.name,
        'Cognome': client.surname,
        'Nome Azienda': client.companyName || '',
        'Partita IVA': client.vatNumber || '',
        'Email': client.email,
        'Indirizzo': client.address,
        'Prodotto': product ? product.name : 'N/D',
        'Prezzo Prodotto (€)': product ? product.price.toFixed(2) : 'N/A',
        'Venditore': seller ? seller.name : 'N/D',
        'Inizio Abbonamento': new Date(client.subscription.startDate).toLocaleDateString('it-IT'),
        'Fine Abbonamento': new Date(client.subscription.endDate).toLocaleDateString('it-IT'),
        'IBAN': client.iban,
        'Info Aggiuntive': client.otherInfo,
      };
    });

    exportToCsv('clienti.csv', dataToExport);
  }, [clients, products, sellers, exportToCsv]);
  
  const restoreData = useCallback((data: { clients: Client[], products: Product[], sellers: Seller[] }) => {
    setClients(data.clients || []);
    setProducts(data.products || []);
    setSellers(data.sellers || []);
  }, []);

  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    clients: 'Clienti',
    sellers: 'Venditori',
    products: 'Prodotti',
    reports: 'Report Vendite',
    business: 'Analisi Business',
    salva: 'Salva Modifiche',
  };
  
  const filteredAndSortedClients = useMemo(() => {
    let result = clients.filter(client => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTermLower === '' ||
        client.name.toLowerCase().includes(searchTermLower) ||
        client.surname.toLowerCase().includes(searchTermLower) ||
        (client.companyName && client.companyName.toLowerCase().includes(searchTermLower)) ||
        client.email.toLowerCase().includes(searchTermLower);

      const matchesProduct = filterProductId === '' || client.productId === filterProductId;
      const matchesSeller = filterSellerId === '' || client.sellerId === filterSellerId;
      const matchesSubscriptionType = filterSubscriptionType === '' || client.subscriptionType === filterSubscriptionType;
      
      const matchesDate = !selectedDate || new Date(client.subscription.endDate).toDateString() === selectedDate.toDateString();


      return matchesSearch && matchesProduct && matchesSeller && matchesSubscriptionType && matchesDate;
    });

    switch (sortOrder) {
      case 'expiry_asc':
        result.sort((a, b) => new Date(a.subscription.endDate).getTime() - new Date(b.subscription.endDate).getTime());
        break;
      case 'name_asc':
        result.sort((a, b) => `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`));
        break;
      case 'expiry_desc':
      default:
        result.sort((a, b) => new Date(b.subscription.endDate).getTime() - new Date(a.subscription.endDate).getTime());
        break;
    }

    return result;
  }, [clients, searchTerm, filterProductId, filterSellerId, filterSubscriptionType, sortOrder, selectedDate]);

  const mainContent = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard clients={clients} products={products} />;
      case 'clients':
        return (
          <>
            <ClientFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterProductId={filterProductId}
              setFilterProductId={setFilterProductId}
              filterSellerId={filterSellerId}
              setFilterSellerId={setFilterSellerId}
              filterSubscriptionType={filterSubscriptionType}
              setFilterSubscriptionType={setFilterSubscriptionType}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              products={products}
              sellers={sellers}
            />
            <ClientList 
              clients={filteredAndSortedClients} 
              allClientsForCalendar={clients}
              totalClientsCount={clients.length}
              onDeleteClient={deleteClient} 
              onEditClient={setEditingClient} 
              products={products} 
              sellers={sellers}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </>
        );
      case 'sellers':
        return <VenditoriPage sellers={sellers} onAddSeller={addSeller} onUpdateSeller={updateSeller} onDeleteSeller={deleteSeller} clients={clients} products={products} />;
      case 'products':
        return <ProdottiPage products={products} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} clients={clients} />;
       case 'reports':
        return <ReportsPage clients={clients} products={products} sellers={sellers} />;
      case 'business':
        return <BusinessPage />;
      case 'salva':
        return <SalvaPage clients={clients} products={products} sellers={sellers} onRestore={restoreData} />;
      default:
        return null;
    }
  }, [currentView, clients, products, sellers, deleteClient, addProduct, updateProduct, deleteProduct, addSeller, updateSeller, deleteSeller, filteredAndSortedClients, searchTerm, filterProductId, filterSellerId, sortOrder, filterSubscriptionType, restoreData, selectedDate]);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{viewTitles[currentView]}</h1>
            {currentView === 'clients' && (
              <div className="flex items-center gap-4">
                 <button
                    onClick={() => setImportModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    <UploadIcon className="w-5 h-5" />
                    Importa CSV
                </button>
                 <button
                    onClick={handleExportClients}
                    className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    Esporta CSV
                </button>
                <button
                  onClick={() => setAddClientModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Aggiungi Nuovo Cliente
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {mainContent}
          </div>
        </main>
      </div>
      {isAddClientModalOpen && (
        <AddClientForm
          onAddClient={addClient}
          onClose={() => setAddClientModalOpen(false)}
          products={products}
          sellers={sellers}
        />
      )}
      {editingClient && (
        <EditClientForm
          client={editingClient}
          onUpdateClient={updateClient}
          onClose={() => setEditingClient(null)}
          products={products}
          sellers={sellers}
        />
      )}
       {isImportModalOpen && (
        <ImportClientModal
            onClose={() => setImportModalOpen(false)}
            onImport={importClients}
            products={products}
            sellers={sellers}
        />
      )}
    </div>
  );
};

export default App;
