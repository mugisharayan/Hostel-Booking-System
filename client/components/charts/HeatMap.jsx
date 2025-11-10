import React from 'react';

const HeatMap = ({ data, title = "Room Occupancy Heat Map" }) => {
  const generateHeatMapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({length: 24}, (_, i) => i);
    
    return days.map(day => ({
      day,
      hours: hours.map(hour => ({
        hour,
        value: Math.random() * 100,
        occupancy: Math.floor(Math.random() * 100)
      }))
    }));
  };

  const heatMapData = data || generateHeatMapData();

  const getIntensity = (value) => {
    if (value < 25) return 'low';
    if (value < 50) return 'medium-low';
    if (value < 75) return 'medium-high';
    return 'high';
  };

  return (
    <div className="heat-map-container">
      <h3>{title}</h3>
      <div className="heat-map">
        <div className="heat-map-hours">
          {Array.from({length: 24}, (_, i) => (
            <div key={i} className="hour-label">{i}:00</div>
          ))}
        </div>
        <div className="heat-map-grid">
          {heatMapData.map((dayData, dayIndex) => (
            <div key={dayIndex} className="heat-map-row">
              <div className="day-label">{dayData.day}</div>
              <div className="heat-map-cells">
                {dayData.hours.map((hourData, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`heat-map-cell ${getIntensity(hourData.occupancy)}`}
                    title={`${dayData.day} ${hourData.hour}:00 - ${hourData.occupancy}% occupied`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="heat-map-legend">
        <span>Low</span>
        <div className="legend-gradient"></div>
        <span>High</span>
      </div>
    </div>
  );
};

export default HeatMap;