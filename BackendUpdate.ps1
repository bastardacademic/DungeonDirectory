# Variables
$repositoryName = "DungeonDirectory"
$localPath = "D:\MEGA\MEGAsync\Projects\Coding projects\DungeonDirectory"
$githubUser = "bastardacademic"
$githubToken = "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"

# GitHub API URL
$githubApiUrl = "https://api.github.com/user/repos"

# Create GitHub Repository
$headers = @{
    Authorization = "Bearer $githubToken"
    Accept = "application/vnd.github.v3+json"
}
$body = @{
    name = $repositoryName
    description = "An Airbnb-like platform tailored for the BDSM and Poly communities."
    private = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri $githubApiUrl -Method Post -Headers $headers -Body $body

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
{
  \"name\": \"airbnb-backend\",
  \"version\": \"1.0.0\",
  \"main\": \"index.js\",
  \"scripts\": {
    \"start\": \"node index.js\",
    \"dev\": \"nodemon index.js\"
  },
  \"dependencies\": {
    \"express\": \"^4.17.1\",
    \"prisma\": \"^3.0.0\",
    \"@prisma/client\": \"^3.0.0\",
    \"bcryptjs\": \"^2.4.3\",
    \"jsonwebtoken\": \"^8.5.1\",
    \"dotenv\": \"^10.0.0\"
  },
  \"devDependencies\": {
    \"nodemon\": \"^2.0.7\"
  }
}
"@ | Out-File -FilePath "$localPath\backend\package.json"

@"
generator client {
  provider = \"prisma-client-js\"
}

datasource db {
  provider = \"postgresql\"
  url      = env(\"DATABASE_URL\")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      String
  reservations Reservation[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Property {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  location    String
  price       Float
  availability Boolean
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     Int
  reservations Reservation[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Reservation {
  id          Int      @id @default(autoincrement())
  startDate   DateTime
  endDate     DateTime
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  Int
  guest       User     @relation(fields: [guestId], references: [id])
  guestId     Int
  duration    Int      // Duration in hours
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
"@ | Out-File -FilePath "$localPath\backend\prisma.schema"

@"
const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/reservations', authMiddleware, reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
"@ | Out-File -FilePath "$localPath\backend\index.js"

@"
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'User registration failed' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { registerUser, loginUser };
"@ | Out-File -FilePath "$localPath\backend\controllers\userController.js"

@"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ where: { id: parseInt(id) } });
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, description, location, price, availability } = req.body;
  try {
    const property = await prisma.property.update({
      where: { id: parseInt(id) },
      data: { name, description, location, price, availability }
    });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
"@ | Out-File -FilePath "$localPath\backend\controllers\propertyController.js"

@"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReservation = async (req, res) => {
  const { startDate, endDate, propertyId, duration } = req.body;
  const { id: guestId } = req.user; // Assuming authMiddleware adds user object to req
  try {
    const reservation = await prisma.reservation.create({
      data: {
        startDate,
        endDate,
        propertyId: parseInt(propertyId),
        guestId,
        duration
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, duration } = req.body;
  try {
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { startDate, endDate, duration }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reservation.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
};
"@ | Out-File -FilePath "$localPath\backend\controllers\reservationController.js"

@"
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
"@ | Out-File -FilePath "$localPath\backend\middlewares\authMiddleware.js"

# Initial Commit and Push
Set-Location -Path $localPath
git add .
git commit -m "Initial commit"
git push -u origin master

Write-Output "GitHub repository created and initial setup complete."
