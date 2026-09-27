<h1 align="center">
  <br />
  Koggent — AI Multi-Agent Platform
  <br />
</h1>

<p align="center">
  <strong>A production-grade, full-stack AI assistant built entirely from scratch.</strong><br/>
  Multi-agent orchestration · Microservices · CI/CD to AWS ECS · Live artifact sandbox
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-4A90D9?style=flat-square&logo=chainlink&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_ECS-FF9900?style=flat-square&logo=amazon-aws&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
</p>

---

## What Is Koggent?

Koggent is a full-stack AI assistant I designed and built entirely on my own — from the landing page to the deployment pipeline.

It is not a tutorial clone. It is not a ChatGPT wrapper with a different skin.

**The core idea:** instead of one generic AI model trying to do everything, Koggent uses a router to understand what you're asking, then sends your request to the specialist agent best equipped to handle it. A coding question goes to the Coding Agent. A PDF upload triggers the RAG pipeline. An image is routed to the Vision Agent. Each agent is purpose-built, independently deployable, and powered by the best model for its job.

This project was built to solve a real problem — and to demonstrate what I'm capable of engineering at a professional level.

---

## Why This Project Matters (What I Actually Built)

Most developers claim to understand microservices, AI orchestration, or production deployment. I built all three together, from a blank repo.

Here is a concrete breakdown of what was designed and implemented:

### Multi-Agent Orchestration with LangGraph

