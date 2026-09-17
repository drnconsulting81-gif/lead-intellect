# LeadIntellect &mdash; AI B2B Sales Intelligence Platform

LeadIntellect is an AI-powered B2B prospecting and sales intelligence platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**.

---

## Features

* **AI Prospecting & ICP Scoring (0-100)**: Translates natural language buyer prompts into structured searches, scores accounts across Tier 1, 2, and 3, and identifies verified decision-makers.
* **Interactive AI Chatbot**: Floating assistant answering visitor queries about ICP scoring, enrichment, data compliance, and trial onboarding.
* **Lead Conversion Funnels**:
  * **Book a Demo (`/book-demo`)**: Comprehensive scheduling form with real-time validation and confirmation.
  * **14-Day Free Trial (`/start-trial`)**: Instant self-serve trial activation with lead qualification fields.
  * **Contact Us (`/contact`)**: Dedicated inquiry form and company location in India.
* **Resources Hub**:
  * **Blogs & Insights (`/blog`)**: Articles on ICP scoring, prospecting playbooks, and outbound strategy.
  * **Video Tutorials (`/tutorials`)**: Interactive video guides and onboarding checklists.
* **Back-End & Production Database**:
  * **Smart Dual-Mode Storage**: Connects to **MongoDB Atlas** when `MONGODB_URI` is present, with seamless local JSON fallback (`data/db.json`).
  * **CRM / Slack Webhook Sync**: Dispatches real-time JSON payloads to Slack, HubSpot, Zapier, or Make.
* **Admin Management Portal (`/admin`)**:
  * Live KPI metric cards for total leads, demos, trials, and inquiries.
  * Interactive lead tables with real-time search, status pipeline tracking (`New`, `Contacted`, `Qualified`, `Closed`), and 1-click CSV spreadsheet export.
  * Live MongoDB connection diagnostics and interactive webhook tester.

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/<your-username>/leadintellect-app.git
cd leadintellect-app
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Populate your `.env.local`:

```env
# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/leadintellect?retryWrites=true&w=majority"

# Optional: Slack / HubSpot CRM Webhook URL
CRM_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Notification Target Email
NOTIFICATION_EMAIL="sales@leadintellect.ai"
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Visit the Admin Portal at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Production Build

```bash
npm run build
npm run start
```

---

## Deployment to Vercel & Custom Domain (GoDaddy)

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Environment Variables** in Vercel, add `MONGODB_URI`.
4. Add your custom domain in Vercel Settings &rarr; Domains.
5. In your GoDaddy DNS settings, add the `A` record (`@` &rarr; `76.76.21.21`) and `CNAME` record (`www` &rarr; `cname.vercel-dns.com`).
