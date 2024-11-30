# Dungeon Directory

Dungeon Directory is a platform tailored for the BDSM and Poly communities, offering secure property listings, flexible booking options, and privacy-focused messaging. This application supports web, Android, and iOS platforms.

---

## Features
- **Group Bookings**: Book properties with multiple participants and split costs.
- **Interactive Map Search**: View properties on a map and filter results.
- **Waitlist**: Join a waitlist for fully booked properties and get notified upon availability.
- **Saved Searches**: Save your favorite search criteria and get updates.
- **Host Subscriptions**: Tiered subscriptions for advanced hosting features.
- **Dynamic Pricing**: Hosts can set variable rates for peak/off-peak times or events.
- **Flexible Check-In/Check-Out**: Guests can adjust timings if properties are available.
- **Accessibility Compliance**: High-contrast mode, adjustable text sizes, screen reader support.

---

## Platforms
- **Web Application**: Built using React and Next.js.
- **Mobile Applications**: Developed with React Native, available for iOS and Android.
- **Backend API**: Node.js with Express.js, powered by a PostgreSQL database.

---

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Expo CLI (for mobile development)

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/bastardacademic/DungeonDirectory.git
    cd DungeonDirectory
    ```

2. Set up the backend:
    - Install dependencies:
        ```bash
        cd backend
        npm install
        ```
    - Set up the database:
        ```bash
        npx prisma migrate dev
        ```
    - Start the backend server:
        ```bash
        npm run dev
        ```

3. Set up the web frontend:
    - Navigate to the frontend directory:
        ```bash
        cd ../frontend
        npm install
        ```
    - Start the web app:
        ```bash
        npm run dev
        ```

4. Set up the mobile app:
    - Navigate to the mobile directory:
        ```bash
        cd ../mobile
        npm install
        ```
    - Start the Expo server:
        ```bash
        expo start
        ```

---

## License
Dungeon Directory is licensed under the MIT License. See [LICENSE](LICENSE) for details.
