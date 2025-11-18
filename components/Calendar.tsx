
import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  events: Date[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({ events, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const eventDays = useMemo(() => new Set(events.map(d => new Date(d).toDateString())), [events]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderHeader = () => {
    const monthFormat = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Mese precedente">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg capitalize">{monthFormat.format(currentDate)}</h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Mese successivo">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dayFormat = new Intl.DateTimeFormat('it-IT', { weekday: 'short' });
    const days = [];
    for (let i = 1; i <= 7; i++) { // Monday to Sunday
        const day = new Date(2023, 0, i + 1); // A week that starts on Monday
        days.push(
            <div key={i} className="text-center text-xs font-medium text-gray-500 uppercase">
                {dayFormat.format(day).slice(0, 3)}
            </div>
        );
    }
    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const dayOfWeek = startDate.getDay();
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 for Monday, 1 for Tuesday ... 6 for Sunday
    startDate.setDate(startDate.getDate() - startOffset);
    
    const rows = [];
    let days = [];
    let day = new Date(startDate);
    
    while (rows.length < 6) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isCurrentMonth = cloneDay.getMonth() === currentDate.getMonth();
        const isToday = cloneDay.toDateString() === new Date().toDateString();
        const isSelected = selectedDate && cloneDay.toDateString() === selectedDate.toDateString();
        const hasEvent = eventDays.has(cloneDay.toDateString());

        days.push(
          <div key={day.toString()} className="flex justify-center items-center py-1">
            <button
              onClick={() => onDateSelect(cloneDay)}
              className={`w-10 h-10 rounded-full flex flex-col justify-center items-center transition-colors relative ${
                !isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
              } ${isSelected ? 'bg-blue-600 text-white font-bold' : ''} ${
                !isSelected && isToday ? 'bg-blue-100 text-blue-700' : ''
              } ${!isSelected ? 'hover:bg-gray-200' : ''}`}
            >
              <time dateTime={cloneDay.toISOString().split('T')[0]}>
                {cloneDay.getDate()}
              </time>
              {hasEvent && !isSelected && (
                 <div className="absolute bottom-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              )}
            </button>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full max-w-sm mx-auto md:mx-0">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
