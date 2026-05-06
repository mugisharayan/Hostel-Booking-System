import { useState, useEffect } from 'react';

const useRealTimeUpdates = (initialData, updateInterval = 30000) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setData(prevData => {
        // Add random new payment
        if (Math.random() > 0.7) {
          const newPayment = {
            id: Date.now(),
            studentName: `Student ${Math.floor(Math.random() * 100)}`,
            studentId: `22/U/${Math.floor(Math.random() * 99999)}`,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            amount: '850,000',
            method: 'Mobile Money',
            date: new Date().toLocaleString(),
            status: 'Pending',
            selected: false
          };
          return [newPayment, ...prevData];
        }
        return prevData;
      });
      setLastUpdated(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return { data, setData, lastUpdated };
};

export default useRealTimeUpdates;