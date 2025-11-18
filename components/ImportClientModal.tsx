import React, { useState, useCallback } from 'react';
import { Client, Product, Seller, SubscriptionType } from '../types';
import { XIcon, UploadIcon } from './Icons';

interface ImportClientModalProps {
  onClose: () => void;
  onImport: (clients: Omit<Client, 'id'>[]) => void;
  products: Product[];
  sellers: Seller[];
}

const parseDate = (dateStr: string): Date | null => {
    // Tries to parse DD/MM/YYYY or YYYY-MM-DD
    if (!dateStr) return null;
    let date;
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // DD/MM/YYYY
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
    } else if (dateStr.includes('-')) {
        date = new Date(dateStr);
    }
    
    if (date && !isNaN(date.getTime())) {
        return date;
    }
    return null;
}

const ImportClientModal: React.FC<ImportClientModalProps> = ({ onClose, onImport, products, sellers }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedClients, setParsedClients] = useState<Omit<Client, 'id'>[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setParsedClients([]);
      setError(null);
      parseCsv(selectedFile);
    }
  };
  
  const parseCsv = useCallback((csvFile: File) => {
    setIsParsing(true);
    setError(null);
    setParsedClients([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setError("Il file è vuoto o illeggibile.");
        setIsParsing(false);
        return;
      }

      const lines = text.split(/\r\n|\n/);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredHeaders = ['nome', 'cognome', 'email', 'prodotto', 'inizio abbonamento', 'fine abbonamento'];
      const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));

      if (missingHeaders.length > 0) {
        setError(`Intestazioni CSV mancanti: ${missingHeaders.join(', ')}. Le intestazioni richieste sono: ${requiredHeaders.join(', ')}.`);
        setIsParsing(false);
        return;
      }
      
      const headerMap: { [key: string]: number } = {};
      headers.forEach((h, i) => headerMap[h] = i);

      const clientsToImport: Omit<Client, 'id'>[] = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const data = line.split(',');

        const name = data[headerMap['nome']];
        const surname = data[headerMap['cognome']];
        const email = data[headerMap['email']];
        const productName = data[headerMap['prodotto']];
        const startDateStr = data[headerMap['inizio abbonamento']];
        const endDateStr = data[headerMap['fine abbonamento']];

        if (!name || !surname || !email || !productName || !startDateStr || !endDateStr) {
          errors.push(`Riga ${i + 1}: Dati obbligatori mancanti.`);
          continue;
        }

        const product = products.find(p => p.name.toLowerCase() === productName.trim().toLowerCase());
        if (!product) {
          errors.push(`Riga ${i + 1}: Prodotto "${productName}" non trovato.`);
          continue;
        }

        const sellerName = data[headerMap['venditore']];
        const seller = sellerName ? sellers.find(s => s.name.toLowerCase() === sellerName.trim().toLowerCase()) : undefined;

        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);
        
        if (!startDate || !endDate || startDate >= endDate) {
            errors.push(`Riga ${i + 1}: Date di abbonamento non valide o in formato non supportato (usare GG/MM/AAAA o AAAA-MM-GG).`);
            continue;
        }
        
        const tipoAbbonamento = data[headerMap['tipo abbonamento']]?.trim().toLowerCase();
        let subscriptionType: SubscriptionType = 'monthly'; // Default value

        if (tipoAbbonamento === 'annuale' || tipoAbbonamento === 'annual') {
            subscriptionType = 'annual';
        } else if (tipoAbbonamento === 'prova' || tipoAbbonamento === 'trial') {
            subscriptionType = 'trial';
        } else if (tipoAbbonamento === 'mensile' || tipoAbbonamento === 'monthly') {
            subscriptionType = 'monthly';
        }
        
        clientsToImport.push({
          name,
          surname,
          companyName: data[headerMap['nome azienda']] || '',
          vatNumber: data[headerMap['partita iva']] || '',
          email,
          address: data[headerMap['indirizzo']] || '',
          iban: data[headerMap['iban']] || '',
          otherInfo: data[headerMap['info aggiuntive']] || '',
          productId: product.id,
          sellerId: seller?.id,
          subscriptionType: subscriptionType,
          subscription: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        });
      }
      
      if(errors.length > 0) {
          setError(errors.slice(0, 5).join('\n')); // Show first 5 errors
      } else {
          setParsedClients(clientsToImport);
      }
      setIsParsing(false);
    };

    reader.onerror = () => {
        setError("Errore durante la lettura del file.");
        setIsParsing(false);
    }

    reader.readAsText(csvFile);
  }, [products, sellers]);
  
  const handleSubmit = () => {
      if(parsedClients.length > 0) {
          onImport(parsedClients);
          onClose();
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Importa Clienti da CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Seleziona un file CSV con le seguenti intestazioni: <code className="bg-gray-100 p-1 rounded text-xs">nome, cognome, email, prodotto, inizio abbonamento, fine abbonamento</code>. Colonne opzionali: <code className="bg-gray-100 p-1 rounded text-xs">nome azienda, partita iva, indirizzo, iban, info aggiuntive, venditore, tipo abbonamento</code>.
          </p>
          <label htmlFor="csv-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <UploadIcon className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Clicca per caricare o trascina il file'}
            </span>
            <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          </label>
          
          <div className="mt-4 min-h-[60px]">
            {isParsing && <p className="text-blue-600">Analisi del file in corso...</p>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm whitespace-pre-wrap">{error}</div>}
            {parsedClients.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-sm">
                    <strong>{parsedClients.length}</strong> clienti pronti per l'importazione.
                </div>
            )}
          </div>

        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Annulla</button>
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isParsing || parsedClients.length === 0}
            className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed">
              Importa {parsedClients.length > 0 ? parsedClients.length : ''} Clienti
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportClientModal;