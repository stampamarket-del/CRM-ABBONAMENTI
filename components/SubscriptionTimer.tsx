import React from 'react';
import { Subscription } from '../types';
import { useCountdown } from '../hooks/useCountdown';

interface SubscriptionTimerProps {
  subscription: Subscription;
}

const CircularProgress: React.FC<{ progress: number; strokeColor: string; textColor: string; isPulsing: boolean }> = ({ progress, strokeColor, textColor, isPulsing }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg aria-hidden="true" className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="stroke-gray-200"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-500 ${strokeColor}`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full rounded-full ${textColor} ${isPulsing ? 'animate-[pulse-glow_2s_ease-in-out_infinite]' : ''}`}
      />
    </div>
  );
};


const SubscriptionTimer: React.FC<SubscriptionTimerProps> = ({ subscription }) => {
  const { startDate, endDate } = subscription;
  const { days, hours, minutes, isExpired, timeElapsed, timeUntilStart } = useCountdown(startDate, endDate);

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  const totalDuration = end - start;
  const elapsedDuration = now - start;
  
  const progress = timeUntilStart.hasStarted
    ? Math.min(Math.max((elapsedDuration / totalDuration) * 100, 0), 100)
    : 0;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('it-IT');

  const getStatusStyles = () => {
    if (isExpired) return { color: 'text-red-500', stroke: 'stroke-red-500', pulse: false };
    if (!timeUntilStart.hasStarted) return { color: 'text-blue-500', stroke: 'stroke-blue-500', pulse: false };
    if (days < 7) return { color: 'text-red-500', stroke: 'stroke-red-500', pulse: true };
    if (days < 30) return { color: 'text-yellow-500', stroke: 'stroke-yellow-500', pulse: false };
    return { color: 'text-green-500', stroke: 'stroke-green-500', pulse: false };
  };

  const { color, stroke, pulse } = getStatusStyles();

  const renderTimerContent = () => {
    if (isExpired) {
      return (
        <div>
          <div className="text-3xl font-bold">SCADUTO</div>
          <div className="text-sm text-gray-500 mt-1">
             da {Math.abs(days)}g {Math.abs(hours)}o
          </div>
        </div>
      );
    }
    if (!timeUntilStart.hasStarted) {
      return (
        <div>
          <div className="text-sm font-medium">Inizia tra</div>
          <div className="text-3xl font-bold">
            {timeUntilStart.days}<span className="text-lg">g</span>
          </div>
          <div className="text-sm font-medium">
            {timeUntilStart.hours}<span className="text-xs">o</span> {timeUntilStart.minutes}<span className="text-xs">m</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="text-sm font-medium">Rimanenti</div>
        <div className="text-3xl font-bold">
          {days}<span className="text-lg">g</span>
        </div>
        <div className="text-sm font-medium">
          {hours}<span className="text-xs">o</span> {minutes}<span className="text-xs">m</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <CircularProgress progress={progress} strokeColor={stroke} textColor={color} isPulsing={pulse} />
        <div className={`absolute text-center ${color}`}>
            {renderTimerContent()}
        </div>
      </div>
      
       <div className="w-full text-center">
        <div className="flex justify-between text-xs text-gray-500">
            <span>Inizio: {formatDate(startDate)}</span>
            <span>Fine: {formatDate(endDate)}</span>
        </div>
        { timeUntilStart.hasStarted && !isExpired && (
             <p className="text-xs text-gray-400 mt-2">
                Attivo da {timeElapsed.days}g {timeElapsed.hours}o
             </p>
        )}
       </div>

    </div>
  );
};

export default SubscriptionTimer;