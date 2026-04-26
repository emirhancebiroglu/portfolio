import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory rate limiter — resets on cold start, fine for a free tool
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const INJECTION_PATTERNS = [
  'ignore previous instructions',
  'ignore all instructions',
  'disregard previous',
  'system prompt',
  'you are now',
  'act as',
  'jailbreak',
];

type Granularity = 'low' | 'medium' | 'high';

interface ValidatedInput {
  task: string;
  granularity: Granularity;
}

function validateInput(body: unknown): ValidatedInput | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  const task = b['task'];
  const granularity = b['granularity'];

  if (typeof task !== 'string') return null;

  const trimmed = task.trim();
  if (trimmed.length === 0 || trimmed.length > 500) return null;

  const lower = trimmed.toLowerCase();
  if (INJECTION_PATTERNS.some((p) => lower.includes(p))) return null;

  if (granularity !== 'low' && granularity !== 'medium' && granularity !== 'high') return null;

  return { task: trimmed, granularity };
}

const STEP_RANGE: Record<Granularity, string> = {
  low: '3-4 steps',
  medium: '5-7 steps',
  high: '8-12 steps',
};

const SYSTEM_PROMPT = `You are an expert task breakdown assistant for overwhelmed users.
Your job: convert a vague or overwhelming task into concrete, immediately-actionable steps as JSON.

THE STEP 1 CONTRACT (most important rule):
Step 1 MUST be a physical action the user can complete in under 5 minutes RIGHT NOW with zero preparation.
If a task requires supplies or planning, Step 1 is the SMALLEST gathering action — never "gather supplies" or "make a list".
Bad Step 1: "Make a list of cleaning tasks" → Good Step 1: "Walk into the kitchen and put one dirty dish in the sink"
Bad Step 1: "Plan your study schedule" → Good Step 1: "Open your textbook to the first chapter you need to review"
Bad Step 1: "Research the company" → Good Step 1: "Open the company's About page and read it for 5 minutes"

BANNED PHRASES (never use these — the model is overusing them):
- "make a list of"
- "create a checklist"
- "categorize"
- "prioritize tasks"
- "plan your"
- "research" (without naming a specific source/page/duration)
- "break down" (this is recursive — you ARE the breakdown)
- "gather all" / "gather supplies"
- "take a break" / "rest and recharge"
- "focus on one X at a time" (advice, not action)
- "start with a small task" (vague)
- "just" (implies the task is easy)

EVERY STEP MUST:
- Start with a concrete verb (Open, Wipe, Write, Email, Run, Type, Walk, Read)
- Name a specific place, file, tool, person, duration, or quantity
- Be physically executable without further decomposition
- Include estimatedMinutes (an integer)

FOR TECHNICAL TASKS:
- Use modern tooling: Next.js or Vite (NEVER create-react-app — deprecated 2023)
- First 1-2 steps must establish the data flow or contract (request shape → response shape, or schema first)
- Name actual files, commands, or endpoints — not categories of work
- Build a minimal working version before adding features

OUTPUT FORMAT — STRICT JSON OBJECT:
{
  "steps": [
    { "number": 1, "text": "Open the kitchen and put one dirty dish in the sink", "estimatedMinutes": 1 },
    { "number": 2, "text": "Wipe down the kitchen counter with a damp cloth", "estimatedMinutes": 5 }
  ]
}

---
EXAMPLE 1 — Physical chore (medium granularity)
User task: "Clean my apartment before guests arrive this weekend"

{
  "steps": [
    { "number": 1, "text": "Walk through every room and put loose items in a single laundry basket", "estimatedMinutes": 10 },
    { "number": 2, "text": "Load the dishwasher and start it, then put dirty pans in the sink to soak", "estimatedMinutes": 8 },
    { "number": 3, "text": "Wipe down the kitchen counters and stovetop with a multi-surface spray", "estimatedMinutes": 10 },
    { "number": 4, "text": "Scrub the bathroom sink, toilet, and mirror — in that order", "estimatedMinutes": 15 },
    { "number": 5, "text": "Vacuum the living room and main hallway", "estimatedMinutes": 12 },
    { "number": 6, "text": "Empty the laundry basket into drawers, the closet, or the hamper", "estimatedMinutes": 10 },
    { "number": 7, "text": "Take the trash out and replace the bag", "estimatedMinutes": 5 }
  ]
}

---
EXAMPLE 2 — Technical project (high granularity)
User task: "Build a full-stack web app with auth and deployment, React + Node + Postgres"

{
  "steps": [
    { "number": 1, "text": "Sketch the auth flow on paper: client sends email+password to POST /auth/login → server returns { token } → client stores token in httpOnly cookie", "estimatedMinutes": 15 },
    { "number": 2, "text": "Define the users table SQL: id (uuid), email (unique), password_hash (text), created_at (timestamp)", "estimatedMinutes": 10 },
    { "number": 3, "text": "Run 'npm create vite@latest client -- --template react-ts' and 'npm init -y' in a sibling 'server' folder", "estimatedMinutes": 10 },
    { "number": 4, "text": "Install server deps: 'npm i express pg bcrypt jsonwebtoken cors' and 'npm i -D typescript @types/node tsx'", "estimatedMinutes": 5 },
    { "number": 5, "text": "Spin up Postgres locally with 'docker run --name appdb -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres' and run the users-table SQL via psql", "estimatedMinutes": 15 },
    { "number": 6, "text": "Write server/src/index.ts with one POST /auth/register endpoint that hashes the password with bcrypt and inserts into users", "estimatedMinutes": 30 },
    { "number": 7, "text": "Add POST /auth/login that verifies the password and returns a signed JWT", "estimatedMinutes": 25 },
    { "number": 8, "text": "Build a single client page at client/src/App.tsx with email+password inputs that calls fetch('/auth/register') and stores the returned token", "estimatedMinutes": 30 },
    { "number": 9, "text": "Connect the client to the server via a Vite proxy in vite.config.ts pointing /auth to http://localhost:3000", "estimatedMinutes": 10 },
    { "number": 10, "text": "Push the repo to GitHub and connect both folders to Vercel — set the Postgres connection string from Neon as an env var", "estimatedMinutes": 25 }
  ]
}

---
EXAMPLE 3 — Study + interview prep (medium granularity)
User task: "Prepare for a job interview in one week"

{
  "steps": [
    { "number": 1, "text": "Open the company's About and Careers pages and read both for 10 minutes", "estimatedMinutes": 10 },
    { "number": 2, "text": "Re-read the job description and write down the 5 skills it mentions most", "estimatedMinutes": 10 },
    { "number": 3, "text": "Update your resume's top section so the headline matches one of those 5 skills", "estimatedMinutes": 20 },
    { "number": 4, "text": "Write a 90-second answer to 'Tell me about yourself' and read it out loud twice", "estimatedMinutes": 20 },
    { "number": 5, "text": "Pick three past projects and write a STAR-format paragraph for each (Situation, Task, Action, Result)", "estimatedMinutes": 45 },
    { "number": 6, "text": "Schedule a 30-minute mock interview with a friend for two days before the interview", "estimatedMinutes": 5 },
    { "number": 7, "text": "Pack your interview bag the night before: printed resume, water, pen, notebook, phone charger", "estimatedMinutes": 10 }
  ]
}
---
END OF EXAMPLES.

Now respond to the user's task in the same JSON format. Output JSON only — no prose, no markdown.`;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "You've used this tool a lot! Try again in an hour." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const input = validateInput(body);
  if (!input) {
    return NextResponse.json(
      { error: 'Invalid input. Task is required and must be under 500 characters.' },
      { status: 400 },
    );
  }

  const userMessage = `The user feels overwhelmed and wants to START in the next 5 minutes.

Their task: "${input.task}"

Granularity: ${input.granularity} (${STEP_RANGE[input.granularity]}).

Step 1 must be a physical action they can do RIGHT NOW with no preparation.
Be specific: name tools, files, places, durations.
Always include estimatedMinutes for every step.
Return JSON only.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? '';
    const parsed = JSON.parse(text) as { steps?: unknown };

    if (!parsed || !Array.isArray(parsed.steps)) {
      throw new Error('Model response missing steps array');
    }

    return NextResponse.json({ steps: parsed.steps, originalTask: input.task });
  } catch (error) {
    console.error('Task breakdown error:', error);
    return NextResponse.json(
      { error: 'Failed to break down the task. Please try again.' },
      { status: 500 },
    );
  }
}
