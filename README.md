# CartCraft — Frontend + Backend Starter

CartCraft is a starter full-stack e-commerce application organized into separate `frontend/` and `backend/` folders. It includes a React/Vite user interface and an Express REST API with sample product data.

> This is a runnable starter scaffold based on the project description in the supplied resume image. It does not yet implement the complete eight-service architecture, Kafka workflows, AI pricing engine, authentication, database persistence, Kubernetes manifests, or CI/CD pipeline.

## Project structure

```text
CartCraft/
├── frontend/                 # React + Vite UI
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── data/products.js
│   │   ├── routes/products.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js 20 or newer (recommended)
- npm

## Run the backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`, then run:

```bash
npm run dev
```

The API starts at `http://localhost:5000` by default.

- `GET /api/health` — API health check
- `GET /api/products` — list sample products
- `GET /api/products/:id` — get one product

## Run the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`, then run:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend calls the backend at `http://localhost:5000` by default.

## Environment variables

### Backend (`backend/.env`)

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Next steps

To evolve this starter toward the full CartCraft architecture, add authentication and persistence first, then split the backend into bounded services and introduce Kafka, Redis/BullMQ, PostgreSQL, AI pricing workflows, observability, Docker, Kubernetes, and CI/CD as those components are implemented and tested.
