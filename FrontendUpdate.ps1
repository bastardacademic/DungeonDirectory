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

# Create Frontend Directory Structure
New-Item -ItemType Directory -Path "$localPath\frontend\components"
New-Item -ItemType Directory -Path "$localPath\frontend\contexts"
New-Item -ItemType Directory -Path "$localPath\frontend\hooks"
New-Item -ItemType Directory -Path "$localPath\frontend\pages"
New-Item -ItemType Directory -Path "$localPath\frontend\styles"
New-Item -ItemType Directory -Path "$localPath\frontend\utils"

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

@"
module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
};
"@ | Out-File -FilePath "$localPath\frontend\next.config.js"

@"
API_URL=https://<backend_app_name>.azurewebsites.net
"@ | Out-File -FilePath "$localPath\frontend\.env.example"

@"
import '../styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/i18n';

function MyApp({ Component, pageProps }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}

export default MyApp;
"@ | Out-File -FilePath "$localPath\frontend\pages\_app.js"

@"
import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Airbnb-like Platform</h1>
      <p>This platform is tailored for the BDSM and Poly communities.</p>
    </div>
  );
}
"@ | Out-File -FilePath "$localPath\frontend\pages\index.js"

@"
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      showTimeSelect
      timeFormat=\"HH:mm\"
      timeIntervals={15}
      dateFormat=\"MMMM d, yyyy h:mm aa\"
    />
  );
};

export default CustomDatePicker;
"@ | Out-File -FilePath "$localPath\frontend\components\CustomDatePicker.js"

@"
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
"@ | Out-File -FilePath "$localPath\frontend\contexts\AuthContext.js"

@"
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
"@ | Out-File -FilePath "$localPath\frontend\hooks\useFetch.js"

@"
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  color: #333;
}

p {
  color: #666;
}
"@ | Out-File -FilePath "$localPath\frontend\styles\globals.css"

@"
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: 'Welcome to the Airbnb-like Platform',
        description: 'This platform is tailored for the BDSM and Poly communities.',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
"@ | Out-File -FilePath "$localPath\frontend\utils\i18n.js"

# Initial Commit and Push
Set-Location -Path $localPath
git add .
git commit -m "Initial commit"
git push -u origin master

Write-Output "GitHub repository created and initial setup complete."
