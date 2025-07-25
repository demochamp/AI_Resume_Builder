# 🧠 AI Resume Builder

**AI Resume Builder** is a web-based tool that helps users create professional resumes effortlessly using AI-generated summaries and sleek, mobile-responsive designs. Users can input personal details, generate AI summaries, preview resumes, and download them as PDF files – all in a few clicks.

## 🚀 Features

- 🎨 Beautiful and responsive UI built with **HTML**, **Tailwind CSS**, and **JavaScript**
- 🧠 **AI-generated professional summaries** using Groq API (OpenAI-compatible)
- 📄 Real-time **resume preview**
- 📥 **Download resume as PDF** (using html2pdf.js)
- 🌙 Dark Mode toggle
- 📊 ATS (Applicant Tracking System) Score Checker *(Upcoming Feature)*

---

## 📁 Project Structure

ai-resume-builder/
│
├── groq-backend/ # Backend folder for Groq API integration
├── node_modules/ # Node.js dependencies
│
├── index.html # Main resume builder UI
├── login.html # Simple login page (if implemented)
│
├── package.json # Node project metadata
├── package-lock.json # Exact dependency versions
│
├── script.js # All main JavaScript logic (DOM, API calls, PDF)
├── styles.css # Custom Tailwind or additional styles

---

## ⚙️ Tech Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript
- **AI Integration**: Groq API (compatible with OpenAI format)
- **PDF Generation**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- **Icons**: Lucide Icons
- **Font & Design**: Google Fonts + Tailwind utility classes

---

## 🧠 Groq API Integration

You're using the [Groq API](https://groq.com/) as your AI backend.

In your `script.js`, make sure your API setup looks like this:

```js
const GROQ_API_KEY = 'your_groq_api_key_here'; // Replace with your actual key

const response = await fetch('http://localhost:3000/generate-summary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    resumeText: yourResumeTextVariable
  })
});

---

// Example: groq-backend/index.js
app.post('/generate-summary', async (req, res) => {
  const userInput = req.body.resumeText;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: "You are a professional resume expert." },
        { role: "user", content: userInput }
      ]
    })
  });

  const data = await response.json();
  res.send(data.choices[0].message.content);
});

---

🛠 How to Run
📦 Install dependencies (backend only)
cd groq-backend
npm install

▶️ Start the backend server
node index.js
# or if using nodemon
npx nodemon index.js

🌐 Open the frontend
Double-click index.html or use a live server like VS Code's Live Server extension.

---

🌟 Feedback
If you liked this project, don't forget to ⭐ the repo or share it with others!

