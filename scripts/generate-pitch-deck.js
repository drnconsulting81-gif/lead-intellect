const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createDeck() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'LeadIntellect Core Team';
  pptx.company = 'LeadIntellect AI';
  pptx.title = 'LeadIntellect - Seed Investor Pitch Deck';

  // Define brand colors
  const BG_NAVY = '0B1220';
  const CARD_BG = '14233C';
  const LIGHT_BG = 'F8FAFC';
  const TEAL_ACCENT = '14B8A6';
  const TEAL_DARK = '0F766E';
  const YELLOW_ACCENT = 'E2F300';
  const TEXT_WHITE = 'FFFFFF';
  const TEXT_MUTED = '94A3B8';
  const TEXT_DARK = '0F172A';
  const BORDER_COLOR = '1E293B';

  // -------------------------------------------------------------
  // SLIDE 1: COVER
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    // Brand tag
    slide.addText('LEADINTELLECT', {
      x: 0.8, y: 0.8, w: 5, h: 0.4,
      fontSize: 16, fontFace: 'Arial', color: TEAL_ACCENT, bold: true, letterSpacing: 3
    });

    // Main Title
    slide.addText('The All-in-One Autonomous\nB2B Revenue Operating System.', {
      x: 0.8, y: 1.5, w: 10.5, h: 1.8,
      fontSize: 34, fontFace: 'Arial', color: TEXT_WHITE, bold: true, lineSpacingMultiple: 1.15
    });

    // Subtitle
    slide.addText('Eliminating Sales Tech-Stack Bloat: Waterfall-Enriched Intent Database + Built-in Deal CRM + Multi-Channel AI Playbooks.', {
      x: 0.8, y: 3.5, w: 10.5, h: 0.8,
      fontSize: 15, fontFace: 'Arial', color: TEXT_MUTED
    });

    // Highlights Card 1 (The Ask)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 4.6, w: 4.8, h: 1.6,
      fill: { color: CARD_BG }, line: { color: TEAL_ACCENT, width: 1.5 }
    });
    slide.addText('INVESTOR SEED ASK', {
      x: 1.1, y: 4.8, w: 4.2, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('₹50 Lakh Initial Seed Round', {
      x: 1.1, y: 5.15, w: 4.2, h: 0.5,
      fontSize: 22, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
    slide.addText('6-Month Milestone Acceleration • Founder-Led • Live Working Platform', {
      x: 1.1, y: 5.7, w: 4.2, h: 0.35,
      fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
    });

    // Highlights Card 2 (Unfair Advantage)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.0, y: 4.6, w: 6.5, h: 1.6,
      fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
    });
    slide.addText('FOUNDER-MARKET FIT & DOMAIN ADVANTAGE', {
      x: 6.3, y: 4.8, w: 5.9, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
    });
    slide.addText('15+ Years Enterprise B2B Sales & GTM Research', {
      x: 6.3, y: 5.15, w: 5.9, h: 0.5,
      fontSize: 18, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
    slide.addText('Solving real buyer friction with 11,200+ pre-verified live records & proprietary context framework', {
      x: 6.3, y: 5.7, w: 5.9, h: 0.35,
      fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
    });

    // Footer
    slide.addText('CONFIDENTIAL • INVESTOR PRESENTATION 2026 • LEADINTELLECT.AI', {
      x: 0.8, y: 6.8, w: 10, h: 0.3,
      fontSize: 9, fontFace: 'Arial', color: TEXT_MUTED
    });
  }

  // -------------------------------------------------------------
  // SLIDE 2: THE PROBLEM
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('01 / THE BURNING PROBLEM', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('B2B Sales Teams Are Drowning in 4 Subscriptions & Stale Data', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
    slide.addText('The average B2B sales team spends $1,200 – $2,500/month across a fragmented stack where 70% of leads leak and cold email reply rates have fallen below 0.5%.', {
      x: 0.8, y: 1.7, w: 11.5, h: 0.5,
      fontSize: 13, fontFace: 'Arial', color: TEXT_MUTED
    });

    const problems = [
      {
        num: '01',
        title: 'Data Decay & Domain Burn',
        tool: 'Apollo / ZoomInfo ($99–$500/mo)',
        desc: '30% of B2B data decays annually. Generic scraped lists lead to 15%+ bounce rates, spam traps, and permanent domain blacklisting by Google & Yahoo.'
      },
      {
        num: '02',
        title: 'Context-Deficient Outreach',
        tool: 'Instantly / Smartlead ($97/mo)',
        desc: 'SDRs blast generic templates that prospects ignore. Zero real intent signals, zero contextual synthesis (Who, Why Now, What Pain Point).'
      },
      {
        num: '03',
        title: 'CRM Disconnect & Admin Drag',
        tool: 'HubSpot / Pipedrive ($50–$300/mo)',
        desc: 'Reps waste 65% of their working hours manually importing CSVs, copying notes, and managing stages instead of closing deals.'
      },
      {
        num: '04',
        title: 'Fragile Integration Glue',
        tool: 'Zapier / Make ($50–$100/mo)',
        desc: 'Data silos break constantly between scrapers, warmups, and CRMs. Leads fall through cracks and deals are lost before they are even contacted.'
      }
    ];

    problems.forEach((p, i) => {
      const colW = 2.8;
      const xPos = 0.8 + i * 3.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 2.5, w: colW, h: 3.5,
        fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(p.num, {
        x: xPos + 0.2, y: 2.7, w: 2.4, h: 0.4,
        fontSize: 16, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
      });
      slide.addText(p.title, {
        x: xPos + 0.2, y: 3.1, w: 2.4, h: 0.5,
        fontSize: 13, fontFace: 'Arial', color: TEXT_WHITE, bold: true
      });
      slide.addText(p.tool, {
        x: xPos + 0.2, y: 3.6, w: 2.4, h: 0.4,
        fontSize: 10, fontFace: 'Arial', color: YELLOW_ACCENT, italic: true
      });
      slide.addText(p.desc, {
        x: xPos + 0.2, y: 4.1, w: 2.4, h: 1.7,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addText('FOUNDER INSIGHT: "Companies don\'t need another bulk CSV scraper. They need a single engine that finds verified buyers, writes the pitch, and manages the deal pipeline."', {
      x: 0.8, y: 6.3, w: 11.5, h: 0.6,
      fontSize: 11.5, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 3: THE SOLUTION: LEADINTELLECT
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('02 / THE UNIFIED SOLUTION', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('One Autonomous Platform. Zero Stack Bloat.', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
    slide.addText('LeadIntellect replaces 4 separate tools by unifying Discovery, Waterfall Verification, 1:1 Multi-Channel Playbooks, and Built-in Visual CRM in a single subscription.', {
      x: 0.8, y: 1.7, w: 11.5, h: 0.5,
      fontSize: 13, fontFace: 'Arial', color: TEXT_MUTED
    });

    const pillars = [
      {
        title: '1. Waterfall-Enriched Database',
        sub: 'Discovery & Accuracy',
        desc: 'Access to 11,000+ pre-verified B2B decision-makers. Multi-provider waterfall (Apollo + Hunter + Prospeo) with real-time SMTP handshakes that guarantee 98%+ deliverability.'
      },
      {
        title: '2. 1-Click Built-in Visual CRM',
        sub: 'Deal Pipeline Management',
        desc: 'No need to buy HubSpot or Pipedrive. Push qualified leads straight into an interactive Kanban board with deal value, priority tags, follow-up logs, and custom stages.'
      },
      {
        title: '3. Multi-Channel AI Playbook Studio',
        sub: 'Engagement & Conversion',
        desc: 'Transforms raw contact data into 1:1 Cold Emails, tailored LinkedIn connection requests, high-converting WhatsApp pitches, and phone call objection battlecards in 10 seconds.'
      }
    ];

    pillars.forEach((col, i) => {
      const colW = 3.8;
      const xPos = 0.8 + i * 4.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 2.5, w: colW, h: 3.5,
        fill: { color: CARD_BG }, line: { color: i === 1 ? TEAL_ACCENT : BORDER_COLOR, width: 1.5 }
      });
      slide.addText(col.sub.toUpperCase(), {
        x: xPos + 0.3, y: 2.8, w: 3.2, h: 0.3,
        fontSize: 10, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
      });
      slide.addText(col.title, {
        x: xPos + 0.3, y: 3.15, w: 3.2, h: 0.6,
        fontSize: 15, fontFace: 'Arial', color: TEXT_WHITE, bold: true
      });
      slide.addText(col.desc, {
        x: xPos + 0.3, y: 3.9, w: 3.2, h: 1.8,
        fontSize: 11, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 6.2, w: 11.5, h: 0.7,
      fill: { color: '0F766E' }
    });
    slide.addText('RESULT: Saves B2B teams $500–$1,500/month, eliminates lead leakage, and increases meeting booking rate by 3.2×.', {
      x: 1.0, y: 6.35, w: 11.1, h: 0.4,
      fontSize: 12, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 4: OUR 4 CORE USPs (THE MOAT)
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('03 / OUR COMPETITIVE MOAT', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Why LeadIntellect Wins: 4 Defensible Pillars', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const usps = [
      {
        tag: 'USP #1',
        title: 'Zero Deliverability Risk',
        detail: 'Multi-Provider Waterfall + SMTP Gateway',
        points: [
          'Never relies on a single stale scraper.',
          'Cascades from internal cache ➔ Apollo ➔ Hunter/Prospeo.',
          'Real-time ZeroBounce/NeverBounce SMTP ping filters out spam traps and catch-alls before credits are spent.'
        ]
      },
      {
        tag: 'USP #2',
        title: 'Built-in Visual Deal CRM',
        detail: 'Eliminates Post-Scrape Churn',
        points: [
          'Traditional scrapers are churned in 30 days after CSV download.',
          'LeadIntellect embeds the entire sales pipeline: Kanban stages, revenue forecast, and deal tracking.',
          'Sticky daily active workflow prevents cancellations.'
        ]
      },
      {
        tag: 'USP #3',
        title: 'True Multi-Channel Playbooks',
        detail: 'Email + WhatsApp + LinkedIn + Call Scripts',
        points: [
          'Cold email alone is dying in APAC & India.',
          'Generates tailored WhatsApp pitches, phone scripts, and LinkedIn hooks calibrated to seniority.',
          'Closes deals across all modern communication channels.'
        ]
      },
      {
        tag: 'USP #4',
        title: 'Dual Currency & Pricing Arbitrage',
        detail: 'Native INR (₹) + GST Invoicing + Global USD ($)',
        points: [
          'Indian businesses get transparent ₹ pricing (₹2,499–₹12,999/mo) with instant UPI and 18% GST Input Credit.',
          'Global customers get frictionless USD checkout ($49–$149/mo).',
          'Avoids 3.5% forex fees and payment failure friction.'
        ]
      }
    ];

    usps.forEach((u, i) => {
      const colW = 5.7;
      const rowH = 2.1;
      const xPos = i % 2 === 0 ? 0.8 : 6.8;
      const yPos = i < 2 ? 1.8 : 4.2;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: yPos, w: colW, h: rowH,
        fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(u.tag, {
        x: xPos + 0.25, y: yPos + 0.15, w: 2, h: 0.3,
        fontSize: 10, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
      });
      slide.addText(u.title, {
        x: xPos + 0.25, y: yPos + 0.45, w: 5.2, h: 0.35,
        fontSize: 14, fontFace: 'Arial', color: TEXT_WHITE, bold: true
      });
      slide.addText(u.detail, {
        x: xPos + 0.25, y: yPos + 0.78, w: 5.2, h: 0.25,
        fontSize: 9.5, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
      });

      const bullets = u.points.map(p => `• ${p}`).join('\n');
      slide.addText(bullets, {
        x: xPos + 0.25, y: yPos + 1.05, w: 5.2, h: 0.95,
        fontSize: 9.5, fontFace: 'Arial', color: TEXT_MUTED, lineSpacingMultiple: 1.1
      });
    });
  }

  // -------------------------------------------------------------
  // SLIDE 5: COMPETITIVE MATRIX
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('04 / COMPETITIVE LANDSCAPE', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('How LeadIntellect Outpositions Existing Players', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    // Comparison Table
    const headers = [
      { text: 'Capability', options: { fill: '1E293B', color: TEXT_WHITE, bold: true, fontSize: 10 } },
      { text: 'LeadIntellect', options: { fill: '0F766E', color: YELLOW_ACCENT, bold: true, fontSize: 10 } },
      { text: 'Apollo.io', options: { fill: '1E293B', color: TEXT_WHITE, bold: true, fontSize: 10 } },
      { text: 'ZoomInfo', options: { fill: '1E293B', color: TEXT_WHITE, bold: true, fontSize: 10 } },
      { text: 'Clay.com', options: { fill: '1E293B', color: TEXT_WHITE, bold: true, fontSize: 10 } },
      { text: 'Nexshift.ai', options: { fill: '1E293B', color: TEXT_WHITE, bold: true, fontSize: 10 } },
    ];

    const rows = [
      [
        { text: 'Core Focus' },
        { text: 'Autonomous All-In-One Revenue Engine', options: { bold: true, color: YELLOW_ACCENT } },
        { text: 'Commodity Contact Scraper' },
        { text: 'Enterprise Directory Lock-in' },
        { text: 'Complex Spreadsheet Workflows' },
        { text: 'Post-Lead Conversational Bots' },
      ],
      [
        { text: 'Built-in Deal CRM' },
        { text: '✅ Visual Kanban Board Included', options: { bold: true, color: TEAL_ACCENT } },
        { text: '❌ No (Requires HubSpot/Salesforce)' },
        { text: '❌ No (Requires Enterprise CRM)' },
        { text: '❌ No CRM (Data table only)' },
        { text: '⚠️ Basic activity log' },
      ],
      [
        { text: 'Data Accuracy & Deliverability' },
        { text: '✅ Waterfall + Real-Time SMTP Ping', options: { bold: true, color: TEAL_ACCENT } },
        { text: '⚠️ Single-source; 15%+ bounce rates' },
        { text: '✅ High for US, weak for APAC' },
        { text: '✅ Multi-vendor (complex setup)' },
        { text: '❌ No contact data provided' },
      ],
      [
        { text: 'Multi-Channel AI Outreach' },
        { text: '✅ Email + WhatsApp + LinkedIn + Call', options: { bold: true, color: TEAL_ACCENT } },
        { text: '⚠️ Cold email sequences only' },
        { text: '❌ Dial/Email plugin only' },
        { text: '⚠️ Text prompts only' },
        { text: '✅ Voice & WhatsApp bots' },
      ],
      [
        { text: 'Indian Pricing & GST' },
        { text: '✅ ₹2,499–₹12,999/mo + GST Input', options: { bold: true, color: TEAL_ACCENT } },
        { text: '❌ Expensive USD only, no GST' },
        { text: '❌ $15,000/yr minimum contract' },
        { text: '❌ $149–$800/mo USD' },
        { text: '⚠️ Enterprise custom quote' },
      ],
      [
        { text: 'Target Market' },
        { text: 'SMBs, Mid-Market & Growth Teams', options: { bold: true, color: TEXT_WHITE } },
        { text: 'High-volume blast reps' },
        { text: 'Fortune 500 US Enterprise' },
        { text: 'Technical RevOps Engineers' },
        { text: 'Contact Centers & Support' },
      ],
    ];

    slide.addTable([headers, ...rows], {
      x: 0.8, y: 1.8, w: 11.5,
      colW: [2.0, 2.7, 1.8, 1.8, 1.6, 1.6],
      fontSize: 9, fontFace: 'Arial',
      color: TEXT_WHITE, fill: CARD_BG,
      border: { pt: 0.5, color: BORDER_COLOR },
      align: 'center', valign: 'middle'
    });

    slide.addText('KEY TAKEAWAY: Apollo sells commoditized data; Clay is too complicated; Nexshift only orchestrates conversations. LeadIntellect captures the entire outbound workflow for SMBs and mid-market teams.', {
      x: 0.8, y: 6.3, w: 11.5, h: 0.4,
      fontSize: 10.5, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 6: PRODUCT IN ACTION & TRACTION
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('05 / LIVE TRACTION & ARCHITECTURE', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Not an Idea — A Deployed, Production-Ready SaaS', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const metrics = [
      { stat: '11,222+', label: 'Active Verified Contacts', sub: 'C-Suite, VPs, Directors in US, India & Global' },
      { stat: '<50ms', label: 'Query Performance', sub: 'In-memory cached pagination & facet indexing' },
      { stat: '98%+', label: 'Deliverability Guarantee', sub: 'Real-time SMTP handshake & catch-all prevention' },
      { stat: '1-Click', label: 'CRM Deal Push', sub: 'Zero-friction sync from database to Kanban pipeline' }
    ];

    metrics.forEach((m, i) => {
      const colW = 2.7;
      const xPos = 0.8 + i * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.8, w: colW, h: 1.5,
        fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(m.stat, {
        x: xPos + 0.1, y: 1.95, w: colW - 0.2, h: 0.5,
        fontSize: 24, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true, align: 'center'
      });
      slide.addText(m.label, {
        x: xPos + 0.1, y: 2.45, w: colW - 0.2, h: 0.3,
        fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, bold: true, align: 'center'
      });
      slide.addText(m.sub, {
        x: xPos + 0.1, y: 2.75, w: colW - 0.2, h: 0.4,
        fontSize: 8.5, fontFace: 'Arial', color: TEXT_MUTED, align: 'center'
      });
    });

    // Technical capability block
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 3.6, w: 11.5, h: 2.8,
      fill: { color: CARD_BG }, line: { color: TEAL_ACCENT, width: 1 }
    });
    slide.addText('CORE PRODUCT CAPABILITIES DEPLOYED & TESTED', {
      x: 1.1, y: 3.8, w: 10, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });

    const caps = [
      '• Proprietary 5-Question AI Synthesis: Translates buyer profile into Who, Why, Pain, Fit, and Next Action.',
      '• Built-in Deal Pipeline (Kanban): 5 stage tracking (Identified ➔ Contacted ➔ Demo ➔ Proposal ➔ Won).',
      '• Multi-Channel Generator: Instant cold email, LinkedIn hook, WhatsApp opener, and objection call script.',
      '• Waterfall Enrichment Engine: Automated failover across data providers to resolve missing mobile & email.',
      '• Dynamic Regional Pricing: Auto-detects visitor country, supports Razorpay/UPI (₹) & Stripe ($).'
    ];

    slide.addText(caps.join('\n\n'), {
      x: 1.1, y: 4.2, w: 10.8, h: 2.0,
      fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, lineSpacingMultiple: 1.2
    });
  }

  // -------------------------------------------------------------
  // SLIDE 7: BUSINESS MODEL & MONETIZATION
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('06 / BUSINESS MODEL', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Predictable SaaS Recurring Revenue + Usage Expansion', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const tiers = [
      {
        name: 'Starter Plan',
        priceINR: '₹0',
        priceUSD: '$0',
        cadence: 'Free Forever',
        desc: 'Product-led acquisition wedge: 100 verified credits, basic ICP search, 1 active CRM pipeline.',
        border: BORDER_COLOR
      },
      {
        name: 'Growth Outbound',
        priceINR: '₹2,499 / mo',
        priceUSD: '$49 / mo',
        cadence: 'Billed Annually at ₹1,999/mo',
        desc: 'Small SDR teams: 30,000 credits/yr, verified work emails, full visual CRM pipeline, email warmup.',
        border: BORDER_COLOR
      },
      {
        name: 'Multi-Channel Scale (Flagship)',
        priceINR: '₹5,499 / mo',
        priceUSD: '$89 / mo',
        cadence: 'Billed Annually at ₹4,499/mo',
        desc: 'High-growth B2B teams: 60,000 credits/yr, direct mobile & WhatsApp verified numbers, full CRM, 1:1 AI Studio.',
        border: TEAL_ACCENT,
        featured: true
      },
      {
        name: 'Enterprise Engine',
        priceINR: '₹12,999 / mo',
        priceUSD: '$149 / mo',
        cadence: 'Billed Annually (3 seats included)',
        desc: 'Enterprises & Agencies: 120,000 credits/yr, custom CRM workflows, waterfall enrichment API, dedicated SLA.',
        border: BORDER_COLOR
      }
    ];

    tiers.forEach((t, i) => {
      const colW = 2.75;
      const xPos = 0.8 + i * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.8, w: colW, h: 4.2,
        fill: { color: CARD_BG }, line: { color: t.border, width: t.featured ? 2 : 1 }
      });
      if (t.featured) {
        slide.addText('★ HIGHEST ARPU & VALUE', {
          x: xPos + 0.1, y: 2.0, w: colW - 0.2, h: 0.3,
          fontSize: 9, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true, align: 'center'
        });
      }
      slide.addText(t.name, {
        x: xPos + 0.1, y: t.featured ? 2.3 : 2.1, w: colW - 0.2, h: 0.4,
        fontSize: 14, fontFace: 'Arial', color: TEXT_WHITE, bold: true, align: 'center'
      });
      slide.addText(t.priceINR, {
        x: xPos + 0.1, y: 2.7, w: colW - 0.2, h: 0.4,
        fontSize: 18, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true, align: 'center'
      });
      slide.addText(`Global: ${t.priceUSD}`, {
        x: xPos + 0.1, y: 3.1, w: colW - 0.2, h: 0.25,
        fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true, align: 'center'
      });
      slide.addText(t.cadence, {
        x: xPos + 0.1, y: 3.35, w: colW - 0.2, h: 0.3,
        fontSize: 9, fontFace: 'Arial', color: TEXT_MUTED, align: 'center'
      });
      slide.addText(t.desc, {
        x: xPos + 0.2, y: 3.8, w: colW - 0.4, h: 1.9,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addText('EXPANSION REVENUE LEVERS: Additional credit bundles, custom enterprise CRM workflow setups (₹25k–₹50k one-time), and team seat expansion.', {
      x: 0.8, y: 6.2, w: 11.5, h: 0.5,
      fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 8: MARKET OPPORTUNITY & TAM / SAM / SOM
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('07 / MARKET OPPORTUNITY', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Massive Market Headroom with High-Conviction First Wedge', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const markets = [
      {
        tag: 'TAM (TOTAL ADDRESSABLE)',
        title: '₹1.38 Lakh Crore',
        sub: 'India SaaS & Tech Services Ecosystem',
        growth: 'Growing at 16.9% CAGR to ₹4.96 Lakh Cr by 2033 (Grand View Research). Massive explosion of B2B outbound teams.'
      },
      {
        tag: 'SAM (SERVICEABLE ADDRESSABLE)',
        title: '₹7,055 Crore',
        sub: 'Sales Intelligence & Prospecting Segment',
        growth: 'Expanding to ₹10,064 Cr by 2032. B2B firms aggressively replacing pure manual research with automated intelligence.'
      },
      {
        tag: 'SOM (SERVICEABLE OBTAINABLE)',
        title: '₹70.6 Crore ARR',
        sub: '1% of Immediate Addressable Category',
        growth: 'Initial focused beachhead: Healthcare/FM vendors, B2B SaaS, IT/Managed Services, and high-ticket consulting agencies.'
      }
    ];

    markets.forEach((m, i) => {
      const colW = 3.8;
      const xPos = 0.8 + i * 4.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.8, w: colW, h: 3.3,
        fill: { color: CARD_BG }, line: { color: i === 2 ? YELLOW_ACCENT : BORDER_COLOR, width: 1.5 }
      });
      slide.addText(m.tag, {
        x: xPos + 0.25, y: 2.0, w: colW - 0.5, h: 0.3,
        fontSize: 10, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
      });
      slide.addText(m.title, {
        x: xPos + 0.25, y: 2.35, w: colW - 0.5, h: 0.5,
        fontSize: 24, fontFace: 'Arial', color: TEXT_WHITE, bold: true
      });
      slide.addText(m.sub, {
        x: xPos + 0.25, y: 2.9, w: colW - 0.5, h: 0.35,
        fontSize: 11, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
      });
      slide.addText(m.growth, {
        x: xPos + 0.25, y: 3.35, w: colW - 0.5, h: 1.5,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 5.4, w: 11.5, h: 1.4,
      fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
    });
    slide.addText('EXPANSION ROADMAP: Beachhead Wedge (Healthcare & FM Suppliers) ➔ Indian B2B SaaS & IT Agencies ➔ Global Mid-Market Outbound Teams.', {
      x: 1.1, y: 5.65, w: 10.8, h: 0.4,
      fontSize: 12, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Why this sequence works: Healthcare & Facilities vendors have the highest pain and lowest penetration by US SaaS tools, providing an uncontested early cash flow wedge before scaling to global SaaS.', {
      x: 1.1, y: 6.05, w: 10.8, h: 0.6,
      fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED
    });
  }

  // -------------------------------------------------------------
  // SLIDE 9: LEADERSHIP TEAM
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('08 / LEADERSHIP & UNFAIR ADVANTAGE', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Experienced Operators with 15+ Years Domain Rigor', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const team = [
      {
        name: 'PUSHPALATHA K',
        role: 'Owner & Chief Executive Officer',
        desc: 'Oversees strategic company vision, corporate governance, financial stewardship, and executive operational execution across all business entities.'
      },
      {
        name: 'JHANSI R',
        role: 'Co-Founder & Head of Sales & Strategy',
        desc: 'Drives commercial strategy, enterprise customer acquisition, channel partner development, and client expansion across target Indian and APAC markets.'
      },
      {
        name: 'RAGHUNANDAN D',
        role: 'Chief Marketing Officer & Strategic Growth',
        desc: '15+ years experience spanning B2B sales, marketing research, and revenue operations. Over 10 years of focused research solving B2B outbound friction firsthand.'
      }
    ];

    team.forEach((m, i) => {
      const colW = 3.8;
      const xPos = 0.8 + i * 4.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.9, w: colW, h: 3.5,
        fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(m.name, {
        x: xPos + 0.3, y: 2.2, w: colW - 0.6, h: 0.4,
        fontSize: 16, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
      });
      slide.addText(m.role, {
        x: xPos + 0.3, y: 2.65, w: colW - 0.6, h: 0.45,
        fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
      });
      slide.addText(m.desc, {
        x: xPos + 0.3, y: 3.2, w: colW - 0.6, h: 1.8,
        fontSize: 10.5, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 5.7, w: 11.5, h: 1.0,
      fill: { color: '14233C' }, line: { color: TEAL_ACCENT, width: 1 }
    });
    slide.addText('FOUNDER-MARKET FIT: We are not novices building theoretical software. We are enterprise sales practitioners who have generated pipeline, closed enterprise contracts, and lived every single data & deliverability pain point we solve.', {
      x: 1.0, y: 5.85, w: 11.1, h: 0.7,
      fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 10: THE ASK & 6-MONTH USE OF FUNDS
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('09 / THE INVESTMENT ASK', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('₹50 Lakh Seed Round: 6-Month Execution Program', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    const allocations = [
      {
        pct: '35%',
        amt: '₹17.5 Lakh',
        area: 'Product & AI Engineering',
        items: 'Deepen multi-provider waterfall connectors (Apollo, Hunter, Prospeo), Twilio direct dial phone verification, and LLM playbook latency.'
      },
      {
        pct: '30%',
        amt: '₹15.0 Lakh',
        area: 'GTM & Customer Acquisition',
        items: 'Acquire initial 100 paying B2B accounts across India & overseas via targeted outbound, agency partnerships, and webinars.'
      },
      {
        pct: '20%',
        amt: '₹10.0 Lakh',
        area: 'CRM Customization & Enterprise Sync',
        items: 'Develop bi-directional sync (HubSpot, Salesforce webhooks) and customizable Kanban schemas for enterprise contracts.'
      },
      {
        pct: '15%',
        amt: '₹7.5 Lakh',
        area: 'Infrastructure, Security & Buffer',
        items: 'Cloud hosting, enterprise security controls, ZeroBounce API reserve, GST compliance, and working capital reserve.'
      }
    ];

    allocations.forEach((a, i) => {
      const colW = 2.75;
      const xPos = 0.8 + i * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.8, w: colW, h: 4.1,
        fill: { color: CARD_BG }, line: { color: BORDER_COLOR, width: 1 }
      });
      slide.addText(a.pct, {
        x: xPos + 0.1, y: 2.0, w: colW - 0.2, h: 0.6,
        fontSize: 28, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true, align: 'center'
      });
      slide.addText(a.amt, {
        x: xPos + 0.1, y: 2.6, w: colW - 0.2, h: 0.3,
        fontSize: 13, fontFace: 'Arial', color: TEAL_ACCENT, bold: true, align: 'center'
      });
      slide.addText(a.area, {
        x: xPos + 0.1, y: 2.95, w: colW - 0.2, h: 0.5,
        fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, bold: true, align: 'center'
      });
      slide.addText(a.items, {
        x: xPos + 0.2, y: 3.55, w: colW - 0.4, h: 2.1,
        fontSize: 9.5, fontFace: 'Arial', color: TEXT_MUTED
      });
    });

    slide.addText('FUNDING PRINCIPLE: Capital efficiency. Every rupee is deployed to hit clear commercial proof points (paying customers, ARR, low churn) before raising the next financing round.', {
      x: 0.8, y: 6.2, w: 11.5, h: 0.5,
      fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });
  }

  // -------------------------------------------------------------
  // SLIDE 11: 10X INVESTOR RETURN VISION & MILESTONES
  // -------------------------------------------------------------
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_NAVY };

    slide.addText('10 / THE OUTCOME', {
      x: 0.8, y: 0.6, w: 6, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: TEAL_ACCENT, bold: true
    });
    slide.addText('Clear Milestones to a 10× Investor Return', {
      x: 0.8, y: 0.95, w: 11.5, h: 0.7,
      fontSize: 26, fontFace: 'Arial', color: TEXT_WHITE, bold: true
    });

    // Milestone Cards
    const milestones = [
      {
        month: 'MONTH 1 – 2',
        title: 'Core Validation & Onboarding',
        pts: ['Complete payment gateway and self-serve onboarding.', 'Onboard first 25 paying pilot teams across SaaS and healthcare suppliers.', 'Achieve 98%+ data accuracy score with 0 bounce complaints.']
      },
      {
        month: 'MONTH 3 – 4',
        title: 'Channel Scale & CRM Depth',
        pts: ['Reach 60 paying customer accounts.', 'Deploy WhatsApp multi-channel AI pitch generator and direct mobile dialing.', 'Launch custom enterprise CRM schema service.']
      },
      {
        month: 'MONTH 5 – 6',
        title: 'Repeatability & Series A Readiness',
        pts: ['Surpass 100+ active paying B2B accounts.', 'Achieve ₹30L–₹40L Annualized Run-Rate (ARR) with <3% monthly logo churn.', 'Position for institutional Series A at a ₹30Cr–₹50Cr valuation.']
      }
    ];

    milestones.forEach((m, i) => {
      const colW = 3.8;
      const xPos = 0.8 + i * 4.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: xPos, y: 1.8, w: colW, h: 3.2,
        fill: { color: CARD_BG }, line: { color: i === 2 ? TEAL_ACCENT : BORDER_COLOR, width: 1.5 }
      });
      slide.addText(m.month, {
        x: xPos + 0.25, y: 2.0, w: colW - 0.5, h: 0.3,
        fontSize: 11, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
      });
      slide.addText(m.title, {
        x: xPos + 0.25, y: 2.35, w: colW - 0.5, h: 0.45,
        fontSize: 13, fontFace: 'Arial', color: TEXT_WHITE, bold: true
      });

      const bullets = m.pts.map(p => `• ${p}`).join('\n');
      slide.addText(bullets, {
        x: xPos + 0.25, y: 2.85, w: colW - 0.5, h: 1.9,
        fontSize: 10, fontFace: 'Arial', color: TEXT_MUTED, lineSpacingMultiple: 1.15
      });
    });

    // 10x scenario box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: 5.3, w: 11.5, h: 1.6,
      fill: { color: '0F766E' }
    });
    slide.addText('THE 10× INVESTOR VALUE CREATION FRAMEWORK', {
      x: 1.1, y: 5.45, w: 10.8, h: 0.3,
      fontSize: 11, fontFace: 'Arial', color: YELLOW_ACCENT, bold: true
    });
    slide.addText('₹50 Lakh seed capital targeting a ₹5 Crore gross investor stake value at Series A or strategic acquisition (assuming 10% equity stake at ~₹50Cr enterprise value). Supported by real ARR, high net revenue retention, defensible multi-provider waterfall technology, and uncontested Indian & global mid-market pricing.', {
      x: 1.1, y: 5.8, w: 10.8, h: 0.9,
      fontSize: 11, fontFace: 'Arial', color: TEXT_WHITE, lineSpacingMultiple: 1.2
    });
  }

  // Save the presentation
  const outPath1 = path.join('d:', 'lead-connnect', 'LeadIntellect_Investor_Pitch_Deck.pptx');
  const outPath2 = path.join(process.cwd(), 'public', 'LeadIntellect_Pitch_Deck.pptx');

  await pptx.writeFile({ fileName: outPath1 });
  console.log(`Saved primary PPTX to ${outPath1}`);

  try {
    fs.copyFileSync(outPath1, outPath2);
    console.log(`Copied PPTX to public web path: ${outPath2}`);
  } catch (e) {
    console.log('Public copy optional:', e.message);
  }
}

createDeck().catch(console.error);
