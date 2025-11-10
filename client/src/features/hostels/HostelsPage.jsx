import React, { useState, useMemo, useEffect } from 'react';
import HostelCard from './HostelCard';
import { apiService } from '../../service/api.service';
import '../../styles/hostel-card.css';
import '../../styles/hostel-card-hover.css';
import '../../styles/modern-hostels.css';

const HostelsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'all',
    college: 'all',
    maxPrice: 2000000,
    amenities: [],
  });
  const [visibleHostelCount, setVisibleHostelCount] = useState(6);

  // Load hostels from localStorage and API
  useEffect(() => {
    const loadHostels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load from localStorage first
        const localHostels = JSON.parse(localStorage.getItem('hostels') || '[]');
        const localHostelsFormatted = localHostels.map(hostel => [hostel.id, hostel]);
        
        // Try to load from API
        try {
          const response = await apiService.hostels.getAll();
          const apiHostels = response.data.map(hostel => [hostel._id, hostel]);
          setHostels([...localHostelsFormatted, ...apiHostels]);
        } catch (apiError) {
          // If API fails, use only localStorage hostels
          console.warn('API failed, using localStorage hostels only:', apiError);
          setHostels(localHostelsFormatted);
        }
      } catch (err) {
        console.error('Failed to load hostels:', err);
        setError('Failed to load hostels. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    loadHostels();
  }, []);

  // Animation on scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    const filterKey = id === 'maxPriceInput' ? 'maxPrice' : id;
    setFilters(prev => ({ ...prev, [filterKey]: parseInt(value) || value }));
    setVisibleHostelCount(6); // Reset visible count on filter change
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    setVisibleHostelCount(6); // Reset visible count on filter change
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
    setVisibleHostelCount(6); // Reset visible count on filter change
  };

  // College to location mapping
  const collegeLocationMap = {
    cocis: ['wandegeya', 'ldc'],
    cobams: ['kikumi kikumi', 'kikoni'],
    cedat: ['kikoni'],
    chuss: ['kikoni'],
    conas: ['kikoni', 'kikumi kikumi'],
    caes: ['kikoni', 'kikumi kikumi'],
    cees: ['kikoni'],
    chs: ['mulago', 'wandegeya'],
    covab: ['kikoni'],
    sol: ['ldc']
  };

  // Extract unique amenities from all hostels
  const uniqueAmenities = useMemo(() => {
    const amenitiesSet = new Set();
    hostels.forEach(([, hostel]) => {
      if (hostel.amenities) {
        hostel.amenities.forEach(amenity => {
          amenitiesSet.add(amenity.name.toLowerCase());
        });
      }
    });
    return Array.from(amenitiesSet).sort();
  }, [hostels]);

  const filteredHostels = useMemo(() => {
    return hostels.filter(([, hostel]) => {
      const lowestPrice = hostel.rooms && hostel.rooms.length > 0 
        ? hostel.rooms.reduce((min, room) => (room.price && room.price < min ? room.price : min), Infinity)
        : 0;
      const nameMatch = hostel.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const locationMatch = filters.location === 'all' || 
        hostel.location.toLowerCase().replace(/ /g, '-') === filters.location.toLowerCase() ||
        hostel.location.toLowerCase() === filters.location.toLowerCase().replace(/-/g, ' ');
      
      // College filter logic
      const collegeMatch = filters.college === 'all' || (() => {
        const collegeLocations = collegeLocationMap[filters.college] || [];
        if (collegeLocations.length === 0) return true; // Show all if no locations specified
        return collegeLocations.some(location => 
          hostel.location.toLowerCase() === location.toLowerCase() ||
          hostel.location.toLowerCase().replace(/ /g, '-') === location.toLowerCase().replace(/ /g, '-')
        );
      })();
      
      const priceMatch = lowestPrice <= filters.maxPrice;
      const amenitiesMatch = filters.amenities.every(filterAmenity =>
        hostel.amenities && hostel.amenities.some(hostelAmenity => 
          hostelAmenity.name.toLowerCase() === filterAmenity.toLowerCase()
        )
      );

      return nameMatch && locationMatch && collegeMatch && priceMatch && amenitiesMatch;
    });
  }, [hostels, filters]);

  const hostelsToDisplay = filteredHostels.slice(0, visibleHostelCount);

  const handleLoadMore = () => {
    setVisibleHostelCount(prev => prev + 6);
  };

  return (
    <div className="modern-hostels-page">
      {/* Hero Search Section */}
      <section className="hero-search-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="floating-elements">
          <div className="floating-hostel floating-hostel-1">
            <i className="fa-solid fa-building"></i>
          </div>
          <div className="floating-hostel floating-hostel-2">
            <i className="fa-solid fa-home"></i>
          </div>
          <div className="floating-hostel floating-hostel-3">
            <i className="fa-solid fa-bed"></i>
          </div>
          <div className="floating-hostel floating-hostel-4">
            <i className="fa-solid fa-key"></i>
          </div>
          <div className="floating-hostel floating-hostel-5">
            <i className="fa-solid fa-door-open"></i>
          </div>
          <div className="floating-hostel floating-hostel-6">
            <i className="fa-solid fa-house-user"></i>
          </div>
          <div className="floating-hostel floating-hostel-7">
            <i className="fa-solid fa-wifi"></i>
          </div>
          <div className="floating-hostel floating-hostel-8">
            <i className="fa-solid fa-car"></i>
          </div>
          <div className="floating-hostel floating-hostel-9">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="floating-hostel floating-hostel-10">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <div className="floating-hostel floating-hostel-11">
            <i className="fa-solid fa-shower"></i>
          </div>
          <div className="floating-hostel floating-hostel-12">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="accent-text">Perfect Hostel</span>
          </h1>
          <p className="hero-subtitle">
            Discover amazing student accommodations near Makerere University
          </p>
          <div className="hero-search-wrapper">
            <div className="search-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input 
              type="search" 
              id="hostelSearch"
              name="hostelSearch"
              className="hero-search-input" 
              placeholder="Search hostels by name..." 
              value={filters.searchTerm} 
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="modern-main-content">
        <div className="modern-container">
          <div className="modern-layout-card">
            <aside className="modern-sidebar">
              <div className="modern-filter-section">
                <h3 className="filter-title">Location</h3>
                <div className="modern-select-wrapper">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <select id="location" className="modern-select" value={filters.location} onChange={handleFilterChange}>
                    <option value="all">All Locations</option>
                    <option value="kikoni">Kikoni</option>
                    <option value="wandegeya">Wandegeya</option>
                    <option value="kikumi-kikumi">Kikumi Kikumi</option>
                    <option value="mulago">Mulago</option>
                    <option value="ldc">LDC</option>
                  </select>
                </div>
              </div>
              <div className="modern-filter-section">
                <h3 className="filter-title">Filter by College</h3>
                <div className="modern-select-wrapper">
                  <i className="fa-solid fa-graduation-cap"></i>
                  <select id="college" className="modern-select" value={filters.college} onChange={handleFilterChange}>
                    <option value="all">All Colleges</option>
                    <option value="cocis">CoCIS</option>
                    <option value="cobams">CoBAMS</option>
                    <option value="cedat">CEDAT</option>
                    <option value="chuss">CHUSS</option>
                    <option value="conas">CoNAS</option>
                    <option value="caes">CAES</option>
                    <option value="cees">CEES</option>
                    <option value="chs">CHS</option>
                    <option value="covab">CoVAB</option>
                    <option value="sol">School of Law</option>
                  </select>
                </div>
              </div>
              <div className="modern-filter-section">
                <h3 className="filter-title">Filter by Price</h3>
                <div className="modern-price-filter">
                  <input type="range" id="maxPrice" name="maxPrice" min="500000" max="2000000" step="100000" value={filters.maxPrice} onChange={handleFilterChange} className="modern-range" />
                  <div className="modern-price-input-wrapper">
                    <label>Max Price (UGX):</label>
                    <input 
                      type="number" 
                      id="maxPriceInput" 
                      name="maxPriceInput"
                      min="500000" 
                      max="2000000" 
                      step="100000" 
                      value={filters.maxPrice} 
                      onChange={handleFilterChange}
                      placeholder="Enter max price"
                      className="modern-price-input"
                    />
                  </div>
                  <div className="modern-price-value">Up to <span>UGX {filters.maxPrice.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="modern-filter-section">
                <h3 className="filter-title">Filter by Amenities</h3>
                <div className="modern-amenities-filter">
                  {uniqueAmenities.map(amenity => (
                    <button
                      key={amenity}
                      className={`modern-amenity-btn ${filters.amenities.includes(amenity) ? 'active' : ''}`}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      {amenity.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="modern-content-area">
              {/* HOSTELS GRID */}
              <section className="modern-hostels-grid">
              {loading && (
                <div className="loading-message">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <h4>Loading Hostels...</h4>
                  <p>Please wait while we fetch the latest hostel information.</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                  <h4>Unable to Load Hostels</h4>
                  <p>{error}</p>
                  <button className="btn primary" onClick={() => window.location.reload()}>Try Again</button>
                </div>
              )}

              {!loading && !error && hostelsToDisplay.length === 0 && (
                <div className="no-results-message" id="noResultsMessage">
                  <i className="fa-solid fa-search"></i>
                  <h4>No Hostels Found</h4>
                  <p>Try adjusting your search or filter criteria to find what you're looking for.</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="modern-grid">
                    {hostelsToDisplay.map(([id, hostel]) => (
                      <HostelCard key={id} hostelId={id} hostel={hostel} />
                    ))}
                  </div>
                  {filteredHostels.length > hostelsToDisplay.length && (
                    <div className="load-more-container">
                      <button className="modern-load-more-btn" onClick={handleLoadMore}>
                        <span className="btn-text">Load More Hostels</span>
                        <div className="btn-icon">
                          <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="btn-count">{filteredHostels.length - hostelsToDisplay.length} more</div>
                      </button>
                    </div>
                  )}
                </>
              )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostelsPage;