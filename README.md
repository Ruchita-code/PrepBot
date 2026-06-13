# 🤖 PrepBot — AI Interview Agent

An AI-powered interview preparation platform that conducts real voice-based mock interviews, evaluates your performance, and provides detailed feedback with scoring.

🌐 **Live Demo:** [https://prepbot-client.onrender.com](https://prepbot-client.onrender.com)  
📂 **GitHub:** [https://github.com/Ruchita-code/PrepBot](https://github.com/Ruchita-code/PrepBot)

---

## ✨ Features

- 🎙️ **Voice-Based AI Interviewer** — A realistic AI agent asks questions out loud using Web Speech Synthesis with male/female voice options and animated avatar
- 📄 **Resume-Based Questions** — Upload your resume and the AI generates personalized questions based on your experience
- 🎯 **HR & Technical Round** — Choose between HR or Technical interview mode before starting
- ⏱️ **Timed Questions** — Each question has a time limit to simulate real interview pressure
- 📝 **Real-Time Feedback** — Get instant AI feedback after every answer
- 📊 **Performance Analysis** — View detailed performance report with scores after interview completion
- 📥 **Download as PDF** — Export your full interview report including scores and feedback as a PDF
- 🕓 **Interview History** — View all your past interviews and track your improvement over time

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — UI framework
- **Framer Motion** — Animations
- **Web Speech API** — Voice synthesis and speech recognition
- **OpenRouter API (GPT-4o Mini)** — AI question generation and answer evaluation
- **Axios** — HTTP requests

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB** — Database for storing interviews, answers, and feedback
- **Multer** — Resume file upload (stored locally)
- **OpenRouter API** — AI model integration via `openai/gpt-4o-mini`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- OpenRouter API Key ([get one free at openrouter.ai](https://openrouter.ai))

### 1. Clone the repository
```bash
git clone https://github.com/Ruchita-code/PrepBot.git
cd PrepBot
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_SERVER_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
PrepBot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/         # Videos, images
│   │   ├── components/     # Reusable components
│   │   │   ├── Step2Interview.jsx   # Core voice interview component
│   │   │   └── Timer.jsx
│   │   └── pages/          # Page components
│
├── server/                 # Node.js backend
│   ├── public/             # Uploaded resumes stored here
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   └── models/             # MongoDB schemas
```

---

## 🔄 How It Works

1. **Upload Resume** — User uploads their resume (PDF, max 5MB)
2. **Choose Round** — Select HR Round or Technical Round
3. **AI Generates Questions** — GPT-4o Mini reads the resume and generates relevant questions
4. **Voice Interview** — AI avatar speaks each question aloud, user answers via mic or text
5. **Instant Feedback** — AI evaluates each answer and gives spoken + written feedback
6. **Performance Report** — After all questions, a detailed report with scores is generated
7. **Download PDF** — Export the full report as a PDF for offline review

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Start a new interview session |
| POST | `/api/interview/submit-answer` | Submit answer for a question |
| POST | `/api/interview/finish` | Finish interview and get report |
| GET | `/api/interview/history` | Get all past interviews |

---

## ⚠️ Note

> This project is hosted on Render's free tier. The backend may take **30–50 seconds** to wake up on first load. Please wait a moment if the page doesn't load immediately.

---

## 👩‍💻 Author

**Ruchita** — [GitHub](https://github.com/Ruchita-code)