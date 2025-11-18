import React from 'react';
import { ActivityLog } from '../types';
import { PlusCircleIcon, PencilIcon, Trash2Icon, UploadIcon, HistoryIcon } from '../components/Icons';

interface ActivityLogPageProps {
  logs: ActivityLog[];
}

const ActivityIcon: React.FC<{ type: ActivityLog['type'], entity: ActivityLog['entity'] }> = ({ type, entity }) => {
  const baseClasses = "w-6 h-6";
  switch (type) {
    case 'CREATE':
      return <PlusCircleIcon className={`${baseClasses} text-green-500`} />;
    case 'UPDATE':
      return <PencilIcon className={`${baseClasses} text-blue-500`} />;
    case 'DELETE':
      return <Trash2Icon className={`${baseClasses} text-red-500`} />;
    case 'IMPORT':
        return <UploadIcon className={`${baseClasses} text-purple-500`} />;
    default:
      return <HistoryIcon className={`${baseClasses} text-gray-500`} />;
  }
};

const ActivityLogPage: React.FC<ActivityLogPageProps> = ({ logs }) => {
    
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (logs.length === 0) {
    return (
        <div className="text-center py-16 bg-white rounded-lg shadow">
            <HistoryIcon className="mx-auto w-12 h-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Nessuna attività registrata.</h2>
            <p className="mt-2 text-gray-500">Le modifiche a clienti, prodotti e venditori appariranno qui.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registro Attività</h2>
      <div className="relative pl-8">
        {/* Vertical timeline bar */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" style={{ transform: 'translateX(11px)' }}></div>
        
        {sortedLogs.map((log) => (
          <div key={log.id} className="relative mb-8 flex items-start">
            <div className="absolute left-0 top-1.5 flex items-center justify-center bg-white z-10" style={{ transform: 'translateX(-11px)' }}>
               <div className="bg-white rounded-full p-1">
                 <ActivityIcon type={log.type} entity={log.entity} />
               </div>
            </div>
            <div className="ml-8">
              <p className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString('it-IT', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="font-medium text-gray-700">{log.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogPage;
