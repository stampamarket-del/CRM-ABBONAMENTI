import React, { useCallback, useState } from 'react';
import { Client, Product, Seller, ActivityLog } from '../types';
import { DownloadIcon, UploadIcon } from '../components/Icons';

interface SalvaPageProps {
  clients: Client[];
  products: Product[];
  sellers: Seller[];
  activityLog: ActivityLog[];
  onRestore: (data: { clients: Client[]; products: Product[]; sellers: Seller[]; activityLog: ActivityLog[] }) => void;
}

const SalvaPage: React.FC<SalvaPageProps> = ({ clients, products, sellers, activityLog, onRestore }) => {
    const [restoreFile, setRestoreFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);


    const handleSave = useCallback(() => {
        try {
            const dataToSave = {
                clients,
                products,
                sellers,
                activityLog,
                backupDate: new Date().toISOString(),
            };
            const jsonString = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const dateStr = new Date().toISOString().split('T')[0];
            link.download = `crm_full_backup_${dateStr}.json`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Errore durante il salvataggio del backup:", error);
            alert('Si è verificato un errore durante il salvataggio.');
        }
    }, [clients, products, sellers, activityLog]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeedback(null);
        const file = event.target.files?.[0];
        if (file) {
            setRestoreFile(file);
        }
    };
    
    const handleRestoreClick = () => {
        if (!restoreFile) {
            setFeedback({ type: 'error', message: 'Per favore, seleziona un file di backup prima.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);
                // Basic validation
                if (data && Array.isArray(data.clients) && Array.isArray(data.products) && Array.isArray(data.sellers)) {
                    onRestore({
                        clients: data.clients,
                        products: data.products,
                        sellers: data.sellers,
                        activityLog: data.activityLog || [] // Handle old backups without logs
                    });
                    setFeedback({ type: 'success', message: 'Dati ripristinati con successo!' });
                    if(document.getElementById('restore-file-input')) {
                        (document.getElementById('restore-file-input') as HTMLInputElement).value = "";
                    }
                    setRestoreFile(null);
                } else {
                    throw new Error('Formato del file di backup non valido.');
                }
            } catch (error) {
                console.error("Errore durante il ripristino:", error);
                const message = error instanceof Error ? error.message : 'Si è verificato un errore durante la lettura del file.';
                setFeedback({ type: 'error', message });
            }
        };
        reader.onerror = () => {
            setFeedback({ type: 'error', message: 'Impossibile leggere il file.' });
        };
        reader.readAsText(restoreFile);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Backup e Ripristino Dati</h1>
                <p className="mt-2 text-gray-600">
                    Esporta o importa tutti i dati dell'applicazione da un singolo file JSON.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Esporta Tutti i Dati</h2>
                <p className="text-gray-500 mb-4 text-sm">
                    Crea un file di backup JSON con tutti i clienti, prodotti, venditori e registro attività. Conservalo in un luogo sicuro.
                </p>
                <button
                    onClick={handleSave}
                    className="w-full max-w-xs flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Esporta Backup
                </button>
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Ripristina da Backup</h2>
                <p className="text-gray-500 mb-4 text-sm">
                    Importa dati da un file di backup JSON. <strong className="text-red-600">Attenzione: questo sovrascriverà tutti i dati correnti.</strong>
                </p>
                <div className="w-full max-w-xs space-y-4">
                    <input 
                        id="restore-file-input"
                        type="file" 
                        accept=".json" 
                        onChange={handleFileChange} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        onClick={handleRestoreClick}
                        disabled={!restoreFile}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <UploadIcon className="w-5 h-5" />
                        Ripristina Dati
                    </button>
                </div>
                {feedback && (
                    <p className={`mt-4 text-sm font-medium ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                        {feedback.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SalvaPage;