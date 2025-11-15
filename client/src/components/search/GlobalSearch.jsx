import React, { useState, useEffect } from 'react';

const GlobalSearch = ({ onSearch, placeholder = "Search across all modules..." }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const searchData = [
    { type: 'student', title: 'Jane Doe', subtitle: 'Room A-102', url: '/custodian-students' },
    { type: 'room', title: 'Room A-105', subtitle: 'Maintenance Required', url: '/custodian-room-management' },
    { type: 'payment', title: 'Payment Verification', subtitle: '5 pending payments', url: '/custodian-payment-management' },
    { type: 'maintenance', title: 'Maintenance Tickets', subtitle: '3 open tickets', url: '/custodian-maintenance' },
    { type: 'analytics', title: 'Revenue Report', subtitle: 'Monthly analytics', url: '/custodian-analytics' }
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      document.querySelector('.global-search input').focus();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'student': return 'fa-user';
      case 'room': return 'fa-door-open';
      case 'payment': return 'fa-credit-card';
      case 'maintenance': return 'fa-wrench';
      case 'analytics': return 'fa-chart-line';
      default: return 'fa-search';
    }
  };

  return (
    <div className="global-search">
      <div className="search-input-wrapper">
        <i className="fa-solid fa-search"></i>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
        <kbd className="search-shortcut">Ctrl+K</kbd>
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map((result, index) => (
            <a key={index} href={result.url} className="search-result-item">
              <i className={`fa-solid ${getIcon(result.type)}`}></i>
              <div className="search-result-content">
                <div className="search-result-title">{result.title}</div>
                <div className="search-result-subtitle">{result.subtitle}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;