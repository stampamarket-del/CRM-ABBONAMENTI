
import React, { useCallback, useState } from 'react';
import { Client, Product, Seller } from '../types';
import { DownloadIcon, UploadIcon } from '../components/Icons';

interface SalvaPageProps {
  clients: Client[];
  products: Product[];
  sellers: Seller[];
  onRestore: (data: { clients: Client[]; products: Product[]; sellers: Seller[] }) => void;
}

const SalvaPage: React.FC<SalvaPageProps> = ({ clients, products, sellers, onRestore }) => {
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreError, setRestoreError] = useState<string | null>(null);

    const handleSave = useCallback(() => {
        try {
            const dataToSave = {
                clients,
                products,
                sellers,
                backupDate: new Date().toISOString(),
            };
            const jsonString = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const dateStr = new Date().toISOString().split('T')[0];
            link.download = `crm_backup_${dateStr}.json`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            alert('Modifiche salvate nel file di backup!');
        } catch (error) {
            console.error("Errore durante il salvataggio del backup:", error);
            alert('Si è verificato un errore durante il salvataggio. Controlla la console per i dettagli.');
        }
    }, [clients, products, sellers]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsRestoring(true);
        setRestoreError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);

                // Validate structure
                if (Array.isArray(data.clients) && Array.isArray(data.products) && Array.isArray(data.sellers)) {
                    if (window.confirm(`Sei sicuro di voler ripristinare i dati da questo file? L'operazione è irreversibile e sovrascriverà tutti i dati attuali.`)) {
                        onRestore(data);
                        alert('Dati ripristinati con successo!');
                    }
                } else {
                    throw new Error("La struttura del file di backup non è valida. Devono essere presenti 'clients', 'products' e 'sellers'.");
                }
            } catch (error: any) {
                setRestoreError(`Errore durante il ripristino: ${error.message}`);
                console.error("Errore durante il ripristino:", error);
            } finally {
                setIsRestoring(false);
                // Reset file input to allow re-uploading the same file
                event.target.value = '';
            }
        };
        reader.onerror = () => {
             setRestoreError('Impossibile leggere il file selezionato.');
             setIsRestoring(false);
        }
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Salva Modifiche e Ripristina</h1>
                <p className="mt-2 text-gray-600">
                    Salva lo stato corrente dell'applicazione in un file o ripristina da un backup precedente.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Save Card */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Salva Modifiche su File</h2>
                    <p className="text-gray-500 mb-4 text-sm">
                        Crea un file di backup JSON con tutti i dati correnti.
                    </p>
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Salva Modifiche
                    </button>
                     <p className="text-xs text-gray-400 mt-4">
                        Il file scaricato può essere conservato in un posto sicuro o caricato su un repository GitHub per tener traccia delle versioni.
                    </p>
                </div>

                {/* Restore Card */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Ripristina Dati da File</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Seleziona un file di backup JSON per sovrascrivere i dati attuali. Questa azione non può essere annullata.
                    </p>
                    <label htmlFor="restore-file-input" className="w-full cursor-pointer flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300">
                       <UploadIcon className="w-5 h-5" />
                       {isRestoring ? 'Caricamento...' : 'Seleziona File di Backup'}
                    </label>
                    <input
                        type="file"
                        id="restore-file-input"
                        className="hidden"
                        accept="application/json"
                        onChange={handleFileChange}
                        disabled={isRestoring}
                    />
                    {restoreError && (
                        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{restoreError}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalvaPage;