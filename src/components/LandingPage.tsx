import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  ExternalLink,
  FileDown,
  FileText,
  Lightbulb,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';

const heroPricingOptions = [
  { id: 'usd', label: 'USD', amount: '$197', cta: 'Enroll now — $197' },
  { id: 'gbp', label: 'GBP', amount: '£169', cta: 'Enrol now — £169' },
  { id: 'eur', label: 'EUR', amount: '€189', cta: 'Enroll now — €189' },
];

const clarityWins = [
  'A 1-page Clarity Map (what you want & why it matters)',
  'A personal Decision Filter (how you’ll choose)',
  'A 90-day plan aligned to your values & constraints',
];

const socialProofQuotes = [
  {
    quote:
      'Within two weeks I went from stuck to pitching the role I actually wanted. The structure forced honest answers I’d been avoiding.',
    name: 'Jermaine',
    role: 'People Operations Lead',
  },
  {
    quote:
      'This finally aligned who I am with how I work. I left with a concrete roadmap and more energy than I’ve had in months.',
    name: 'Ilona',
    role: 'Creative Director',
  },
  {
    quote:
      'I stopped treating clarity like luck and turned it into a weekly ritual. That shift changed everything.',
    name: 'Nicolas',
    role: 'Product Strategist',
  },
];

const painSignals = [
  'You’re successful on paper but the next move isn’t obvious.',
  'You revisit the same work/life questions without resolution.',
  'You sense a bigger version of you, but the step-by-step path isn’t clear.',
  'You want practical frameworks — not fluffy motivation.',
];

const outcomes = [
  {
    title: 'Outcome 1 — Clarity you can act on',
    description: 'Uncover what you truly want, why it matters, and how to move toward it this quarter.',
  },
  {
    title: 'Outcome 2 — An aligned plan',
    description: 'A step-by-step 90-day roadmap that fits your values, priorities, and constraints.',
  },
  {
    title: 'Outcome 3 — Confidence to choose',
    description: 'Replace looping doubts with lightweight decision filters you can use daily.',
  },
];

const methodModules = [
  {
    icon: Compass,
    title: 'Module 1 — Explore',
    subtitle: 'Audit the story so far',
    bullets: [
      'Decode patterns that keep you circling.',
      'Reconnect with values, strengths, and ambitions.',
      'Spot what must change before anything meaningful can.',
    ],
  },
  {
    icon: Target,
    title: 'Module 2 — Focus',
    subtitle: 'Zero in on what matters',
    bullets: [
      'Identify the four common blockers to your next move.',
      'Map the drivers behind decisions (mind, body, heart, spirit).',
      'Design micro-rituals to stay centred and accountable.',
    ],
  },
  {
    icon: Lightbulb,
    title: 'Module 3 — Decide',
    subtitle: 'Choose the path forward',
    bullets: [
      'Turn possibility into a motivating direction.',
      'Build a realistic next-90-day plan.',
      'Leave with tools to repeat the process whenever life changes again.',
    ],
  },
];

const inclusions = [
  '28 on-demand lessons (10–15 minutes each)',
  '100+ minutes of coaching walkthroughs from Alex',
  'Interactive 30-page digital workbook (fillable, downloadable)',
  'Decision frameworks you can reuse for future pivots',
  'Bonus: Weekly clarity rituals to stay aligned after the workshop',
  'Lifetime access and all future updates',
];

const investmentReasons = [
  'Working 1:1 with an executive coach is powerful but costly.',
  'Complete in a focused weekend or across two intentional weeks.',
  'Reusable tools for every pivot ahead — no scheduling friction.',
  'Designed specifically for busy, white-collar professionals.',
];

const coachStats = [
  { label: 'Leaders coached', value: '300+' },
  { label: 'Industries served', value: '18' },
  { label: 'Years coaching', value: '12' },
  { label: 'Avg. clarity score increase', value: '72%' },
];

const comparisonRows = [
  {
    label: 'Time to first result',
    workshop: '1–2 sessions',
    coaching: '2–4 sessions',
    nothing: 'Months',
  },
  {
    label: 'Cost',
    workshop: '$197',
    coaching: '$$$ per hour',
    nothing: '$0 (hidden cost)',
  },
  {
    label: 'Reusable frameworks',
    workshop: 'Yes',
    coaching: 'Sometimes',
    nothing: 'No',
  },
  {
    label: 'Schedule friction',
    workshop: 'None',
    coaching: 'High',
    nothing: 'N/A',
  },
  {
    label: 'Momentum & clarity',
    workshop: 'High',
    coaching: 'High',
    nothing: 'Low',
  },
];