The backend uses **LangGraph** (LangChain's stateful graph engine) to model the agent workflow as a directed graph. A router node receives every request, classifies intent using an LLM, and conditionally dispatches to one of eight downstream agent nodes.

This is not a simple `if/else` chain. It is a proper state machine with typed shared state, conditional edges, and graceful fallback routing. Intent classification is LLM-powered, with file-based routing (PDF → RAG, image → Vision) that bypasses the LLM entirely for performance.

**Agents built:**

| Agent | What It Does |
|---|---|
| **Chat Agent** | General reasoning, explanations, strategy — powered by Groq |
| **Coding Agent** | Generates multi-file applications (HTML/CSS/JS) with an Awwwards-level design brief injected into every prompt |
| **Search Agent** | Live web research via Tavily API, grounded with real citations |
| **PDF RAG Agent** | Uploads PDF to Qdrant vector DB, runs retrieval-augmented generation so you can query your own documents |
| **PPT Agent** | Generates a downloadable PowerPoint file from a text prompt |
| **Vision Agent** | Image generation and visual AI using Google Gemini |
| **PDF Agent** | Generates downloadable PDF documents |
| **Image Analyzer** | Multimodal image understanding via Google Gemini |

### Microservices Architecture

The backend is split into four independent services, each containerized with its own database namespace:

```
gateway (Port 8000)   →  API gateway, rate limiting, JWT verification, request proxying
auth    (Port 8001)   →  Firebase Auth + MongoDB user management
chat    (Port 8002)   →  Conversation history, session persistence, Redis caching
agent   (Port 8003)   →  LangGraph orchestration, all AI agent logic
billing (Port 8004)   →  Credit system, usage tracking, plan management
```

Every service talks to others only through the gateway or via environment-configured internal URLs. Services share a Redis instance for caching and a MongoDB cluster with isolated databases per service.

### CI/CD Pipeline — GitHub Actions → AWS ECR → AWS ECS

Every push to `main` triggers a GitHub Actions workflow that:

1. Builds each of the five Docker images (multi-platform: `linux/amd64`)
2. Authenticates to AWS and pushes all images to Amazon ECR
3. Issues force-new-deployment commands to each ECS service in sequence

No manual deployments. No SSH into a server. Push the code, the infrastructure handles the rest.

### Frontend — React 19 + Vite 8 + GSAP + Three.js

The frontend is a cinematic, animated SPA built with:

- **React 19** with React Router v7 for routing
- **Redux Toolkit** for global state management
- **GSAP v3** for scroll-driven, staged animations
- **Three.js** for 3D WebGL backgrounds
- **Framer Motion** for component-level transitions
- **Monaco Editor** (the same editor as VS Code) for the live code artifact sandbox
- **Lenis** for smooth inertia scrolling
- **Tailwind CSS v4** for utility-first styling

The Coding Agent's output is rendered in a Monaco Editor + iframe sandbox, giving users a live preview of generated code without leaving the app.

### Credit & Billing System

Each agent action deducts credits from the user's account. The billing service tracks usage, enforces plan limits, and returns remaining credits in every agent response. The frontend reflects this state in real time via Redux.

### Authentication

Firebase Authentication handles sign-in/sign-up (Google OAuth + Email/Password). A dedicated auth microservice wraps Firebase Admin SDK and issues session data to downstream services. The gateway validates JWT tokens on every request before proxying.

---

## Technology Stack at a Glance

**Frontend**
- React 19, Vite 8, React Router v7, Redux Toolkit
- Tailwind CSS v4, GSAP, Three.js, Framer Motion, Lenis
- Monaco Editor, React Markdown, React Syntax Highlighter
- Firebase SDK (client), Axios, Lucide React

**Backend (Node.js / ES Modules across all services)**
- LangChain + LangGraph (multi-agent orchestration)
- LLMs: Groq (`gpt-oss-120b`), DeepSeek via OpenRouter, Google Gemini
- Tavily (web search), Qdrant (vector DB for RAG), AWS S3 (file storage)
- MongoDB (Mongoose), Redis, Express 5
- PDF-parse, PDFKit, pptxgenjs (document generation)
- Firebase Admin SDK, Multer (file uploads)

**Infrastructure & DevOps**
- Docker (multi-platform builds, Docker Compose for local dev)
- GitHub Actions (CI/CD pipeline)
- AWS ECR (container registry), AWS ECS (container orchestration)
- Vercel (frontend hosting)

---

## Architecture Diagram

```
User Browser
     │
     ▼
┌─────────────────┐
│   React SPA     │  ← GSAP, Three.js, Monaco Editor, Redux
│   (Vercel)      │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│    Gateway      │  ← JWT auth, rate limiting, request routing
│   (ECS: 8000)   │
└──┬──┬──┬──┬────┘
   │  │  │  │
   ▼  ▼  ▼  ▼
 Auth Chat Agent Billing   ← Independent microservices on ECS
(8001)(8002)(8003)(8004)
              │
              ▼
      ┌───────────────┐
      │  LangGraph    │
      │  State Graph  │
      └──────┬────────┘
             │
      ┌──────▼──────┐
      │   Router    │  ← LLM-powered intent classification
      └──┬──┬──┬───┘
         │  │  │
    Chat │  │ Coding  PDF-RAG  Vision  Search  PPT

    ┌──────────────────────────────┐
    │  Groq │ DeepSeek │ Gemini   │  ← Per-agent model selection
    └──────────────────────────────┘

    ┌──────────────────────────────┐
    │ Qdrant │ AWS S3 │  Tavily   │  ← Vector DB, storage, web search
    └──────────────────────────────┘
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- API keys: Groq, OpenRouter (DeepSeek), Google Gemini, Tavily, Firebase, AWS S3, Qdrant

### Backend — start all services with Docker Compose

```bash
cd backend
# Fill in the .env files inside each service directory first
docker-compose up --build
```

This starts all five services + Redis + MongoDB. The gateway is available at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## What This Demonstrates

If you are a recruiter or engineer reading this, here is what this project actually proves:

- **I can build complete products** — not just components, not just scripts. End-to-end, from landing page to deployment pipeline.
- **I understand distributed systems** — independent services, internal networking, shared infrastructure, service discovery.
- **I can work with AI at the infrastructure level** — not just calling `openai.chat()`, but orchestrating stateful agent graphs, managing embeddings, and building RAG pipelines.
- **I understand DevOps** — Dockerfiles, multi-platform builds, ECR, ECS, and GitHub Actions CI/CD pipelines.
- **I care about product quality** — the frontend is animated, accessible, and designed to a premium standard. I did not stop at "it works."
- **I can manage complexity** — five services, eight agents, one frontend, one pipeline, all coherent and working together.

---

## Project Status

Koggent is actively maintained and under continued development. Current work includes expanding agent capabilities, improving streaming response support, and refining the billing and plan system.

---

<p align="center">Built with focus, curiosity, and a lot of late nights.</p>
