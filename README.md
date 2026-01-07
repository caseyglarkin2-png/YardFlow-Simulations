# YardFlow Interactive Simulations

**Three production-ready React simulations** that demonstrate YardFlow's value proposition with the dark blueprint isometric aesthetic — thin-line SVG, subtle cyan data glow, and floating glass control panels.

---

## 🎯 What This Is

Interactive before/after simulations designed to make YardFlow's value **visceral** for three key audiences:

1. **Drivers** → Check-in/Check-out experience (detention risk)
2. **Facility Operators** → Digital gate + visibility + dispatch (flow vs. chaos)
3. **C-suite** → Network effect and compounding advantage

Each simulation:
- ✅ **Before/After toggle** — instant comparison
- ✅ **Play/Pause** — auto-advance through steps
- ✅ **Interactive controls** — sliders to adjust scenarios
- ✅ **Live KPIs** — metrics that update per step
- ✅ **Narrative-driven** — tells a story, not just data

---

## 🚀 Quick Start

### For Existing Next.js Projects

```bash
# 1. Install dependencies
npm install framer-motion lucide-react

# 2. Copy the components/simulations/ folder into your project

# 3. Use them
import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';
```

**See [QUICKSTART.md](./QUICKSTART.md) for detailed installation steps.**

---

## 📁 What's Included

```
components/simulations/
├── SimulationShell.tsx          # Shared UI framework
├── DriverCheckInOutSim.tsx      # Driver experience simulation
├── FacilityOpsSim.tsx           # Facility operations simulation
├── NetworkEffectSim.tsx         # Network effect (C-suite) simulation
└── index.ts                     # Clean exports

app/simulations/
└── page.tsx                     # Example: all 3 on one page
```

---

## 🎨 Live Preview

### 1. Driver Check-in/Check-out
**Audience:** Drivers, carrier partners, logistics teams

**Shows:**
- Arrival → Gate → Routing → Door → Status → Checkout
- **Before:** paperwork, wrong turns, calls, high detention risk
- **After:** QR check-in, auto-routing, live updates, fast outgate

**KPIs:** Gate Time, Total Dwell, Touchpoints, Detention Risk

---

### 2. Facility Operations
**Audience:** Yard managers, facility operators, operations directors

**Shows:**
- Intake → Visibility → Dispatch → Doors → Exceptions → Outcome
- Interactive "Arrival Load" slider (simulate peak days)
- **Before:** long queues, low door utilization, late exceptions, radio chaos
- **After:** digital gate, real-time inventory, task dispatch, early detection

**KPIs:** Queue, Gate Cycle, Door Util, Dwell, Exceptions

---

### 3. Network Effect (C-suite View)
**Audience:** Executives, investors, strategic buyers

**Shows:**
- Visual network map with "Facilities Live" slider (1–30)
- How standardized events compound across the network
- **Before:** silos, sparse data, variable service
- **After:** predictive accuracy, reduced buffers, cash released

**KPIs:** ETA Accuracy, Avg Dwell, Cash Released, Turns Index

**Key message:** *"Every facility added makes every other facility smarter."*

---

## ⚙️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

---

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** — Installation and setup
- **[SIMULATIONS_README.md](./SIMULATIONS_README.md)** — Full documentation, customization, and usage patterns

---

## 🎯 Use Cases

### Marketing Site Integration
```tsx
import { NetworkEffectSim } from '@/components/simulations';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      
      <section className="bg-gray-950 py-20">
        <NetworkEffectSim />
      </section>
      
      <Pricing />
    </>
  );
}
```

### Demo Calls
Run the simulations live during discovery:
- Use the sliders to match the prospect's scale
- Toggle before/after to make the pain point visceral
- Let the metrics do the talking

### Sales Decks
- Screenshot the "after" state with high-impact metrics
- Embed in slides as proof points
- Record short videos for async follow-ups

---

## 🎨 Design Philosophy

**Aesthetic:** Dark blueprint isometric yard
- Thin-line SVG (no cartoon vibes)
- Subtle cyan "data glow" for active states
- Floating glass panels with backdrop blur
- Spring-based motion (smooth, not janky)

**Narrative:** Story-first, metrics-second
- Each step tells part of the journey
- Callouts highlight key insights
- KPIs reinforce the story (not replace it)

---

## ⚡ Features

- ✅ **Responsive:** Mobile-friendly (stacks vertically)
- ✅ **Accessible:** Keyboard nav, ARIA labels
- ✅ **Performant:** Inline SVG, minimal re-renders
- ✅ **Customizable:** Content via simple JSON-like arrays
- ✅ **No external assets:** Everything is code (ships fast)

---

## 🔧 Customization

All content is controlled via the `steps` array in each component:

```tsx
const steps: SimStep[] = [
  {
    id: 'arrival',
    title: 'Arrival',
    narration: 'Driver rolls up with partial info...',
    metrics: {
      before: [{ key: 'gate', label: 'Gate Time', value: '25m', emphasis: 'bad' }],
      after: [{ key: 'gate', label: 'Gate Time', value: '3m', delta: '-88%', emphasis: 'good' }],
    },
  },
  // ... more steps
];
```

**No need to touch the visual or animation logic.** Just edit the content.

See [SIMULATIONS_README.md](./SIMULATIONS_README.md) for full customization guide.

---

## 🚢 Deployment

Works with:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting

```bash
npm run build
npm run start
```

---

## 📊 ROI Alignment

These simulations pair beautifully with an ROI calculator:

1. **Driver Sim** shows the dwell reduction (2.6h → 1.5h)
2. **ROI Calculator** converts that to $$$ (detention savings)
3. **Network Sim** shows the compounding effect across facilities

**Tip:** Keep the KPI assumptions consistent across tools (no "ROI multiverse").

---

## 🎥 Demo Tips

1. **Start with Network Effect** for C-suite prospects
2. **Start with Driver** for ops/logistics buyers
3. **Use sliders** to match their scale (facilities, arrival rate)
4. **Toggle before/after** at key moments for impact
5. **Let metrics settle** — don't rush the animation

---

## 🤝 Contributing

Want to extend or customize?

- **Add a 4th simulation?** Copy the pattern from existing ones
- **Different SVG art?** Replace inline SVG in scene components
- **New KPIs?** Add to the `metrics` arrays

The `SimulationShell` handles all UI scaffolding — just swap content.

---

## 📝 License

Part of the YardFlow (FreightRoll) project. Free to use and modify.

---

## 🙌 Credits

Built with Next.js, Tailwind CSS, Framer Motion, and Lucide React.

---

**Ready to ship.** 🚀

For detailed setup and usage, see [QUICKSTART.md](./QUICKSTART.md) 
