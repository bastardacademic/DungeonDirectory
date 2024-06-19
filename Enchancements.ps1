# Variables
$repositoryName = "DungeonDirectory"
$localPath = "D:\MEGA\MEGAsync\Projects\Coding projects\DungeonDirectory"
$githubUser = "bastardacademic"
$githubToken = "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"

# GitHub API URL
$githubApiUrl = "https://api.github.com/user/repos"

# Initialize Local Repository
if (-Not (Test-Path $localPath)) {
    New-Item -ItemType Directory -Force -Path $localPath
}

Set-Location -Path $localPath

git init
git remote add origin "https://github.com/$githubUser/$repositoryName.git"

# Create Backend Directory Structure
New-Item -ItemType Directory -Path "$localPath\backend\controllers"
New-Item -ItemType Directory -Path "$localPath\backend\middlewares"
New-Item -ItemType Directory -Path "$localPath\backend\models"
New-Item -ItemType Directory -Path "$localPath\backend\routes"
New-Item -ItemType Directory -Path "$localPath\backend\services"
New-Item -ItemType Directory -Path "$localPath\backend\utils"

# Create Backend Files
@"
const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const sendNotification = (userId, message) => {
  if (io) {
    io.to(userId).emit('notification', message);
  }
};

module.exports = { initSocket, sendNotification };
"@ | Out-File -FilePath "$localPath\backend\utils\notifications.js"

@"
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const { initSocket } = require('./utils/notifications');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reservations', authMiddleware, reservationRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
"@ | Out-File -FilePath "$localPath\backend\index.js"

@"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../utils/notifications');

const createProperty = async (req, res) => {
  const { name, description, location, price, availability } = req.body;
  const { id: ownerId } = req.user; // Assuming authMiddleware adds user object to req
  try {
    const property = await prisma.property.create({
      data: {
        name,
        description,
        location,
        price,
        availability,
        ownerId
      }
    });
    sendNotification(ownerId, 'Your property has been successfully created.');
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// ... other methods remain unchanged

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
"@ | Out-File -FilePath "$localPath\backend\controllers\propertyController.js"

# Create Frontend Directory Structure
New-Item -ItemType Directory -Path "$localPath\frontend\components"
New-Item -ItemType Directory -Path "$localPath\frontend\contexts"
New-Item -ItemType Directory -Path "$localPath\frontend\hooks"
New-Item -ItemType Directory -Path "$localPath\frontend\pages"
New-Item -ItemType Directory -Path "$localPath\frontend\styles"
New-Item -ItemType Directory -Path "$localPath\frontend\utils"

# Create Frontend Files
@"
import React, { useState } from 'react';
import axios from 'axios';

const AdvancedSearch = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    pool: false,
    parking: false,
    equipment: false,
  });

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/properties', {
        params: { location, priceRange, amenities },
      });
      onSearch(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <h2>Advanced Search</h2>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div>
        <label>Price Range: </label>
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="500"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={amenities.wifi}
            onChange={(e) => setAmenities({ ...amenities, wifi: e.target.checked })}
          />
          Wifi
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.pool}
            onChange={(e) => setAmenities({ ...amenities, pool: e.target.checked })}
          />
          Pool
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.parking}
            onChange={(e) => setAmenities({ ...amenities, parking: e.target.checked })}
          />
          Parking
        </label>
        <label>
          <input
            type="checkbox"
            checked={amenities.equipment}
            onChange={(e) => setAmenities({ ...amenities, equipment: e.target.checked })}
          />
          BDSM Equipment
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default AdvancedSearch;
"@ | Out-File -FilePath "$localPath\frontend\components\AdvancedSearch.js"

@"
import React from 'react';

const PropertyList = ({ properties }) => {
  return (
    <div>
      <h2>Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <h3>{property.name}</h3>
              <p>{property.description}</p>
              <p>Location: {property.location}</p>
              <p>Price: \${property.price} per night</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyList;
"@ | Out-File -FilePath "$localPath\frontend\components\PropertyList.js"

@"
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useNotifications = (userId) => {
  useEffect(() => {
    const socket = io(process.env.API_URL);

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('notification', (message) => {
      if (message.userId === userId) {
        alert(message.text); // You can use a more sophisticated notification system here
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};

export default useNotifications;
"@ | Out-File -FilePath "$localPath\frontend\hooks\useNotifications.js"

@"
import React, { useState } from 'react';
import AdvancedSearch from '../components/AdvancedSearch';
import PropertyList from '../components/PropertyList'; // Create a PropertyList component to display results

export default function Home() {
  const [properties, setProperties] = useState([]);

  const handleSearch = (results) => {
    setProperties(results);
  };

  return (
    <div>
      <h1>Welcome to the Airbnb-like Platform</h1>
      <p>This platform is tailored for the BDSM and Poly communities.</p>
      <AdvancedSearch onSearch={handleSearch} />
      <PropertyList properties={properties} />
    </div>
  );
}
"@ | Out-File -FilePath "$localPath\frontend\pages\index.js"

# Initial Commit and Push
Set-Location -Path $localPath
git add .
git commit -m "Add advanced search, notifications, and property list"
git push -u origin master

Write-Output "GitHub repository updated with enhancements."
