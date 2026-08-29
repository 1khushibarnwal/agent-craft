# 🤖AgentCraft
## AI Agent Learning Project

This repository is a **learning-oriented project** that demonstrates how to build an intelligent AI agent capable of handling diverse user requests. It showcases a practical implementation combining rule‑based routing for specific tasks (weather, cryptocurrency prices, web search) with a Large Language Model (LLM) for general conversation.

Developed by **Khushi Barnwal**, this project serves as an excellent starting point for anyone interested in:
- Understanding the architecture of an AI‑powered assistant.
- Learning how to integrate external APIs for real‑world data.
- Building a full‑stack application with **React** (frontend) and **Express** (backend).
- Exploring the fundamentals of prompt‑based AI using models like **Llama**.

> **Note:** This project is actively developed – the latest commit (April 17, 2026) introduces a preliminary backend structure, while the frontend implements a full chat interface with conversation memory.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🌤️ Weather Intelligence** | Instantly fetches current temperature for any city (defaults to Kolkata). Triggered by keywords like `temp` or `weather` using the free **wttr.in** API. |
| **💰 Cryptocurrency Tracker** | Responds to queries about BTC or ETH prices. Fetches live data from **CoinGecko** and supports both USD and INR currency options. |
| **🔍 Live Web Search** | Automatically performs DuckDuckGo searches for requests containing `latest`, `news`, `who is`, or `what is`, returning the most relevant abstract or heading. |
| **💬 General Conversation** | For all other interactions, the agent uses **Groq’s Llama‑3.1‑8B‑Instant** model via the Groq SDK, providing helpful, conversational responses. |
| **🗣️ Chat Interface** | A clean, modern chat UI built with React. Features include dark/light theme toggling, message typing animations, and session‑based conversation memory. |
| **🧠 Conversation Memory** | Each user session maintains its own message history, allowing for context‑aware interactions within a chat. Server‑side memory is stored in a simple object (easily replaceable with a database for production). |

---

## 🧰 Tech Stack

### Frontend
- **React 19** – UI framework
- **Vite** – Build tool and development server
- **Axios** – HTTP client for backend communication
- **CSS** – Custom styling with theme support

### Backend
- **Node.js / Express** – REST API server
- **Groq SDK** – Access to Llama‑3.1‑8B‑Instant LLM
- **Axios** – External API calls (DuckDuckGo, CoinGecko, wttr.in)
- **CORS / dotenv** – Security and environment configuration

### APIs & Services
| Service | Purpose |
|---------|---------|
| **DuckDuckGo Instant Answer API** | Web search summarization |
| **CoinGecko API** | Cryptocurrency price data |
| **wttr.in** | Free weather information |
| **Groq Cloud (Llama‑3.1‑8B)** | Conversational AI |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- A **Groq API Key** – obtain one for free from [Groq Cloud](https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/1khushibarnwal/learning-ai-agent.git
   cd learning-ai-agent

2. **Set up the backend**
```bash
# Install backend dependencies
npm install

# Create a .env file and add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env
```

3. Set up the frontend
```bash
cd frontend
npm install
cd ..
```

4. Run the application

Terminal 1 – Backend:
```bash
npm run dev
```
The backend will start on http://localhost:3000.

Terminal 2 – Frontend:
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:5173 (or another available port).

5. Open your browser and navigate to the frontend URL to start chatting with your AI agent!

## 📁 Project Structure
```bash
learning-ai-agent/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main chat component with state management
│   │   ├── App.css          # Styling with theme support
│   │   └── index.css        # Global styles
│   ├── index.html           # Entry HTML file
│   ├── package.json         # Frontend dependencies
│   └── eslint.config.js     # Linting configuration
│
├── server.js                # Express backend with API routes
├── package.json             # Backend dependencies and scripts
├── package-lock.json        # Dependency lock file
└── .gitignore               # Git ignore rules
```

## 🔄 How It Works – The “Hard Routing” Approach
This project implements a unique two‑step processing pipeline for handling user requests:

### Step 1: Hard Routing (No AI)
The server first scans incoming messages for specific keywords, completely bypassing the LLM for these use cases:

Weather – Detects temp or weather, extracts the city name (or uses "Kolkata"), and calls the wttr.in API.

Cryptocurrency – Looks for btc, bitcoin, eth, or ethereum, determines the currency (usd/inr), and fetches price data from CoinGecko.

Web Search – Triggers on latest, news, who is, or what is, then queries DuckDuckGo and returns the most relevant summary.

### Step 2: AI Fallback (LLM)
If none of the hard‑routed conditions are met, the server sends the conversation history (including system prompt, user message, and previous messages) to the Groq Llama‑3.1‑8B‑Instant model for a natural, context‑aware response.

Why this approach? Hard routing reduces API costs, improves response speed for deterministic tasks, and gives you fine‑grained control over critical functionality – a common pattern in production agent systems.

## 🔮 Future Enhancements

Based on the commit history and project direction, potential improvements could include:

### Backend Enhancements:
- Replace in-memory storage with MongoDB (mongoose is already installed)
- Implement user authentication and session management
- Add request logging and monitoring
- Improve error handling and validation
- Add rate limiting to prevent API abuse
- Implement caching for frequently requested data
- Add WebSocket support for real-time updates
- Create comprehensive API documentation with Swagger/OpenAPI

### Agent Capabilities:
- Add more hard-routed actions:
  - Calculator functionality
  - Unit conversion
  - Email sending
  - Calendar integration
  - To-do list management
- Implement tool-use patterns (function calling)
- Add multi-step planning and reasoning
- Integrate more external APIs:
  - News APIs (NewsAPI, GNews)
  - Social media APIs
  - Financial market data
  - Translation services
- Add support for file uploads and processing
- Implement memory persistence across sessions

### Frontend Improvements:
- Improve UI/UX with message streaming
- Add voice input/output capabilities
- Implement chat export/sharing functionality
- Add conversation search and filtering
- Create user profiles and preferences
- Add typing indicators and read receipts
- Implement message reactions and feedback
- Add support for markdown rendering
- Create mobile-responsive design
- Add PWA support for offline usage

### Deployment & DevOps:
- Containerize with Docker and Docker Compose
- Deploy to cloud platforms:
  - AWS (EC2, ECS, or Lambda)
  - Google Cloud Platform
  - Azure
  - Heroku / Render / Railway
- Add CI/CD pipeline (GitHub Actions)
- Set up monitoring and alerting (Prometheus, Grafana)
- Implement logging aggregation (ELK stack)
- Add performance optimization and load testing
- Configure SSL/TLS for secure connections
- Set up environment-specific configurations

### Security Enhancements:
- Implement API key rotation
- Add input sanitization and validation
- Implement CORS policies properly
- Add CSRF protection
- Implement JWT-based authentication
- Add audit logging for sensitive operations
- Encrypt sensitive data at rest

### Testing & Quality:
- Write unit tests for backend functions
- Add integration tests for API endpoints
- Implement end-to-end testing (Cypress/Playwright)
- Add performance benchmarks
- Set up code coverage reporting
- Implement pre-commit hooks with linting

### Documentation:
- Add API reference documentation
- Create user guide and tutorials
- Write contributor guidelines
- Add troubleshooting guide
- Create architecture diagrams
- Document environment variables clearly
- Add code comments for complex logic

### Community & Collaboration:
- Add issue templates for bug reports and feature requests
- Create pull request template
- Set up discussion forums or Discord server
- Add code of conduct
- Create contributing guide
- Add badges for build status, coverage, etc.

### Performance Optimizations:
- Implement response compression
- Add database indexing
- Optimize API calls with batch requests
- Implement CDN for static assets
- Add lazy loading for frontend components
- Implement service workers for offline support
- Optimize images and assets

### Analytics & Insights:
- [.] Add usage analytics
- Implement error tracking (Sentry)
- Add performance monitoring
- Create user behavior dashboards
- Implement A/B testing capabilities

### Accessibility:
- Add screen reader support
- Implement keyboard navigation
- Ensure proper color contrast
- Add ARIA labels
- Support high contrast mode
- Add focus management

### Internationalization:
- Add multi-language support
- Implement i18n/l10n framework
- Add RTL language support
- Support different date/time formats
- Add currency localization

---

**Implementation Priority Suggestions:**
1. **High Priority** - Backend enhancements, security, and basic testing
2. **Medium Priority** - Frontend improvements, agent capabilities, deployment
3. **Low Priority** - Analytics, internationalization, advanced features

**Contributions Welcome!**  
Feel free to pick any item from this list and submit a pull request. For major features, please open an issue first to discuss the implementation approach.

## 👤 Author
Khushi Barnwal [https://github.com/1khushibarnwal]

## 🤝 Acknowledgments
- Groq – For providing fast, accessible LLM inference.

- wttr.in – For the simple, free weather API.

- CoinGecko – For reliable cryptocurrency data.

- DuckDuckGo – For the instant answer API.

## 📜 License
MIT License
