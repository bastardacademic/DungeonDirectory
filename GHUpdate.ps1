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

# Create Initial Files
@"
# $repositoryName

An Airbnb-like platform tailored for the BDSM and Poly communities.

## Functionality

- User Authentication and Profile Management
- Property Listings and Search
- Booking System (Hourly and Nightly)
- Messaging and Communication
- Review and Rating System
- Safety and Security Features
- Host Management Console
- Guest Portal
- Internationalization and Localization
- Support and Contact

## Structure

\```
/backend
  /controllers
  /services
  /routes
  /middlewares
  /models
/frontend
  /components
  /pages
  /hooks
  /contexts
  /styles
\```

## Requirements

- Node.js
- PostgreSQL
- Azure Account
- Auth0 Account
- Stripe Account

## Setup Instructions

1. Clone the repository:
   \```
   git clone https://github.com/$githubUser/$repositoryName.git
   \```

2. Navigate to the project directory:
   \```
   cd $repositoryName
   \```

3. Install dependencies for the backend:
   \```
   cd backend
   npm install
   \```

4. Install dependencies for the frontend:
   \```
   cd ../frontend
   npm install
   \```

5. Set up environment variables for the backend (create a .env file in the backend directory):
   \```
   DATABASE_URL=postgres://<dbuser>:<dbpassword>@<dbserver>.postgres.database.azure.com:5432/<dbname>
   STORAGE_ACCOUNT_NAME=<storage_account_name>
   STORAGE_ACCOUNT_KEY=<storage_account_key>
   \```

6. Set up environment variables for the frontend (create a .env file in the frontend directory):
   \```
   API_URL=https://<backend_app_name>.azurewebsites.net
   \```

7. Deploy the backend and frontend to Azure:
   - Follow the Azure setup script to create necessary resources.
   - Use Azure DevOps or GitHub Actions for CI/CD.

## Hosting Instructions

1. Ensure all Azure resources are created (App Services, Database, Storage).
2. Configure DNS and SSL for custom domains.
3. Monitor the application using Azure Monitor and Application Insights.
4. Scale resources based on the demand.

## Contact

For any questions or support, please open an issue on the GitHub repository.
"@ | Out-File -FilePath "$localPath\README.md"

# Create .gitignore
@"
node_modules
dist
.env
.DS_Store
Thumbs.db
"@ | Out-File -FilePath "$localPath\.gitignore"

# Create Directories
New-Item -ItemType Directory -Path "$localPath\backend\controllers"
New-Item -ItemType Directory -Path "$localPath\backend\services"
New-Item -ItemType Directory -Path "$localPath\backend\routes"
New-Item -ItemType Directory -Path "$localPath\backend\middlewares"
New-Item -ItemType Directory -Path "$localPath\backend\models"
New-Item -ItemType Directory -Path "$localPath\frontend\components"
New-Item -ItemType Directory -Path "$localPath\frontend\pages"
New-Item -ItemType Directory -Path "$localPath\frontend\hooks"
New-Item -ItemType Directory -Path "$localPath\frontend\contexts"
New-Item -ItemType Directory -Path "$localPath\frontend\styles"

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
    \"jsonwebtoken\": \"^8.5.1\"
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
}
"@ | Out-File -FilePath "$localPath\backend\prisma.schema"

# Create Frontend Files
@"
{
  \"name\": \"airbnb-frontend\",
  \"version\": \"1.0.0\",
  \"scripts\": {
    \"dev\": \"next dev\",
    \"build\": \"next build\",
    \"start\": \"next start\"
  },
  \"dependencies\": {
    \"next\": \"latest\",
    \"react\": \"latest\",
    \"react-dom\": \"latest\",
    \"axios\": \"^0.21.1\",
    \"react-datepicker\": \"^3.8.0\",
    \"i18next\": \"^21.2.4\",
    \"react-i18next\": \"^11.8.5\"
  }
}
"@ | Out-File -FilePath "$localPath\frontend\package.json"

# Initial Commit and Push
Set-Location -Path $localPath
git add .
git commit -m "Initial commit"
git push -u origin master

Write-Output "GitHub repository created and initial setup complete."
