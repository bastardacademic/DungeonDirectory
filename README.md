# DungeonDirectory

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

\`
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
\`

## Requirements

- Node.js
- PostgreSQL
- Azure Account
- Auth0 Account
- Stripe Account

## Setup Instructions

1. Clone the repository:
   \`
   git clone https://github.com/bastardacademic/DungeonDirectory.git
   \`

2. Navigate to the project directory:
   \`
   cd DungeonDirectory
   \`

3. Install dependencies for the backend:
   \`
   cd backend
   npm install
   \`

4. Install dependencies for the frontend:
   \`
   cd ../frontend
   npm install
   \`

5. Set up environment variables for the backend (create a .env file in the backend directory):
   \`
   DATABASE_URL=postgres://<dbuser>:<dbpassword>@<dbserver>.postgres.database.azure.com:5432/<dbname>
   STORAGE_ACCOUNT_NAME=<storage_account_name>
   STORAGE_ACCOUNT_KEY=<storage_account_key>
   \`

6. Set up environment variables for the frontend (create a .env file in the frontend directory):
   \`
   API_URL=https://<backend_app_name>.azurewebsites.net
   \`

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
