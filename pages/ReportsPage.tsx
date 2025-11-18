import React, { useMemo } from 'react';
import { Client, Product, Seller } from '../types';
import { DownloadIcon } from '../components/Icons';
import SellerBarChart from '../components/SellerBarChart';

interface ReportsPageProps {
  clients: Client[];
  products: Product[];
  sellers: Seller[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ clients, products, sellers }) => {
  const sellerReports = useMemo(() => {
    return sellers.map(seller => {
      const sellerClients = clients.filter(client => client.sellerId === seller.id);
      
      const report = sellerClients.reduce((acc, client) => {
        const product = products.find(p => p.id === client.productId);
        if (product) {
          const commission = (product.price * seller.commissionRate) / 100;
          acc.totalRevenue += product.price;
          acc.totalCommission += commission;
          acc.sales.push({
            clientName: `${client.name} ${client.surname}`,
            productName: product.name,
            productPrice: product.price,
            commission,
          });
        }
        return acc;
      }, { totalRevenue: 0, totalCommission: 0, sales: [] as any[] });

      return {
        ...seller,
        totalSales: sellerClients.length,
        ...report,
      };
    });
  }, [clients, products, sellers]);

   const exportToCsv = (filename: string, data: object[]) => {
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
  };
  
  const handleExport = () => {
    const allSales = sellerReports.flatMap(report => 
      report.sales.map(sale => ({
        'Venditore': report.name,
        'Cliente': sale.clientName,
        'Prodotto': sale.productName,
        'Prezzo Prodotto (€)': sale.productPrice.toFixed(2),
        'Provvigione (€)': sale.commission.toFixed(2),
      }))
    );
    exportToCsv('report_vendite.csv', allSales);
  };


  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            {/* The title was added to match the style of other pages */}
            <h1 className="text-3xl font-bold text-gray-900">Report Vendite</h1>
            <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
            >
                <DownloadIcon className="w-5 h-5" />
                Esporta Report CSV
            </button>
        </div>

        <SellerBarChart data={sellerReports} />

        {sellerReports.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">{report.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Report vendite e provvigioni</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-500">Totale Vendite</h3>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{report.totalSales}</p>
                    </div>
                     <div className="bg-green-50 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-green-700">Guadagno Generato</h3>
                        <p className="mt-1 text-2xl font-semibold text-green-900">{report.totalRevenue.toFixed(2)}€</p>
                    </div>
                     <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-blue-700">Provvigioni Totali</h3>
                        <p className="mt-1 text-2xl font-semibold text-blue-900">{report.totalCommission.toFixed(2)}€</p>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">Dettaglio Vendite</h3>
                 <div className="overflow-x-auto">
                    {report.sales.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prodotto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prezzo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provvigione</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {report.sales.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{sale.clientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale.productName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale.productPrice.toFixed(2)}€</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">{sale.commission.toFixed(2)}€</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-center text-gray-500">Nessuna vendita registrata per questo venditore.</p>
                    )}
                 </div>
            </div>
        ))}
    </div>
  );
};

export default ReportsPage;