# LedgerX — Advanced Finance Dashboard

**A modern, interactive finance dashboard for tracking transactions, visualizing spending patterns, and managing financial data — built as part of a Frontend Development assignment.**

---

## Live Demo & Repository

| | |
|---|---|
| 🌐 **Live Demo** | [ledgerx-831q.onrender.com](https://ledgerx-831q.onrender.com/) |
| 💻 **Repository** | [github.com/aishwary-vansh/ledgerX](https://github.com/aishwary-vansh/ledgerX) |

> **Note:** The application is hosted on Render's free tier. The first load may take up to 30 seconds as the server wakes from idle — this is expected behavior and not a bug.

---

## Overview

LedgerX is a single-page finance dashboard that lets users view their financial summary, explore a detailed transaction ledger, and understand spending behavior through visual analytics. The interface adapts based on the user's role — a **Viewer** gets a clean read-only experience, while an **Owner** gets full control to add, edit, and delete entries.

The project was built with a focus on visual polish, component modularity, and thoughtful UX — while meeting every stated assignment requirement.

---

## Requirement Coverage

| Requirement | Status | Implementation |
|---|---|---|
| Summary cards — Balance, Income, Expenses | ✅ | Dashboard → real-time calculated stat cards |
| Time-based visualization | ✅ | Dashboard → Balance Trend (line chart) |
| Categorical visualization | ✅ | Dashboard → Spending Breakdown (donut chart) |
| Transaction list with Date, Amount, Category, Type | ✅ | Transactions page → full sortable ledger |
| Search and filtering | ✅ | Live search + All / Income / Expense toggles |
| Role-based UI — Viewer and Admin | ✅ | Topbar role switcher with demo PIN (`1234`) |
| Insights section | ✅ | Insights page → savings rate, health gauge, MoM comparison |
| Proper state management | ✅ | React Context API — transactions, filters, role |
| Responsive design | ✅ | Fluid layout across mobile, tablet, and desktop |
| Empty / no-data state handling | ✅ | Fallback UI rendered when filters return no results |
| Data persistence *(bonus)* | ✅ | localStorage — state persists across page refreshes |
| Animations and transitions *(bonus)* | ✅ | Anime.js entrance animations + CSS hover transitions |
| CRUD operations *(bonus)* | ✅ | Owner mode — Add, Edit, Delete transactions |
| CSV export *(bonus)* | ✅ | Export current filtered ledger as `.csv` |

---

## Features

### Dashboard
The main landing view gives users an at-a-glance picture of their finances.

- **Summary Cards** — Total Balance, Total Income, and Total Expenses are derived live from the transaction dataset.
- **Balance Trend Chart** — A line chart (Recharts) plots the cumulative financial trajectory across time.
- **Spending Breakdown Chart** — An interactive donut chart (Chart.js) shows the proportional share of each spending category.

### Transactions Ledger
A full-featured data table for exploring individual transactions.

- Date, Amount, Category, and Type columns with color-coded category pills.
- **Live search** — filters across transaction descriptions and categories instantly.
- **Type filter toggles** — switch between All, Income, and Expense views with one click.
- **CRUD in Owner mode** — create new entries, edit existing ones, or delete them.
- **CSV export** — downloads the currently filtered ledger as a `.csv` file.

### Role-Based Interface
The UI adapts based on the active role, simulating a real access-control model.

- Toggle between **Viewer** and **Owner** from the Topbar.
- **Owner mode** requires a demo PIN (`1234`) to activate — simulating a basic access gate.
- In **Viewer mode**, all write actions (Add, Edit, Delete, Export) are completely hidden — not just disabled.
- In **Owner mode**, the full suite of management controls becomes available.

### Insights & Analytics
A dedicated insights view surfaces patterns from the transaction data.

- **Savings Rate** — calculates the percentage of income retained after expenses.
- **Financial Health Gauge** — a visual indicator of overall financial standing.
- **Highest Spending Category** — automatically detected from the current dataset.
- **Month-over-Month Comparison** — delta between the two most recent months.
- **Category Progress Bars** — proportional breakdown of spending per category.
- **Contextual Observations** — pattern-based notes derived from the data.

### State Management
- A single `TransactionContext` (React Context API) holds all shared state: transactions, active filters, and current role.
- Eliminates prop-drilling — every page and component reads from context directly.
- Full state tree is synced to `localStorage` and rehydrated on load, so data survives refreshes.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 19 with Vite |
| Styling | Tailwind CSS v4 |
| Data Visualization | Recharts, Chart.js |
| Animations | Anime.js, CSS Transitions |
| Icons | Lucide React |
| State Management | React Context API |
| Persistence | Browser localStorage |
| Fonts | Syne, Cabinet Grotesk, DM Mono |

---

## Getting Started

### Prerequisites
- Node.js v18 or above
- npm or yarn

### Local Setup

```bash
# Clone the repository
git clone https://github.com/aishwary-vansh/ledgerX.git
cd ledgerX

# Install dependencies
npm install
npm install -D @tailwindcss/vite

# Start the development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
# Output is generated in the /dist folder
```

---

## Project Structure

```
ledgerX/
├── src/
│   ├── components/       # Reusable UI elements — cards, charts, modals, layout
│   ├── contexts/         # TransactionContext — global state and business logic
│   ├── pages/            # Route-level views — Dashboard, Transactions, Insights
│   ├── utils/            # Mock data, formatters, and helper functions
│   ├── App.jsx           # Root component, routing, and layout shell
│   ├── main.jsx          # Application entry point
│   └── index.css         # Tailwind v4 directives and CSS custom properties
├── public/               # Static assets
├── index.html            # HTML shell
├── vite.config.js        # Vite and Tailwind plugin configuration
└── package.json          # Dependency manifest and scripts
```

---

## Design Decisions

**Visual language —** LedgerX uses a glassmorphism aesthetic with frosted-glass card surfaces, layered depth, and vibrant accent orbs. The goal was to feel premium without being cluttered.

**Typography system —** Three typefaces are used with intention: Syne for headings (assertive, geometric), Cabinet Grotesk for body text (readable, modern), and DM Mono for numerical values (monospaced alignment for financial figures).

**Color-coded categories —** Every spending category has a consistent color identity applied uniformly across charts, table pills, and progress bars. Users can orient themselves visually without reading labels.

**Role-aware layout —** Viewer mode is not just about hiding a button. The absence of edit affordances changes the entire feel of the interface to read-only — a deliberate UX decision rather than a simple conditional render.

**Context over Redux —** Given the scope of this application, React Context API was the right choice. It avoids unnecessary dependency overhead while keeping state centralized and predictable.

---

## Assumptions

- All data is mock and static. There is no backend, database, or external API.
- Role switching is a frontend simulation. The demo PIN (`1234`) is not real authentication.
- "Month-over-Month" comparison uses the two most recent months present in the mock dataset.
- The application is scoped for a single personal user — multi-user or session handling was intentionally out of scope.

---

## Potential Improvements

Given more time or a production context, the following would be valuable additions:

- Unit and integration tests using Vitest and React Testing Library
- Mock API layer using MSW (Mock Service Worker) for more realistic async data flows
- Date range picker for advanced transaction filtering
- Accessible color contrast audit and ARIA label improvements for screen readers

---

*Built by **Aishwary Vansh** *