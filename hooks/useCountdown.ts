import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface TimeElapsed {
    days: number;
    hours: number;
    minutes: number;
}

interface TimeUntilStart {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasStarted: boolean;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  }

  return timeLeft;
};

const calculateTimeElapsed = (startDate: Date): TimeElapsed => {
    const difference = +new Date() - +startDate;
    let timeElapsed: TimeElapsed = { days: 0, hours: 0, minutes: 0 };

    if (difference > 0) {
        timeElapsed = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
        };
    }
    return timeElapsed;
};

const calculateTimeUntilStart = (startDate: Date): TimeUntilStart => {
    const difference = +startDate - +new Date();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, hasStarted: true };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        hasStarted: false,
    };
};


export const useCountdown = (startDate: string, endDate: string) => {
  const targetDate = new Date(endDate);
  const initialDate = new Date(startDate);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [timeElapsed, setTimeElapsed] = useState(calculateTimeElapsed(initialDate));
  const [timeUntilStart, setTimeUntilStart] = useState(calculateTimeUntilStart(initialDate));


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
      setTimeElapsed(calculateTimeElapsed(initialDate));
      setTimeUntilStart(calculateTimeUntilStart(initialDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  return { ...timeLeft, timeElapsed, timeUntilStart };
};
