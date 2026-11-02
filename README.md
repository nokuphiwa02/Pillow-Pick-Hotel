<img src="https://socialify.git.ci/nokuphiwa02/Pillow-Pick-Hotel/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Pillow-Pick-Hotel" width="640" height="320" />
# HavenStay – Hotel Booking System

## About the Project

HavenStay is a web-based hotel booking application designed to make finding and booking accommodation easier and more convenient. The platform allows guests to explore hotels, view available rooms, manage their bookings, save favourite hotels, and make secure online payments.

The system also provides an administrative dashboard where administrators can manage hotels, rooms, users, and guest bookings.

## Features

### Guest Features
- User registration and login.
- Browse available hotels and accommodation.
- View detailed hotel information and room images.
- Search for hotels by city.
- View room types, prices, capacity, and facilities.
- Make hotel room bookings.
- View and manage personal bookings.
- Cancel bookings.
- Add and remove favourite hotels.
- Update personal profile information.
- Complete payments using Paystack.

### Admin Features
- Admin dashboard with an overview of the system.
- Add, update, and delete hotels.
- Manage hotel rooms and room availability.
- View and manage guest bookings.
- View and manage registered users.
- Monitor booking and payment information.

## Technologies Used

### Frontend
- React.js
- TypeScript
- Vite
- Redux Toolkit
- React Router
- CSS Modules
- Fetch API

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- Bcrypt.js

### Payment Integration
- Paystack

## Project Structure

```text
Pillow-Pick-Hotel/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── store/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── Types/
│   │   └── ...
│   └── package.json
│
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/nokuphiwa02/Pillow-Pick-Hotel.git
```

### 2. Navigate to the Project

```bash
cd Pillow-Pick-Hotel
```

### 3. Set Up the Backend

Open a terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

Configure your backend environment variables in a `.env` file. These should include the database connection details, JWT secret, and Paystack configuration required by the application.

Start the backend using the development script configured in `backend/package.json`.

### 4. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

## Database

HavenStay uses PostgreSQL as its relational database.

The database stores information about:

- Registered users
- Guest profiles
- Hotels
- Hotel rooms
- Room images
- Bookings
- Payments
- Favourite hotels

Create a PostgreSQL database and configure the database connection details in the backend environment file.

## Payment Integration

HavenStay integrates Paystack to process online payments.

The payment process allows guests to:
1. Select a hotel room.
2. Confirm a booking.
3. Proceed to the checkout page.
4. Initiate payment through Paystack.
5. Complete the payment process.

Payment status is stored in the database for tracking and management.

## Authentication and Security

The application uses:
- JSON Web Tokens (JWT) for authentication.
- Bcrypt.js for password hashing.
- Protected backend routes for authorized operations.
- Role-based access for guest and admin functionality.

## Future Improvements

- Email booking confirmations.
- Booking cancellation and refund improvements.
- Advanced hotel search and filtering.
- Guest reviews and ratings.
- Improved payment history and reporting.
- Enhanced mobile responsiveness.

## Live Application

[Visit HavenStay](https://pillow-pick-hotel.vercel.app/)

## GitHub Repository

[View the HavenStay Source Code](https://github.com/nokuphiwa02/Pillow-Pick-Hotel.git)

## Author



Full-Stack Developer

Developed as a hotel booking system project using React, TypeScript, Node.js, Express, and PostgreSQL.
