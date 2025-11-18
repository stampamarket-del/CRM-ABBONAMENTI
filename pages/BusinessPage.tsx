import React, { useState, useMemo } from 'react';

const formatCurrency = (value: number) => {
    return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}

const InputGroup: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder?: string; 
    type?: string; 
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const ResultRow: React.FC<{ 
    label: string; 
    value: string; 
    colorClass?: string; 
    size?: string;
    isHighlighted?: boolean;
}> = ({ label, value, colorClass = 'text-gray-900', size = 'text-lg', isHighlighted = false }) => (
  <div className={`flex justify-between items-center py-3 px-4 rounded-lg ${isHighlighted ? 'bg-gray-100' : ''}`}>
    <span className="font-medium text-gray-600">{label}</span>
    <span className={`font-bold ${size} ${colorClass}`}>{value}</span>
  </div>
);


const BusinessPage: React.FC = () => {
  const [subscriptionCost, setSubscriptionCost] = useState('229.93');
  const [cardQuantity, setCardQuantity] = useState('300');
  const [costPerCard, setCostPerCard] = useState('15');
  const [earningPerCard, setEarningPerCard] = useState('34');

  const parsedSubscriptionCost = parseFloat(subscriptionCost.replace(',', '.')) || 0;
  const parsedCardQuantity = parseInt(cardQuantity, 10) || 0;
  const parsedCostPerCard = parseFloat(costPerCard.replace(',', '.')) || 0;
  const parsedEarningPerCard = parseFloat(earningPerCard.replace(',', '.')) || 0;

  const calculations = useMemo(() => {
    const totalCardCost = parsedCardQuantity * parsedCostPerCard;
    const totalCosts = parsedSubscriptionCost + totalCardCost;
    const grossEarnings = parsedCardQuantity * parsedEarningPerCard;
    const netTotal = grossEarnings - totalCosts;
    const partnerShare = netTotal / 2;
    return {
      totalCardCost,
      totalCosts,
      grossEarnings,
      netTotal,
      partnerShare,
    };
  }, [parsedSubscriptionCost, parsedCardQuantity, parsedCostPerCard, parsedEarningPerCard]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Colonna Input */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Variabili di Costo</h2>
            <div className="space-y-4">
                <InputGroup 
                    label="Costo Abbonamento (€)" 
                    value={subscriptionCost} 
                    onChange={e => setSubscriptionCost(e.target.value)} 
                    type="text" 
                />
                <InputGroup 
                    label="Numero Card" 
                    value={cardQuantity} 
                    onChange={e => setCardQuantity(e.target.value)} 
                    type="number" 
                />
                 <InputGroup 
                    label="Costo per Card (€)" 
                    value={costPerCard} 
                    onChange={e => setCostPerCard(e.target.value)} 
                    type="text" 
                />
            </div>
        </div>
         <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Variabili di Guadagno</h2>
            <div className="space-y-4">
               <InputGroup 
                    label="Guadagno per Card (€)" 
                    value={earningPerCard} 
                    onChange={e => setEarningPerCard(e.target.value)} 
                    type="text" 
                />
            </div>
        </div>
      </div>

      {/* Colonna Risultati */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Riepilogo Finanziario</h2>
        <div className="space-y-2">
            <ResultRow label="Costo Totale Card" value={formatCurrency(calculations.totalCardCost)} />
            <ResultRow label="Costo Abbonamento" value={formatCurrency(parsedSubscriptionCost)} />
            <div className="py-2">
                <div className="border-t border-gray-200"></div>
            </div>
            <ResultRow 
                label="Totale Costi" 
                value={formatCurrency(calculations.totalCosts)} 
                colorClass="text-red-600"
                size="text-xl"
                isHighlighted
            />
            
            <div className="py-4"></div>

            <ResultRow 
                label="Totale Lordo (Guadagni)" 
                value={formatCurrency(calculations.grossEarnings)} 
                colorClass="text-green-700"
                size="text-xl"
                isHighlighted
            />
            
            <div className="py-2">
                <div className="border-t border-gray-200"></div>
            </div>

            <ResultRow 
                label="Totale Netto (Costi - Guadagni)" 
                value={formatCurrency(calculations.netTotal)} 
                colorClass="text-green-600"
                size="text-3xl"
            />
            <ResultRow 
                label="Quota Socio (50%)" 
                value={formatCurrency(calculations.partnerShare)} 
                colorClass="text-blue-600"
                size="text-2xl"
            />
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
