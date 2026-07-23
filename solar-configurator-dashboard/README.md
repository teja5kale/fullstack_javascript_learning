# Solar Configurator Web Dashboard

A full-stack web application inspired by the CCTech Solar Design Configurator
AutoCAD plugin. It simulates and manages solar plant layouts (table
placement, pile counts, cable BOQ) as a standalone web app — built to
demonstrate the Full Stack JavaScript & Frontend Engineering curriculum
(The Odin Project: JavaScript, React, NodeJS, Databases).

## Tech Stack

- **Frontend:** React, React Router, Context API, CSS Grid & Flexbox
- **Backend:** Node.js, Express.js, REST API
- **Database:** PostgreSQL

## Project Structure

```
solar-configurator-dashboard/
├── backend/
│   ├── src/
│   │   ├── server.js            # Express app entrypoint
│   │   ├── db.js                # PostgreSQL connection pool
│   │   ├── routes/projects.js   # REST route definitions
│   │   ├── controllers/         # Request handlers (CRUD + calculations)
│   │   ├── utils/calculations.js# Table/pile/cable BOQ calculation engine
│   │   └── models/schema.sql    # Database schema
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/                # Dashboard, ProjectForm, ProjectDetail,
    │   │                         # LayoutSimulator, CableBOQ, About
    │   ├── components/Sidebar.jsx
    │   ├── context/AppContext.jsx
    │   ├── api/api.js            # fetch-based API client (async/await)
    │   └── styles/main.css
    └── package.json
```

## Setup

### 1. Database

Create a PostgreSQL database and run the schema:

```bash
createdb solar_configurator
psql -d solar_configurator -f backend/src/models/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # edit with your PostgreSQL credentials
npm install
npm start                # runs on http://localhost:5000
```

If PostgreSQL setup is difficult in your environment, you can swap
`backend/src/db.js` and the controller queries for a MongoDB/Mongoose
equivalent — the calculation logic in `utils/calculations.js` is
database-agnostic and doesn't need to change.

### 3. Frontend

```bash
cd frontend
npm install
npm start                # runs on http://localhost:3000
```

The frontend expects the API at `http://localhost:5000/api` by default.
Override with a `.env` file containing `REACT_APP_API_URL=<your-api-url>`.

## Features

- **Dashboard** — list, view, edit, delete plant projects
- **Project Form** — configure capacity, table type, pitch, boundary
  dimensions, with client-side validation (e.g. pitch must exceed table
  width to avoid overlap — mirrors the plugin's overlap warning)
- **Project Detail** — auto-calculated table/pile counts (mirrors *Place
  Tables* / *Place Piles*)
- **Layout Simulator** — schematic CSS-grid visualization of the table array
- **Cable BOQ** — record cable runs (LT/DC/HT, above/underground) and see
  aggregated length + cost (mirrors *Export Spreadsheet* / *Messenger Wire
  Length*)
- **About** — maps each course topic to the corresponding project feature

## Course-to-Feature Mapping

| Course Topic        | Project Feature                                |
|---------------------|------------------------------------------------|
| HTML/CSS            | Responsive dashboard, forms                    |
| JavaScript          | Validation, calculations, DOM logic            |
| React               | Components, Hooks, Router                      |
| Node.js             | REST APIs                                      |
| Express             | Backend services                               |
| Databases           | PostgreSQL                                     |
| APIs                | CRUD operations                                |
| Async/Await         | API communication                              |
| Forms               | Project configuration                          |
| Responsive Design   | Mobile-friendly UI                             |
