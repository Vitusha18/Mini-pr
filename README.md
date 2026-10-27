# PestGuard AI - Early Pest Warning System

A production-oriented web platform for early pest outbreak prediction using environmental indicators.

## Core Objective
Help farmers receive early warnings about possible pest outbreaks before serious crop damage occurs. Predictions are primarily driven by real-time environmental indicators (temperature, relative humidity, rainfall, wind speed, atmospheric pressure, soil temperature, soil moisture) retrieved from Open-Meteo via farm coordinates.

## Project Structure
```
pestguard-ai/
├── client/              # React + Vite frontend (Port 5174)
└── server/              # Node.js + Express backend (Port 8080) - Upcoming Phase
```

## Technology Stack (Frontend)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Agricultural Brand Theme `#00A63C`)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Motion**: Framer Motion
- **HTTP Client**: Axios

## Getting Started (Frontend)

```bash
cd client
npm install
npm run dev
```

The frontend will run strictly at: **http://localhost:5174**
# Mini-pro
THIS IS COMPLETE MINI PROJECT 
# Mini-pr


# PestGuard AI – AI-Assisted Early Pest Warning System Using Environmental Indicators

PestGuard AI is a web-based project designed to support early pest-risk assessment using environmental indicators and image-based pest classification. It aims to help farmers make more informed crop-protection decisions by presenting environmental information and experimental AI predictions.

## Project Objectives

- Collect environmental information such as temperature, humidity, rainfall, and wind speed.
- Retrieve weather information using farm coordinates.
- Manage farmer accounts, farms, and crop information.
- Provide image-based pest classification through a Python AI service.
- Present prediction results through a React web interface.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Leaflet
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **AI service:** Python, FastAPI, PyTorch, MobileNetV3-Small
- **Weather data:** Open-Meteo

## Project Structure

```text
pestguard-ai/
├── client/          # React frontend
├── backend/         # Express API, routes, models and controllers
├── ai-services/     # FastAPI AI service and model checkpoint
└── .gitignore       # Git exclusions for local and generated files
```

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

The Vite development server is configured for port 5174.

### Backend

```bash
cd backend
npm install
```

Configure the required environment variables using a local `.env` file before starting the server. Never commit real credentials or secrets.

### AI Service

The AI service uses FastAPI and PyTorch. Install its Python dependencies in a virtual environment and configure the model checkpoint before starting the service. Refer to the AI service source and dependency configuration for the supported setup.

## Current Limitations

The image-classification endpoint is experimental and requires validation before practical agricultural use. The environmental prediction and prediction-fusion service modules currently require implementation. The project should not be treated as a validated pest-outbreak forecasting system until these components are implemented and evaluated.

## Security and Data

Environment files, dependency directories, build outputs, and training datasets are excluded from version control. Do not publish private credentials or sensitive farmer data.

## Repository

GitHub: https://github.com/Vitusha18/Mini-pr.git
 