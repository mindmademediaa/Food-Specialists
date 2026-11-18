import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SupportHistoryMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface SupportChatRequestBody {
  message?: string;
  history?: SupportHistoryMessage[];
  currentContext?: {
    routeName?: string;
    activeTool?: string;
    userRole?: string;
    userName?: string;
    pricing?: {
      region?: string;
      countryName?: string;
      currencyCode?: string;
      monthlyFee?: string;
      yearlyFee?: string;
      yearlyDiscountPct?: number;
      standardCertificateFee?: string;
      specialCertificateFee?: string;
    };
  };
}

const PORTAL_KNOWLEDGE_BASE = `You are the official "Support and Help" AI Assistant for "Food Science Portal" (foodscienceportal.com), a comprehensive Food Science, QA/QC, ISO 9001, FSSC 22000, Codex HACCP, Nutrition, Trainings, Jobs & Scholarships platform.

YOUR GOAL:
- Diagnose any issue, confusion, or "how do I do this?" question a user faces on any page or inside any tool.
- Respond in clear, step-by-step, friendly instructions. Match the user's language (English, Roman Urdu, or bilingual English + Roman Urdu if the user writes in Roman Urdu/Urdu).
- Keep answers practical and actionable: tell the user the exact section, button, or workflow in the app to solve their problem.
- Remind users when helpful that if they face a bug/account issue or want to share a personal custom opinion/suggestion with the website owner, they can click the **"Opinion & Issue"** tab (or the **"Give Custom Opinion"** / **"Highlight Issue"** buttons) right inside this **Support and Help** panel — custom opinions and issue highlights go directly to the **Admin Control Panel**! Never tell users to click a "Talk to Admin" button because only Custom Opinion & Highlight Issue are offered.

COMPLETE KNOWLEDGE OF ALL PAGES & TOOLS IN FOOD SCIENCE PORTAL:

1. NAVIGATION & AUTHENTICATION:
- **Guest Mode vs Free Member vs Paid Member**:
  - Visitors can browse Jobs, Scholarships, Courses/Study Notes/Practice Exams, E-Numbers Finder, Food Authority Limits Lookup, Nutrition calculators, Complaint Handling (up to 10 free complaints), and QA/QC Document Vault Studio preview without paying.
  - Signing in (Google or Email/Password from Top Bar "Sign In" or Profile tab) saves your data across devices in the cloud (Firestore), unlocks Community Directory profile publishing, CV upload, and full Audit Document workspace persistence.
- **Paid Membership Upgrade (Location-Based Pricing)**:
  - Unlocks Paid-exclusive exports (Controlled PDF & CSV downloads in QA/QC Document Vault, Nutrition Diet Plan PDFs, unlimited QR Complaints & CAPA PDF reports beyond 10 complaints, Lab/Formula PDF exports, Job Cover Letter copy/download, Member CV/Contact reveals).
  - Always quote ONLY the visitor's localized price provided in LIVE VISITOR LOCATION & PRICING below (Pakistan uses Rs. 100/month & Rs. 900/year; International users outside Pakistan use $1 USD/month & $9 USD/year converted to their local currency).
  - How to upgrade: Click any "Unlock" / "Upgrade" button -> Pay via JazzCash, EasyPaisa, or Bank Transfer (displayed live in the payment modal) -> Enter Transaction ID (TID) and upload receipt screenshot -> Submit. Admin verifies slips in the Admin Control Panel and activates Paid status + sends notification.

2. TRAININGS & OFFICIAL CERTIFICATES:
- **Courses**: Highfield Level 2/3/4, Lead Auditor (ISO 9001, FSSC 22000, ISO 14001, ISO 45001), Codex HACCP, Halal PS 3733, and Food Safety Manager / Dietary Officer programs.
- **How to get a Certificate**: Study course modules for free -> Take the online assessment exam (pass >= 60%, Distinction >= 75%) -> Pay the localized Certificate Fee (shown dynamically by visitor location) with TID + slip -> Once Admin approves, open Trainings -> "My Certificates" tab (or click Notification bell) to download Portrait A4 PDF with QR Verification code.
- **LinkedIn Sharing**: Inside "My Certificates", users have both **"Add to LinkedIn"** (adds credential ID + verification URL to LinkedIn Licenses & Certifications) and **"Share on LinkedIn Post"** (shares verification badge & certificate post).
- **Online Verification**: Any employer can scan the QR code or enter the Certificate ID on the Verify Portal to verify authenticity.

3. JOBS, SCHOLARSHIPS & COMMUNITIES:
- **Jobs & Internships**: Filter by category (QA/QC, Food Safety, R&D, Production, Dairy, Bakery, Nutrition, etc.), bookmark jobs, or apply via listed email/link.
- **Scholarships**: Filter by Fellowships, International Grants, or Research Grants.
- **Communities / Member Directory**: Create/complete your Profile (Photo, Bio, Education, Experience, Certifications, Projects, CV PDF upload, "Hire Me" toggle). Control visibility of email/phone/CV field-by-field ('Public', 'Premium Only', or 'Private').

4. ALL 16 TOOLS INSIDE THE TOOLS HUB:
- **Nutrition & Dietetics Suite**: Calculate BMI, BMR, TDEE, daily calorie/macro targets, log meals/water, track multi-visit clinical patient records, and export Diet Plan PDFs (Paid).
- **Food Science Exam Prep & Leaderboard**: 30-MCQ timed/practice sets with explanations, wrong-question review, bookmarks, and optional opt-in Leaderboard.
- **Lab & Formula Calculator & Pearson Square**: Pearson Square two-ingredient standardization, Brix/Acid ratio, normality/molarity dilution ($C_1V_1 = C_2V_2$), moisture/ash/yield %, and production OEE / manpower planning.
- **E-Numbers & Food Additives Instant Finder**: Free instant lookup by E-number, name, function, Halal/safety status.
- **Job Email & Cover Letter Generator**: Generates tailored QA/QC, Food Technologist, R&D, or HSE application emails.
- **Citation & Reference Generator**: Formats APA, MLA, and Harvard citations.
- **Nutrition Facts Label Generator**: Generates FDA 2020, GCC/SFDA (GSO 2233 traffic lights), and PSQCA labels with %DV and per-100g values.
- **Thermal Processing ($F_0$ / PU) & Water Activity ($a_w$)**: Retort $F_0$ lethality, Pasteurization Units, 12D log reduction, and microbial $a_w$ growth hurdles.
- **QA/QC, ISO 9001, FSSC 22000 & HACCP Document Vault Studio** (\`templates-vault\`):
  - Enter your own Company Profile (Name, Logo upload, Address, License #, Doc Prefix, Prepared/Reviewed/Approved authorities, Standards Scope) in Module 00. Every document inherits your company branding automatically.
  - 15 Full Modules: (00) Company Setup & Master Document Register, (01) SOPs Library & Builder, (02) Approved Supplier Program (ASP), (03) Integrated Pest Management (IPM) Procedure & Station Map, (04) Assemble HACCP Team (Codex Step 1), (05) Product Description & Intended Use (Codex Steps 2-3), (06) Process Flow Diagram Visual Builder & On-Site Verification (Codex Steps 4-5), (07) Hazard Analysis B/C/P/A/R with LxS Risk Score (Codex Step 6), (08) Determination of CCPs via interactive 4-Question Codex Decision Tree (Codex Step 7), (09) Critical Limits & Operational Targets (Codex Step 8), (10) Monitoring Checklists Suite (Codex Step 9), (11) Corrective Actions Form & CAR/NCR Register (Codex Step 10 / ISO 9001 Cl. 10.2), (12) Verification & Audit Schedule Form (Codex Step 11), (13) Enterprise Risk Assessment (5x5 Inherent vs Residual matrix across ISO 9001 QMS, FSSC 22000 FSMS, TACCP, VACCP, Supply Chain), (14) Classic Ready-to-Print Quick Forms.
  - Signed-in users get isolated cloud sync in Firestore; guests get local browser storage. Paid members can export Controlled PDFs (including vector Process Flowcharts & sign-off footers) and CSV/Excel sheets.
- **Food Authority Limits Lookup**: Free lookup for PFA, PSQCA, SFDA, and Codex limits (Dairy Fat/SNF, Aflatoxin M1, Water TDS, Oils, Spices, Microbiology).
- **Complaint Handling, QR Portal & CAPA Directory** (\`complaint-handling\`):
  - Enter Company Name, Sector, Location & Logo -> Tool generates a unique public **QR Code & link**.
  - Customers scan the QR code -> Submit complaints into an isolated intake form -> Complaints appear strictly inside THAT organization owner's private directory (other users/companies never see them).
  - Manage Root Cause, Correction, Corrective Action, Open/In-Progress/Closed status, and export **CAPA PDF reports** (with "Digitally Signed Document" footer showing investigator/closer name).
  - Free/Guest limit: First 10 complaints are free; after 10 complaints, Paid Membership unlocks unlimited complaint accumulation, QR intake, and CAPA PDF downloads.

5. INSTALLING MOBILE APP (PWA):
- **Android**: Click "Download App" at the top -> If using WhatsApp/Facebook in-app browser, tap "Open in Chrome to Install App" -> In Chrome tap "Install app" or Chrome 3-dots menu -> "Install app".
- **iPhone / iPad**: Open \`foodscienceportal.com\` in **Safari** -> Tap **Share** icon -> Scroll and tap **Add to Home Screen** -> Tap **Add**.

HONESTY & ESCALATION RULE:
- Never invent features that don't exist.
- If a user needs manual account action (e.g., pending payment approval, certificate name correction, bug fix) or wants to send personal feedback / a custom opinion to the admin, tell them clearly to switch to the **"Opinion & Issue"** tab (or click **"Give Custom Opinion"** / **"Highlight Issue"**) inside this **Support and Help** panel — it delivers straight into the Admin Control Panel!`;

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'food-science-portal-support' });
});

