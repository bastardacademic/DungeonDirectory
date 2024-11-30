# API Documentation

This document outlines the API endpoints for Dungeon Directory.

---

## Booking Endpoints

### Create Group Booking
#### `POST /api/bookings/group`
- **Description**: Create a new group booking.
- **Request Body**:
    ```json
    {
      "propertyId": 1,
      "userIds": [1, 2, 3],
      "totalCost": 300
    }
    ```
- **Response**:
    ```json
    {
      "message": "Group booking created",
      "groupBooking": {
        "id": 42
      }
    }
    ```

---

## Waitlist Endpoints

### Add to Waitlist
#### `POST /api/waitlist`
- **Description**: Add a user to the waitlist for a property.
- **Request Body**:
    ```json
    {
      "userId": 1,
      "propertyId": 5
    }
    ```
- **Response**:
    ```json
    {
      "message": "Added to waitlist"
    }
    ```

### Notify Waitlist Users
#### `POST /api/waitlist/notify`
- **Description**: Notify users on the waitlist when a property becomes available.
- **Request Body**:
    ```json
    {
      "propertyId": 5
    }
    ```
- **Response**:
    ```json
    {
      "message": "Notified 3 users"
    }
    ```

---

## Subscription Endpoints

### Add Subscription
#### `POST /api/subscriptions`
- **Description**: Add a subscription for a user.
- **Request Body**:
    ```json
    {
      "userId": 1,
      "tier": "Gold"
    }
    ```
- **Response**:
    ```json
    {
      "message": "Subscription added",
      "subscription": {
        "id": 8
      }
    }
    ```
