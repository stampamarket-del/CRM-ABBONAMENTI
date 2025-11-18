import React from 'react';

interface SellerReport {
  id: string;
  name: string;
  totalRevenue: number;
  totalCommission: number;
}

interface SellerBarChartProps {
  data: SellerReport[];
}

const SellerBarChart: React.FC<SellerBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Confronto Vendite e Provvigioni</h3>
            <p className="text-center text-gray-500 py-8">Nessun dato di vendita disponibile per visualizzare il grafico.</p>
        </div>
    );
  }

  const maxValue = Math.max(...data.flatMap(d => [d.totalRevenue, d.totalCommission]));
  const scale = maxValue > 0 ? maxValue : 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Confronto Vendite e Provvigioni per Venditore</h3>
      <div className="flex justify-end gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Guadagno Generato</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Provvigioni Totali</span>
        </div>
      </div>
      <div className="w-full space-y-4 pt-2">
        {data.map(seller => (
          <div key={seller.id}>
            <p className="text-sm font-medium text-gray-800 mb-2">{seller.name}</p>
            <div className="space-y-2">
                {/* Revenue Bar */}
                <div className="flex items-center gap-2 group">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                        className="bg-green-500 h-6 rounded-full transition-all duration-700 ease-out flex items-center justify-end px-2 text-white text-xs font-bold"
                        style={{ width: `${(seller.totalRevenue / scale) * 100}%` }}
                        >
                            {seller.totalRevenue > 0 && <span className="opacity-0 group-hover:opacity-100 transition-opacity">{seller.totalRevenue.toFixed(2)}€</span>}
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-green-700 w-24 text-right">{seller.totalRevenue.toFixed(2)}€</span>
                </div>
                {/* Commission Bar */}
                 <div className="flex items-center gap-2 group">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                        className="bg-blue-500 h-6 rounded-full transition-all duration-700 ease-out flex items-center justify-end px-2 text-white text-xs font-bold"
                        style={{ width: `${(seller.totalCommission / scale) * 100}%` }}
                        >
                             {seller.totalCommission > 0 && <span className="opacity-0 group-hover:opacity-100 transition-opacity">{seller.totalCommission.toFixed(2)}€</span>}
                        </div>
                    </div>
                     <span className="text-sm font-semibold text-blue-700 w-24 text-right">{seller.totalCommission.toFixed(2)}€</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerBarChart;
