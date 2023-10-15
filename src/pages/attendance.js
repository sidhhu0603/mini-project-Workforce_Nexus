import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database'; // Import the Realtime Database module if you are using Realtime Database


function attendance() {
  const [location, setLocation] = useState(null);

  const isOfficeLocation = (latitude, longitude) => {
    // Replace these coordinates with the latitude and longitude of your office location.
    const officeLatitude = 19.045154610013032;
    const officeLongitude = 72.88898521813704;
    
    // Calculate the maximum allowed distance (in meters) from the office.
    const maxDistance = 100; // Adjust this value as needed.
    
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
        const { latitude, longitude } = position.coords;
  
        if (isOfficeLocation(latitude, longitude)) {
          const timestamp = new Date().toLocaleString();
  
          // Store punch in data in Firebase
          const punchInData = {
            latitude,
            longitude,
            timestamp,
          };
  
          // Push the data to a Firebase database node (e.g., 'punchIns')
          database.ref('punchIns').push(punchInData);
  
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

  return (
    <div className="App">
      <h1>Employee Attendance System</h1>
      {location ? (
        <div>
          <p>Your Location:</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Timestamp: {location.timestamp}</p>
        </div>
      ) : (
        <p>Click "Punch In" to record your attendance.</p>
      )}
      <button onClick={handlePunchIn}>Punch In</button>
    </div>
  );
}

export default attendance;
