import React from 'react';

interface ProductReport {
  id: string;
  name: string;
  totalRevenue: number;
}

interface ProductBarChartProps {
  data: ProductReport[];
}

const ProductBarChart: React.FC<ProductBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Guadagni per Prodotto</h3>
            <p className="text-center text-gray-500 py-8">Nessun dato di vendita disponibile per visualizzare il grafico.</p>
        </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.totalRevenue));
  const scale = maxValue > 0 ? maxValue : 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Guadagni Totali per Prodotto</h3>
      <div className="flex justify-end gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Guadagno Generato</span>
        </div>
      </div>
      <div className="w-full space-y-4 pt-2">
        {data.map(product => (
          <div key={product.id}>
            <p className="text-sm font-medium text-gray-800 mb-2">{product.name}</p>
            <div className="flex items-center gap-2 group">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-700 ease-out flex items-center justify-end px-2 text-white text-xs font-bold"
                    style={{ width: `${(product.totalRevenue / scale) * 100}%` }}
                    >
                        {product.totalRevenue > 0 && <span className="opacity-0 group-hover:opacity-100 transition-opacity">{product.totalRevenue.toFixed(2)}€</span>}
                    </div>
                </div>
                <span className="text-sm font-semibold text-blue-700 w-24 text-right">{product.totalRevenue.toFixed(2)}€</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductBarChart;