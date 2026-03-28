# PixelForge AI
> A React-based workspace for advanced AI image generation, structured prompt engineering, and local asset management. It provides a unified interface to interact with Google's generative models for rapid visual prototyping.

## Overview
PixelForge AI addresses the workflow fragmentation often found in prompt engineering by providing a cohesive, parameter-driven dashboard for AI image creation. Under the hood, the application leverages React and TypeScript to manage complex state across prompt configurations, style modifiers, and user settings. It connects directly to Google's Imagen and Gemini APIs, processing generation requests while seamlessly persisting results and metadata to the browser's local storage engines for immediate retrieval and historical tracking.

## Key Features
* **Structured Generation Engine:** Facilitates precise text-to-image creation by combining raw user input with configurable style, lighting, and mood modifiers.
* **Workspace & History Management:** Transitions users from an active prompt engineering workspace to a comprehensive history module equipped with filtering, metadata inspection, and bulk ZIP exporting.
* **Client-Side Persistence:** Employs IndexedDB and standard local storage to maintain a robust, persistent catalog of generated assets and application states without relying on a centralized database.

## Technical Architecture
* **Frontend/UI:** React, TypeScript, Tailwind CSS, Vite
* **Backend/Logic:** Google Imagen API, Google Gemini API, Client-side State Management
* **Infrastructure/Hardware:** Browser-native storage (IndexedDB), Static Hosting Environment

## Setup & Deployment
1. Clone the repository and navigate to the project directory.
2. Install frontend dependencies by executing `npm install`.
3. Duplicate the `.env.example` file to `.env` and supply the required API keys.
4. Launch the local development server utilizing `npm run dev`, or compile the application for deployment with `npm run build`.