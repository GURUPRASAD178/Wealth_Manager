# 💸 WealthManager.online – Portfolio Analytics Dashboard

A full-stack portfolio analytics dashboard that provides investors with a detailed view of their investments. This project includes a Django REST API backend and a React.js frontend with interactive charts powered by Chart.js.

---

## 🚀 Features

### 🔧 Backend (Django + DRF + SQLite)
- REST API with 4 core endpoints:
  - `/api/portfolio/holdings`: List of all stock holdings
  - `/api/portfolio/allocation`: Sector and market cap distribution
  - `/api/portfolio/performance`: Historical performance vs Nifty50 & Gold
  - `/api/portfolio/summary`: Key portfolio metrics
- Gain/loss and percentage calculations
- Clean code structure, error handling, and data validation
- Sample data loaded via scripts/admin

### 💻 Frontend (React + Chart.js)
- **Responsive Dashboard** with:
  - 📊 Sector & Market Cap Allocation Charts
  - 📋 Sortable Holdings Table
  - 📈 Performance Comparison Line Chart
  - 🏆 Top Performers and Portfolio Insights
  - 📃 Overview Cards with real-time metrics

---

## 🖥️ Live Demo

Frontend: [https://wealth-manager-blush.vercel.app/](https://wealth-manager-blush.vercel.app/)
Backend: [https://wealth-api.render.com](https://wealth-api.render.com)



---

## 🛠️ Tech Stack

| Layer      | Tech Used                         |
|------------|----------------------------------|
| Frontend   | React.js, Chart.js, Tailwind CSS |
| Backend    | Django, Django REST Framework    |
| Database   | SQLite (for demo simplicity)     |
| Deployment | Vercel (frontend), Render (API)  |

---

## 📊 Sample Data

- Indian stocks like RELIANCE, INFY, TCS, HDFC
- Realistic prices, quantities, sectors, and performance
- Manually loaded via spreadsheet / JSON into DB

---

## 🧠 AI Tools Used

| Tool        | Usage |
|-------------|-------|
| ChatGPT     | Code generation, debugging help, README template, UI design logic |
| GitHub Copilot | Code autocompletion during component and API setup |
| Google Bard / Gemini | Optional insights for visualization best practices |

> Clearly documented which code was AI-generated vs hand-written (in comments and commits)

---

## ⚙️ Getting Started

 ### Frontend and Backend Setup

```bash
git clone https://github.com/guruprasad178/Wealth_Manager.git
cd wealthmanager
python -m venv env
source env/bin/activate  # or env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd wealth-dashboard
npm install
npm start
