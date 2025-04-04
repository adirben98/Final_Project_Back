# Bookify - AI Children's Books API


The backend service for the AI Children's Books web app, providing API endpoints for book generation, user management, and AI integration.

## Features

- 🤖 AI-powered story generation (using OpenAI GPT)
- 🖼️ Image generation for book illustrations (using DALL-E)
- 🔐 JWT authentication and user management
- 📚 Book storage and management

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (database)
- API key from Open AI

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Final_Project_Backend
   cd Final_Project_Backend
   ```
2. **Install dependencies**:
   ```
   npm i
   ```
3. **Set up environment variables**:
    Create a .env file based on .env.example:
   ```
    PORT=3000
    DATABASE_URL=mongodb://127.0.0.1:27017/webApp_final
    TOKEN_SECRET=your_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRATION = 1y
    GOOGLE_CLIENT_ID=your_GOOGLE_CLIENT_ID
    OPEN_AI_API_KEY=your_OPEN_AI_API_KEY
   ```
4. **Run the server**:
   ```
   npm run dev
   ```

    

  
