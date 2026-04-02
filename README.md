# LedgerX — Advanced Finance Dashboard

A premium, interactive finance dashboard built to fulfill the requirements of the Frontend Development Assignment. LedgerX focuses on visual excellence, intuitive data exploration, and role-based interface dynamics.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aishwary-vansh/ledgerX.git
   cd ledgerx
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Folder Structure

```text
ledgerx/
├── src/
│   ├── components/      # Reusable UI Blocks (Cards, Charts, Layout)
│   ├── contexts/        # Global State Management (TransactionContext)
│   ├── pages/           # Core Views (Dashboard, Transactions, Insights)
│   ├── utils/           # Mock Data and Helper Functions
│   ├── App.jsx          # Root Component & Layout
│   ├── main.jsx         # Application Entry Point
│   └── index.css        # Tailwind v4 Configuration & Theme
├── public/              # Static Assets & Icons
├── index.html           # HTML Entry Point
├── package.json         # Dependencies & Build Scripts
└── vite.config.js       # Vite Configuration
```

---

## 🛠 Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (Modern Utility-First)
- **Animations**: Anime.js & CSS Transitions
- **Charts**: Recharts & Chart.js
- **Icons**: Lucide-React
- **Typography**: Syne (Headers), Cabinet Grotesk (Body), DM Mono (Data)

---

## ✨ Features (Mapped to Requirements)

### 1. Dashboard Overview
- **Summary Cards**: Real-time calculation of Total Balance, Income, and Expenses.
- **Balance Trend**: A smooth line chart visualizing financial trajectory over time.
- **Categorical Breakdown**: An interactive donut chart showing spending distribution.

### 2. Transactions Ledger (CRUD Enabled)
- **Live Search**: Instant filtering across descriptions and categories.
- **Type Filtering**: Quick toggles for All, Income, or Expense entries.
- **Admin CRUD**: Full Create, Read, Update, and Delete functionality for the ledger.
- **CSV Export**: Download the current filtered ledger as a CSV file for reporting.

### 3. Role-Based UI (RBAC)
- **Identity Switcher**: A dedicated toggle in the Topbar to switch between **Viewer** and **Owner**.
- **Security**: Switching to "Owner Mode" requires a security key (Pass: `1234`).
- **Context-Aware UI**: Delete and Edit actions are only visible and accessible in Owner Mode.

### 4. Advanced Insights & AI
- **Savings Rate**: Real-time calculation of your financial efficiency.
- **AI Observations**: Contextual advice based on your current spending patterns.
- **Financial Health**: A visual gauge of your overall financial standing.

### 5. Persistence & State
- **Context API**: Centralized `TransactionContext` for managing global state.
- **Local Persistence**: All transactions and modifications are automatically synced to `localStorage`.

### 6. UI/UX Excellence
- **Glassmorphism**: Premium frosted-glass aesthetics with vibrant accent orbs.
- **Responsive Layout**: Fluid design that adapts from high-res monitors to mobile.
- **Interactivity**: Custom trailing cursor and smooth hover transitions.

---

## 💡 Design Philosophy
LedgerX is designed to be "Heavy & Impactful." By using tight line-heights (`leading-none`), bold Syne typography, and removing default font-smoothing, the application achieves a distinct technical-modern aesthetic inspired by high-end financial platforms.

---

**Developed with ❤️ by Aishwary Vansh**
