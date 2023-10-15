import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

function Attendance() {
  const [punchData, setPunchData] = useState([]); // Array to store punch-in and punch-out timestamps
  const [location, setLocation] = useState(null);

  const isOfficeLocation = (latitude, longitude) => {
    // Replace these coordinates with the latitude and longitude of your office location.
    const officeLatitude = 19.0265615;
    const officeLongitude = 73.0203230;
    
    // Calculate the maximum allowed distance (in meters) from the office.
    const maxDistance = 200; // Adjust this value as needed.
    
    // Calculate the distance between the current location and the office using the Haversine formula.
    const earthRadius = 6371e3; // Earth's radius in meters.
    const lat1 = (latitude * Math.PI) / 180;
    const lat2 = (officeLatitude * Math.PI) / 180;
    const deltaLat = ((officeLatitude - latitude) * Math.PI) / 180;
    const deltaLon = ((officeLongitude - longitude) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= maxDistance;
  };

  const handlePunchIn = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude,latitude } = position.coords;

        if (isOfficeLocation(latitude, longitude)) {
          const punchInTime = new Date().toLocaleString();
          
          // Store punch-in time in the array
          setPunchData([...punchData, { punchIn: punchInTime }]);
          alert("Punch In Recorded!");
        } else {
          alert("You are not at the office location. Punch In is not allowed.");
          console.log(longitude,latitude,isOfficeLocation(latitude,longitude))
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
      <button onClick={handlePunchIn} style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '16px' }}>
        Punch In
      </button>

      <table>
        <thead>
          <tr>
            <th>Punch In</th>
            <th>Punch Out</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {punchData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.punchIn}</td>
              <td>{entry.punchOut || '-'}</td>
              <td>
                {!entry.punchOut && (
                  <button onClick={() => handlePunchOut(index)}>
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
