# YardFlow Interactive Simulations

Three production-ready React simulations that demonstrate YardFlow's value across driver experience, facility operations, and network effects. Built with the dark blueprint isometric aesthetic — thin-line SVG, subtle cyan data glow, floating glass control panels.

## 🎯 What's Included

### 1. Driver Check-in/Check-out Simulation
**Goal:** Make the driver pain points (and detention risk) visceral.

**Shows:**
- Arrival → Gate Check-in → Routing → Door/Staging → Live Status → Checkout
- Before: paperwork, wrong turns, calls, detention risk
- After: QR/geofence check-in, auto-routing, live updates, digital proof

**KPIs:** Gate Time, Total Dwell, Touchpoints, Detention Risk

---

### 2. Facility Operations Simulation
**Goal:** Show operators how digital gate + visibility + dispatch changes the entire operating system.

**Shows:**
- Intake → Yard Visibility → Task Dispatch → Doors → Exceptions → Outcome
- Interactive "Arrival Load" slider to simulate peak days
- Before: queues, low door utilization, late exceptions, radio chaos
- After: clean intake, real-time inventory, task dispatch, early exception detection

**KPIs:** Queue, Gate Cycle, Door Utilization, Dwell, Exceptions, Touchpoints

---

### 3. Network Effect Simulation (C-suite View)
**Goal:** Position YardFlow as a network-level operating system with compounding value.

**Shows:**
- Visual network map with "Facilities Live" slider (1–30)
- Silos → Standardized Events → Compounding → Boardroom View
- How each facility makes every other facility smarter

**KPIs:** ETA Accuracy, Avg Dwell, Cash Released, Turns Index

---

## 🚀 Installation

### Prerequisites
```bash
# Ensure you have a Next.js 13+ project with:
# - App Router
# - Tailwind CSS
# - TypeScript
```

### Install Dependencies
```bash
npm install framer-motion lucide-react
# or
yarn add framer-motion lucide-react
# or
pnpm add framer-motion lucide-react
```

---

## 📁 File Structure

```
components/
└── simulations/
    ├── SimulationShell.tsx         # Shared shell component
    ├── DriverCheckInOutSim.tsx     # Driver simulation
    ├── FacilityOpsSim.tsx          # Facility ops simulation
    ├── NetworkEffectSim.tsx        # Network effect simulation
    └── index.ts                     # Exports

app/
└── simulations/
    └── page.tsx                     # Example usage page
```

---

## 🎨 Usage

### Option 1: Full Page (as provided)
```tsx
// app/simulations/page.tsx
import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';

export default function SimulationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="space-y-20">
          <DriverCheckInOutSim />
          <FacilityOpsSim />
          <NetworkEffectSim />
        </div>
      </div>
    </main>
  );
}
```

### Option 2: Individual Simulations
```tsx
import { DriverCheckInOutSim } from '@/components/simulations';

export default function DriverPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <DriverCheckInOutSim />
    </section>
  );
}
```

### Option 3: Embed in Marketing Site
```tsx
import { NetworkEffectSim } from '@/components/simulations';

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      {/* Features */}
      
      {/* Network effect simulation */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <NetworkEffectSim />
        </div>
      </section>
      
      {/* More sections */}
    </>
  );
}
```

---

## ⚙️ Customization

### Editing Content
All simulation content is controlled via the `steps` array in each component. No need to touch the visual logic.

**Example (DriverCheckInOutSim.tsx):**
```tsx
const steps: SimStep[] = [
  {
    id: 'arrival',
    title: 'Arrival',
    subtitle: 'The first 90 seconds decide the next 90 minutes.',
    narration: 'Driver rolls up with partial info and full optimism...',
    callouts: [{ 
      title: 'Signal', 
      body: 'Do we know who this is and why they're here?' 
    }],
    metrics: {
      before: [
        { key: 'gate', label: 'Gate Time', value: '18–35m', emphasis: 'bad' },
        // ... more metrics
      ],
      after: [
        { key: 'gate', label: 'Gate Time', value: '2–5m', delta: '-80%+', emphasis: 'good' },
        // ... more metrics
      ],
    },
  },
  // ... more steps
];
```

### Changing Animation Speed
```tsx
// In useEffect hook of each component:
useEffect(() => {
  if (!isPlaying) return;
  const t = setInterval(() => {
    setStepIndex((i) => (i + 1) % steps.length);
  }, 2400); // ← Change this duration (milliseconds)
  return () => clearInterval(t);
}, [isPlaying, steps.length]);
```

### Adjusting Colors
The components use Tailwind's color palette. Key colors:
- **Cyan glow:** `rgba(56,189,248,...)` → `text-sky-...`, `bg-sky-...`
- **Good metrics:** `emerald-400`
- **Bad metrics:** `rose-400`
- **Neutral metrics:** `sky-400`

### Swapping SVG Visuals
Replace the inline `<svg>` elements in:
- `DriverScene` component (DriverCheckInOutSim.tsx)
- `FacilityScene` component (FacilityOpsSim.tsx)
- `NetworkScene` component (NetworkEffectSim.tsx)

---

## 🎭 Features

### Interactive Controls
- **Before/After Toggle:** See the difference instantly
- **Play/Pause:** Auto-advance through steps
- **Reset:** Return to initial state
- **Step Navigation:** Click individual steps
- **Sliders:** 
  - Facility Ops: "Arrival Load" (10–100)
  - Network Effect: "Facilities Live" (1–30)

### Responsive Design
- Mobile: Stacks vertically
- Desktop: 2-column layout (visual + controls/KPIs)

### Animations
- Smooth transitions via Framer Motion
- Spring physics for truck/element movement
- Subtle pulses and glows for "after" state
- No janky or cartoonish vibes

### Accessibility
- `aria-label` on all buttons
- Keyboard navigable
- Semantic HTML structure

---

## 🔧 Technical Details

### Component Architecture
```
SimulationShell (shared)
├── Controls (toggle, play, reset)
├── Stepper (step navigation)
├── Visual Panel (left, lg:col-span-8)
└── Right Panel (lg:col-span-4)
    ├── Narration + Callouts
    ├── Live KPIs
    └── Optional rightVisual content
```

### TypeScript Types
```tsx
export type SimMode = 'before' | 'after';

export type SimMetric = {
  key: string;
  label: string;
  value: string;
  delta?: string;
  emphasis?: 'good' | 'bad' | 'neutral';
};

export type SimStep = {
  id: string;
  title: string;
  subtitle?: string;
  narration: string;
  callouts?: Array<{ title: string; body: string }>;
  metrics: {
    before: SimMetric[];
    after: SimMetric[];
  };
};
```

### Performance
- Inline SVG (no external requests)
- Minimal re-renders (useMemo for derived state)
- No heavy dependencies
- Client-side only (`'use client'`)

---

## 📊 Narrative Logic

### Driver Simulation
**Story Arc:** Uncertainty → Frustration → Detention Risk vs. Predictability → Speed → Peace of Mind

**Key Message:** YardFlow turns check-in/out into a predictable flow (fewer detention invoices).

---

### Facility Ops Simulation
**Story Arc:** Manual Chaos → Blind Spots → Exceptions Discovered Late vs. Digital Gate → Visibility → Early Detection

**Key Message:** YardFlow doesn't "add a tool." It replaces the duct tape.

---

### Network Effect Simulation
**Story Arc:** Silos → Sparse Data → High Variance vs. Standardized Events → Compounding Predictions → Strategic Advantage

**Key Message:** Every facility added makes every other facility smarter.

---

## 🎯 Sales/Marketing Integration

### Where to Use These

1. **Homepage:** Network effect simulation as proof of "platform, not tool"
2. **Product Page:** All three to show comprehensive value
3. **Driver-Facing Section:** Driver simulation only
4. **Ops/Facilities Page:** Facility ops simulation
5. **C-suite/Investor Deck:** Network effect simulation
6. **Demo Calls:** Run live during discovery (use sliders to match prospect's scale)

### Talking Points (by Simulation)

**Driver Sim:**
> "This isn't about shaving minutes. It's about turning detention risk from 'high' to 'low.' That's the difference between profit and loss on a load."

**Facility Ops Sim:**
> "Crank the arrival load slider to peak days. See how YardFlow keeps door utilization high and exceptions early—even under pressure."

**Network Effect Sim:**
> "Most yard tools are local optimizations. YardFlow is a network-level operating system. Watch what happens as we add facilities—ETA accuracy compounds, dwell drops, cash releases."

---

## 🚢 Deployment Checklist

- [ ] Install `framer-motion` and `lucide-react`
- [ ] Copy `components/simulations/` folder
- [ ] Verify Tailwind CSS config includes all color utilities
- [ ] Test responsive behavior (mobile + desktop)
- [ ] Adjust animation timing if needed
- [ ] Customize metrics/content to match real data
- [ ] Add tracking/analytics events (optional)
- [ ] Test across browsers (Chrome, Safari, Firefox)

---

## 🎨 Design System Alignment

### Colors
- **Background:** `gray-950` → `gray-900` gradient
- **Glass panels:** `bg-white/[0.04]`, `backdrop-blur-xl`
- **Borders:** `border-white/10`
- **Text:** `text-white`, `text-white/70`, `text-white/60`
- **Accents:** `sky-400` (cyan), `emerald-400` (good), `rose-400` (bad)

### Typography
- **Titles:** `text-xl font-semibold tracking-tight`
- **Descriptions:** `text-sm text-white/70`
- **KPI labels:** `text-[11px] uppercase tracking-wider`
- **KPI values:** `text-base font-semibold`

### Spacing
- **Section gaps:** `space-y-20`
- **Component gaps:** `gap-4`
- **Padding:** `p-3`, `p-4` (glass panels)

---

## 💡 Pro Tips

1. **Editable Content:** All narrative, metrics, and callouts are in plain TypeScript objects. Non-technical folks can edit with minimal risk.

2. **No External Assets:** Everything is inline SVG + code. No image loading delays.

3. **Parallel with ROI Calculator:** If you have an ROI calculator on the site, align the KPI assumptions (e.g., "2.6h → 1.5h dwell" should match the calculator's inputs).

4. **A/B Test Order:** Try showing Network Effect *first* for C-suite prospects, Driver *first* for ops/logistics buyers.

5. **Video Capture:** These simulations record *beautifully* with Loom/ScreenFlow for async demos.

---

## 🤝 Contributing / Customization Requests

Want to:
- Swap the SVG art for a closer match to your existing yard illustration?
- Tune the KPI math to align with your ROI calculator?
- Add a fourth simulation (e.g., Carrier Experience)?

All components are designed for easy extension. The `SimulationShell` handles all UI/UX scaffolding—just swap the `leftVisual` and `steps` data.

---

## 📝 License

These components are part of the YardFlow (FreightRoll) project. Modify and deploy as needed.

---

## 🙌 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)

---

**Ready to ship.** Drop these into your codebase, adjust the content to match your pitch, and watch prospects lean in. 🚀
