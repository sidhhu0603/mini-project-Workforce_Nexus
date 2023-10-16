import React, { useState } from 'react';

function Attendance() {
  const [punchData, setPunchData] = useState([]); 
  const [location, setLocation] = useState(null);

  const isOfficeLocation = (latitude, longitude) => {
    // Replace these coordinates with the latitude and longitude of your office location.
    const officeLatitude = 19.045268677161285;
    const officeLongitude = 72.88896416938032;
    
    // Calculate the maximum allowed distance (in meters) from the office.
    const maxDistance = 100; // Adjust this value as needed.
    
    // Calculate the distance between the current location and the office using the Haversine formula.
    const earthRadius = 6371e3; // Earth's radius in meters.
    console.log(earthRadius)
    const lat1 = (latitude * Math.PI) / 180;
    console.log(Math.PI);
    console.log(lat1);
    const lat2 = (officeLatitude * Math.PI) / 180;
    console.log(lat2);
    const deltaLat = ((officeLatitude - latitude) * Math.PI) / 180;
    console.log(deltaLat);
    const deltaLon = ((officeLongitude - longitude) * Math.PI) / 180;
    console.log(deltaLon);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      console.log(a);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(c);
    const distance = earthRadius * c;
    console.log(distance);
    return distance <= maxDistance;
  };

  const handlePunchIn = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        if (isOfficeLocation(latitude, longitude)) {
          const punchInTime = new Date().toLocaleString();
          setLocation({ latitude, longitude, punchInTime });
          setPunchData([...punchData, { punchIn: punchInTime }]);
          alert("Attendance Recorded!");
        } else {
          alert("You are not at the office location. Punch In is not allowed.");
        }
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Error getting location. Please try again.");
      });
    } else {
      alert("Geolocation is not available in this browser.");
    }
  };

  const handlePunchOut = (index) => {
    const punchOutTime = new Date().toLocaleString();
    
    // Store punch-out time in the corresponding punch-in entry
    const updatedPunchData = [...punchData];
    updatedPunchData[index].punchOut = punchOutTime;
    setPunchData(updatedPunchData);
  };

  return (
    <div className="App">
      <h1>Employee Attendance System</h1>
      <br />
      {location ? (
        <div>
          {/* Display location info */}
        </div>
      ) : (
        <p>Click "Punch In" to record your attendance.</p>
      )}
      <button
        onClick={handlePunchIn}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '16px',
        }}
      >
        Punch In
      </button>
  
      <table
        style={{
          width: '100%',
          fontSize: '20px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          border: '1px solid #ccc',
          borderRadius: '10px',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '30%', border: '1px solid #ccc' }}>Punch In</th>
            <th style={{ width: '30%', border: '1px solid #ccc' }}>Punch Out</th>
            <th style={{ width: '40%', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {punchData.map((entry, index) => (
            <tr key={index}>
              <td style={{ width: '30%', border: '1px solid #ccc', textAlign: 'center' }}>{entry.punchIn}</td>
              <td style={{ width: '30%', border: '1px solid #ccc', textAlign: 'center' }}>{entry.punchOut || '-'}</td>
              <td style={{ width: '40%', border: '1px solid #ccc', textAlign: 'center' }}>
                {!entry.punchOut && (
                  <button onClick={() => handlePunchOut(index)} style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}>
                    Punch Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
   
}
export default Attendance;