app.post('/api/support-chat', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in Settings > Secrets.',
      code: 'MISSING_API_KEY'
    });
    return;
  }

  const body = (req.body || {}) as SupportChatRequestBody;
  const userMessage = (body.message || '').trim();
  if (!userMessage || userMessage.length > 2500) {
    res.status(400).json({
      error: 'Please enter a valid message between 1 and 2500 characters.',
      code: 'INVALID_INPUT'
    });
    return;
  }

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  const ctx = body.currentContext || {};
  const pricing = ctx.pricing || {};
  const isIntl = pricing.region === 'International';
  const pricingLine = pricing.monthlyFee
    ? `LIVE VISITOR LOCATION & PRICING -> Country: "${pricing.countryName || 'Unknown'}", Region: "${pricing.region || 'Pakistan'}", Currency: "${pricing.currencyCode || 'PKR'}". Paid Membership: ${pricing.monthlyFee}/month or ${pricing.yearlyFee || ''}/year (${pricing.yearlyDiscountPct ?? 25}% OFF). Certificate Fee: ${pricing.standardCertificateFee || (isIntl ? '$5 USD' : 'Rs. 1,000')}${!isIntl && pricing.specialCertificateFee ? ` (Food Manager / Dietary Officer: ${pricing.specialCertificateFee})` : ''}. STRICT PRICING RULE: ONLY quote fees in this visitor's localized currency/region (${pricing.region || 'Pakistan'}). ${isIntl ? 'Do NOT quote PKR/Rs. to this International visitor.' : 'Quote PKR/Rs. pricing (Rs. 100/month, Rs. 900/year, Rs. 1,000 certificate) to this Pakistani visitor.'}`
    : 'LIVE VISITOR LOCATION & PRICING -> Default Pakistan: Rs. 100/month, Rs. 900/year (25% OFF), Certificate Rs. 1,000 (Rs. 8,000 Dietary); International visitors outside Pakistan pay $1 USD/month, $9 USD/year, $5 USD/certificate.';
  const contextLine = `Live User Context -> Route: "${ctx.routeName || 'home'}", Active Tool: "${ctx.activeTool || 'none'}", User Tier: "${ctx.userRole || 'Guest'}", User Name: "${ctx.userName || 'Visitor'}".\n${pricingLine}`;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const formattedHistory = history
      .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text.slice(0, 2000) }]
      }));

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      history: formattedHistory,
      config: {
        systemInstruction: `${PORTAL_KNOWLEDGE_BASE}\n\n${contextLine}`,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW
        }
      }
    });

    const response = await chat.sendMessage({
      message: userMessage
    });

    const replyText = (response.text || '').trim();
    if (!replyText) {
      res.status(502).json({
        error: 'The AI Support Agent returned an empty response. Please try again.',
        code: 'EMPTY_RESPONSE'
      });
      return;
    }

    res.json({ reply: replyText });
  } catch (err: unknown) {
    const errObj = err as { status?: number; message?: string; code?: string };
    const status = typeof errObj?.status === 'number' ? errObj.status : 500;
    const message =
      err instanceof Error
        ? err.message
        : 'Unable to reach AI Support service right now.';
    console.error('Support Chat API Error:', status, message);
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: message,
      code: errObj?.code || 'GEMINI_API_ERROR'
    });
  }
});

async function startServer() {
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Food Science Portal server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
