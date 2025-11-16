import React, { useState, useMemo, useEffect, useCallback } from 'react';
import HostelCard from './HostelCard';
import { apiService } from '../../service/api.service';
import { logger } from '../../utils/logger';
import { handleError } from '../../utils/errorHandler';
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

  // Load hostels from API with comprehensive error handling
  const loadHostels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      logger.info('Loading hostels from API');
      
      const response = await apiService.hostels.getAll();
      const apiHostels = response.data.map(hostel => [hostel._id, hostel]);
      setHostels(apiHostels);
      logger.info('Hostels loaded successfully', { count: apiHostels.length });
    } catch (err) {
      const { message } = handleError(err, 'Failed to load hostels');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHostels();
  }, []);

  // Add function to refresh hostels (can be called after hostel creation)
  window.refreshHostels = loadHostels;

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

  // Filter handlers with improved readability
  const resetVisibleCount = useCallback(() => {
    setVisibleHostelCount(6);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { id, value } = e.target;
    const filterKey = id === 'maxPriceInput' ? 'maxPrice' : id;
    const parsedValue = id.includes('Price') ? parseInt(value) || value : value;
    
    setFilters(prev => ({ ...prev, [filterKey]: parsedValue }));
    resetVisibleCount();
    logger.debug('Filter changed', { filterKey, value: parsedValue });
  }, [resetVisibleCount]);

  const handleSearchChange = useCallback((e) => {
    const searchTerm = e.target.value;
    setFilters(prev => ({ ...prev, searchTerm }));
    resetVisibleCount();
    logger.debug('Search term changed', { searchTerm });
  }, [resetVisibleCount]);

  const handleAmenityToggle = useCallback((amenity) => {
    setFilters(prev => {
      const isCurrentlySelected = prev.amenities.includes(amenity);
      const newAmenities = isCurrentlySelected
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      logger.debug('Amenity toggled', { amenity, selected: !isCurrentlySelected });
      return { ...prev, amenities: newAmenities };
    });
    resetVisibleCount();
  }, [resetVisibleCount]);

  // College to location mapping for filtering
  const COLLEGE_LOCATION_MAP = useMemo(() => ({
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
  }), []);

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

  // Helper functions for filtering logic
  const getLowestPrice = useCallback((rooms) => {
    if (!rooms?.length) return 0;
    return rooms.reduce((min, room) => {
      const price = room.price || 0;
      return price < min ? price : min;
    }, Infinity);
  }, []);

  const checkLocationMatch = useCallback((hostelLocation, filterLocation) => {
    if (filterLocation === 'all') return true;
    
    const normalizedHostelLocation = hostelLocation.toLowerCase();
    const normalizedFilterLocation = filterLocation.toLowerCase();
    
    return normalizedHostelLocation.replace(/ /g, '-') === normalizedFilterLocation ||
           normalizedHostelLocation === normalizedFilterLocation.replace(/-/g, ' ');
  }, []);

  const checkCollegeMatch = useCallback((hostelLocation, filterCollege) => {
    if (filterCollege === 'all') return true;
    
    const collegeLocations = COLLEGE_LOCATION_MAP[filterCollege] || [];
    if (collegeLocations.length === 0) return true;
    
    return collegeLocations.some(location => 
      checkLocationMatch(hostelLocation, location)
    );
  }, [COLLEGE_LOCATION_MAP, checkLocationMatch]);

  const checkAmenitiesMatch = useCallback((hostelAmenities, filterAmenities) => {
    return filterAmenities.every(filterAmenity =>
      hostelAmenities?.some(hostelAmenity => 
        hostelAmenity.name.toLowerCase() === filterAmenity.toLowerCase()
      )
    );
  }, []);

  const filteredHostels = useMemo(() => {
    return hostels.filter(([, hostel]) => {
      const lowestPrice = getLowestPrice(hostel.rooms);
      const nameMatch = hostel.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const locationMatch = checkLocationMatch(hostel.location, filters.location);
      const collegeMatch = checkCollegeMatch(hostel.location, filters.college);
      const priceMatch = lowestPrice <= filters.maxPrice;
      const amenitiesMatch = checkAmenitiesMatch(hostel.amenities, filters.amenities);
      
      return nameMatch && locationMatch && collegeMatch && priceMatch && amenitiesMatch;
    });
  }, [hostels, filters, getLowestPrice, checkLocationMatch, checkCollegeMatch, checkAmenitiesMatch]);

  const hostelsToDisplay = filteredHostels.slice(0, visibleHostelCount);

  const handleLoadMore = useCallback(() => {
    setVisibleHostelCount(prev => {
      const newCount = prev + 6;
      logger.debug('Loading more hostels', { previousCount: prev, newCount });
      return newCount;
    });
  }, []);

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
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                      className="btn outline" 
                      onClick={loadHostels}
                      style={{ padding: '10px 20px' }}
                    >
                      <i className="fas fa-refresh"></i> Refresh Hostels
                    </button>
                  </div>
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