const faqItems = [
  {
    question: 'How long do I get access?',
    answer: 'Lifetime. Revisit the material and workbook whenever life shifts.',
  },
  {
    question: 'Do I need to finish it in one sitting?',
    answer: 'No. Lessons are 10–15 minutes. Most people finish in a focused weekend or across two weeks.',
  },
  {
    question: 'Is there any live support?',
    answer: 'It’s self-paced with guided videos. You can book 1:1 coaching separately if you want deeper support.',
  },
  {
    question: 'What if it isn’t right for me?',
    answer: 'If you complete the videos and exercises within 14 days and don’t feel a shift in clarity, email us for a full refund.',
  },
  {
    question: 'Will this help if I’ve already tried therapy or journaling?',
    answer: 'Yes—this is not therapy. It’s a decision and planning system for values-aligned action in the next 90 days.',
  },
  {
    question: 'Can my company pay for it?',
    answer: 'Often yes. Use our employer reimbursement letter and request a VAT-compliant invoice if needed.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-900">
      <Hero />
      <SocialProof />
      <PainSection />
      <OutcomeSection />
      <MethodSection />
      <InclusionsSection />
      <InvestmentSection />
      <CoachSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}

function Hero() {
  const [activePrice, setActivePrice] = useState(heroPricingOptions[0]);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-[#1d2235]">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(253,127,79,0.25),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center gap-12 px-6 py-24 text-center lg:flex-row lg:items-start lg:text-left">
        <div className="w-full space-y-8 lg:w-3/5">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-orange-200">
            <Sparkles className="h-4 w-4" />
            Proven by executive coach Alex Kergall
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Get clear on what’s next — and start it this week.
          </h1>
          <p className="text-lg text-slate-200 sm:text-xl lg:text-2xl">
            A practical, self-paced workshop that turns career restlessness into a concrete 90-day plan you’ll actually follow.
          </p>
          <div className="flex flex-col items-center gap-6 sm:flex-row lg:items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 text-xs text-orange-100">
                {heroPricingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActivePrice(option)}
                    className={`rounded-full px-3 py-1 font-medium transition ${
                      activePrice.id === option.id ? 'bg-white text-slate-900' : 'text-white hover:bg-white/10'
                    }`}
                    type="button"
                  >
                    {option.amount}
                  </button>
                ))}
              </div>
              <Link
                to="/checkout"
                className="group flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fd7f4f] via-[#ff6b9d] to-[#ff8c42] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-2xl"
              >
                {activePrice.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3 text-sm text-slate-300">
              <p className="text-sm text-slate-100">Instant access · 14-day guarantee · Secure checkout</p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                {clarityWins.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-[#ff8c42]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-left text-slate-100 backdrop-blur-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-200">From your clarity assessment</p>
            <p className="mt-3 text-base">
              Your top blockers are <span className="font-semibold text-white">Overthinking</span> and
              <span className="font-semibold text-white"> Competing Priorities</span>. This workshop resolves them with short, guided exercises and decision frameworks used by Alex’s leadership clients.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-200 sm:flex-row sm:items-center">
              <a
                href="#overview"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2 font-medium text-white transition hover:bg-white/10"
              >
                <Play className="h-4 w-4" /> Watch 2-min overview
              </a>
              <a
                href="#sample-lesson"
                className="inline-flex items-center gap-2 text-slate-200 hover:text-white"
              >
                Try the first lesson free
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 w-full max-w-md lg:mt-0 lg:w-2/5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
            <div className="rounded-2xl bg-white/80 p-6 text-left shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-800">What you’ll leave with:</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {clarityWins.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#fd7f4f]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-slate-900 p-4 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-200">No risk</p>
                <p className="mt-1 text-lg font-semibold">Full refund if you don’t feel noticeably clearer in 14 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SocialProof() {
  return (
    <section className="border-b border-slate-200 bg-white py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {socialProofQuotes.map(({ quote, name, role }) => (
            <div key={name} className="flex h-full flex-col gap-6 rounded-3xl border border-slate-100 bg-slate-50/80 p-8 shadow-sm">
              <Quote className="h-8 w-8 text-[#ff6b9d]" />
              <p className="text-base text-slate-700">{quote}</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-sm text-slate-500">{role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-50/60 px-6 py-5 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[#fd7f4f]" />
            94% of graduates report a tangible shift in clarity.*
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span>As referenced by leaders featured in:</span>
            <span className="font-medium text-slate-700">Forbes</span>
            <span>•</span>
            <span className="font-medium text-slate-700">The Times</span>
            <span>•</span>
            <span className="font-medium text-slate-700">CEO Today</span>
            <a href="#press" className="inline-flex items-center gap-1 text-[#fd7f4f]">
              (See features)
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          *Measured via a 10-item “Clarity Score” self-assessment completed pre- and post-workshop by N participants. Methodology below.
        </p>
      </div>
    </section>
  );
}

function PainSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">If this sounds like you…</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            You’re doing all the right things on paper—yet the next move still feels foggy.
          </h2>
          <p className="text-base text-slate-600">
            The Clarity Workshop is engineered for white-collar professionals who want practical momentum, not motivational fluff.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {painSignals.map((signal) => (
            <div key={signal} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-base text-slate-600">{signal}</p>
            </div>
          ))}
        </div>
        <a
          href="#not-for-you"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#fd7f4f]"
        >
          This workshop is probably not for you if…
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function OutcomeSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">What changes after the workshop</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Clarity, direction, and a confident 90-day plan.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <div key={outcome.title} className="rounded-3xl border border-slate-100 bg-slate-50/60 p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{outcome.title}</h3>
              <p className="mt-3 text-base text-slate-600">{outcome.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section className="bg-[#131826] py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">How it works</p>
          <h2 className="text-3xl font-bold sm:text-4xl">The Explore-Focus-Decide Method</h2>
          <p className="text-base text-slate-300">
            Most participants report their first breakthrough during Modules 1–2; Module 3 converts that into a plan you can execute immediately.
          </p>
        </div>
        <div className="mt-12 space-y-10">
          {methodModules.map(({ icon: Icon, title, subtitle, bullets }) => (
            <div key={title} className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg lg:flex-row lg:items-start">
              <div className="flex items-start gap-4 lg:w-1/3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <Icon className="h-8 w-8 text-[#ff8c42]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-sm uppercase tracking-[0.3em] text-orange-200">{subtitle}</p>
                </div>
              </div>
              <ul className="space-y-3 text-base text-slate-200 lg:w-2/3">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#ff6b9d]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InclusionsSection() {
  return (
    <section className="bg-white py-24" id="sample-lesson">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">What you get</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to make confident moves.</h2>
          <p className="text-base text-slate-600">
            Designed to be practical, reusable, and easy to weave into a busy schedule.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {inclusions.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#fd7f4f]" />
              <span className="text-base text-slate-700">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium text-[#fd7f4f]">
          <a href="#overview" className="inline-flex items-center gap-2">
            <Play className="h-4 w-4" /> See a sample lesson
          </a>
          <a href="#workbook" className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4" /> Download 3 pages of the workbook
          </a>
        </div>
      </div>
    </section>
  );
}

function InvestmentSection() {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-200">Why this is a smart investment</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Executive coaching outcomes without the executive calendar.</h2>
            <p className="text-base text-slate-200">
              Working 1:1 with an executive coach is powerful but costly and calendar-heavy. The Clarity Workshop distils Alex’s method into a format you can complete in a focused weekend or across two weeks—and reuse any time your direction shifts.
            </p>
            <ul className="space-y-3 text-base text-slate-200">
              {investmentReasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[#ff8c42]" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-200">
              <ClipboardCheck className="h-4 w-4" />
              Reusable clarity infrastructure
            </div>
            <p className="mt-3 text-base text-slate-100">
              Self-paced, practical, and built so you can recommit to clarity every quarter without starting from scratch.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-200">
                <BarChart3 className="h-4 w-4" />
                Methodology highlight
              </div>
              <p className="mt-3 text-sm text-slate-300">
                94% of graduates report clarity improvements within 14 days. Assessments are benchmarked using our proprietary Clarity Score, informed by hundreds of leadership engagements.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <a href="#reimbursement" className="inline-flex items-center gap-2 text-[#ff6b9d]">
                <FileDown className="h-4 w-4" /> Download employer reimbursement letter
              </a>
              <a href="#methodology" className="inline-flex items-center gap-1 text-[#ff6b9d]">
                See how we measure
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoachSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Meet Alex Kergall</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Your coach for clarity at pace.</h2>
            <p className="text-base text-slate-600">
              Strategic advisor and coach to founders, VC-backed leaders, and high performers navigating their next chapter. Alex has guided hundreds of leaders through high-stakes decisions—translating ambition into aligned, sustainable trajectories.
            </p>
            <p className="text-base text-slate-600">
              The Clarity Workshop distils Alex’s method into a format you can complete without calendar friction, while providing the decision frameworks you’ll reuse for every pivot ahead.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {coachStats.map(({ label, value }) => (
                <StatCard key={label} label={label} value={value} spanFull={label === 'Avg. clarity score increase'} />
              ))}
            </div>
            <a
              href="#why-alex"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#fd7f4f]"
            >
              Why I built this workshop
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#fd7f4f] via-[#ff6b9d] to-[#ff8c42] opacity-60 blur-3xl" />
            <img
              src="https://www.dropbox.com/scl/fi/5yedadf8u3c0v3q4rhzxg/alex-image.jpeg?rlkey=ivas4dk28t6sz8m9j3ur20js0&st=n5mlan6p&raw=1"
              alt="Coach Alex Kergall"
              className="relative z-10 w-full max-w-md rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, spanFull }: { label: string; value: string; spanFull?: boolean }) {
  return (
    <div
      className={`${spanFull ? 'sm:col-span-2' : ''} rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Pricing & guarantee</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">The Clarity Workshop — $197</h2>
            <p className="mt-2 text-sm text-slate-500">Toggle currency: £169 • €189</p>
            <p className="mt-6 text-base text-slate-600">One-time payment. Lifetime access.</p>
            <Link
              to="/checkout"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fd7f4f] via-[#ff6b9d] to-[#ff8c42] px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-2xl"
            >
              Enroll now — $197
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-500">
                <ShieldCheck className="h-5 w-5 text-[#fd7f4f]" />
                14-day clarity guarantee
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Go through the lessons and workbook. If you don’t feel noticeably clearer about your next move within 14 days, email us for a full refund. No hoops.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                If you’re in the UK/EU, you’ll be asked to consent to immediate digital delivery. We still honour our 14-day guarantee.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <a href="#reimbursement" className="inline-flex items-center gap-2 text-[#fd7f4f]">
                <FileDown className="h-4 w-4" /> Download reimbursement request
              </a>
              <a href="#invoice" className="inline-flex items-center gap-2 text-[#fd7f4f]">
                <ExternalLink className="h-4 w-4" /> Request VAT-compliant invoice
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-900">Comparison (to set value)</h3>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
              <table className="min-w-full bg-white text-sm text-slate-700">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-6 py-3" />
                    <th className="px-6 py-3 font-semibold text-slate-700">This Workshop</th>
                    <th className="px-6 py-3">1:1 Coaching</th>
                    <th className="px-6 py-3">Do Nothing</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(({ label, workshop, coaching, nothing }) => (
                    <tr key={label} className="border-t border-slate-100">
                      <td className="px-6 py-4 font-medium text-slate-600">{label}</td>
                      <td className="px-6 py-4 text-slate-900">{workshop}</td>
                      <td className="px-6 py-4 text-slate-600">{coaching}</td>
                      <td className="px-6 py-4 text-slate-500">{nothing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to know before joining.</h2>
        </div>
        <div className="mt-12 space-y-6">
          {faqItems.map(({ question, answer }) => (
            <details key={question} className="group rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <summary className="flex cursor-pointer items-center justify-between text-left text-lg font-semibold text-slate-900">
                {question}
                <span className="text-sm font-medium text-[#ff6b9d] group-open:hidden">Expand</span>
                <span className="hidden text-sm font-medium text-[#ff6b9d] group-open:inline">Hide</span>
              </summary>
              <p className="mt-3 text-base text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-gradient-to-br from-[#ff6b9d] via-[#fd7f4f] to-[#ff8c42] py-20 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Give yourself one focused weekend. Change your next decade.</h2>
        <p className="mt-4 text-base text-white/90">
          Join professionals who replaced hesitation with an aligned plan they’re proud to follow.
        </p>
        <Link
          to="/checkout"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:shadow-xl"
        >
          Enroll now — $197
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
