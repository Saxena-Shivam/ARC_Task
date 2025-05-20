# ARC Project

## Overview

ARC is a full-stack web application that allows users to send, receive, and manage requests between two user types: **Requestor** and **Reciever**. The system includes authentication, request management, status tracking, and automated email reminders for pending requests.

---

---

## Deployment

- **Frontend Live Demo**: [https://arc-woad-kappa.vercel.app](https://arc-woad-kappa.vercel.app)
- **Frontend**: Can be deployed on Vercel (see `vercer.json` for rewrite rules).
- **Backend**: Deploy on any Node.js-compatible server (Heroku, Render, etc.).

---

## Features

### User Management

- **User Registration & Login**: Secure authentication using JWT.
- **User Types**: Supports two roles: `Requestor` and `Reciever`.

### Request System

- **Send Requests**: Requestors can send requests to Recievers.
- **Pending Requests**: Recievers see only requests that are pending their action.
- **Accept/Reject Requests**: Recievers can accept or reject requests.
- **Status Tracking**: Requests have statuses (`pending`, `accepted`, `rejected`) that update in real-time.
- **Sent & Received Messages**: Both user types can view their sent and received requests/messages.

### Automated Email Reminders

- **Scheduled Reminders**: If a request remains pending for more than 1 hour, all Recievers receive a reminder email every 5 minutes until the request is handled.
- **Ethereal/Gmail SMTP Support**: Easily switch between Ethereal (for testing) and Gmail (for production) for sending emails.

### UI/UX

- **Role-based Dashboard**: Different dashboard views for Requestors and Recievers.
- **Responsive Design**: Built with React and Tailwind CSS for a modern, responsive interface.
- **Toast Notifications**: Success and error feedback for user actions.

### Backend

- **Express.js API**: RESTful API for all operations.
- **MongoDB/Mongoose**: Data storage and schema management.
- **Node-cron**: Background job for sending reminder emails.
- **Nodemailer**: Email sending functionality.

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- (Optional) Gmail account with App Password for production email

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/Saxena-Shivam/ARC_Task
   cd ARC_Task
   ```

2. **Install dependencies**

   ```sh
   cd backend
   npm install
   cd ../arc-front
   npm install
   ```

3. **Set up environment variables**

   In `backend/.env`:

   ```
   GMAIL_PASSWORD=your_gmail_app_password
   ```

4. **Start the backend**

   ```sh
   cd backend
   node index.js
   ```

5. **Start the frontend**
   ```sh
   cd arc-front
   npm start
   ```

---

## Project Structure

```
arc-project/
│
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── jobs/
│   │   └── reminderJob.js
│   ├── index.js
│   └── .env
│
├── arc-front/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## Deployment

- **Frontend**: Can be deployed on Vercel (see `vercer.json` for rewrite rules).
- **Backend**: Deploy on any Node.js-compatible server (Heroku, Render, etc.).

---

## License

MIT

---

## Authors

- [SHIVAM SAXENA](https://github.com/Saxena-Shivam)

---

## Acknowledgements

- [Nodemailer](https://nodemailer.com/)
- [Node-cron](https://www.npmjs.com/package/node-cron)
- [MongoDB](https://www.mongodb.com/)
- [React](https://react.dev/)
