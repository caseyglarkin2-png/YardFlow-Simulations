# YardFlow Simulations - Quick Start Guide

## 🚀 Quick Installation (Drop-in to Existing Next.js Project)

### Step 1: Install Dependencies
```bash
npm install framer-motion lucide-react
```

### Step 2: Copy Files
Copy the entire `components/simulations/` folder into your project:

```
your-project/
├── components/
│   └── simulations/
│       ├── SimulationShell.tsx
│       ├── DriverCheckInOutSim.tsx
│       ├── FacilityOpsSim.tsx
│       ├── NetworkEffectSim.tsx
│       └── index.ts
```

### Step 3: Use in Your App
```tsx
// app/page.tsx or wherever you want to display them
import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 py-16">
      <div className="mx-auto max-w-7xl px-4 space-y-20">
        <DriverCheckInOutSim />
        <FacilityOpsSim />
        <NetworkEffectSim />
      </div>
    </div>
  );
}
```

**That's it!** 🎉

---

## 🏗️ Starting from Scratch (New Project)

### Step 1: Create Next.js Project
```bash
npx create-next-app@latest yardflow-simulations
# ✅ TypeScript: Yes
# ✅ ESLint: Yes
# ✅ Tailwind CSS: Yes
# ✅ App Router: Yes
# ✅ Import alias (@/*): Yes
```

### Step 2: Navigate & Install
```bash
cd yardflow-simulations
npm install framer-motion lucide-react
```

### Step 3: Copy Simulation Components
Copy the files from this repository:
- `/components/simulations/` → your project's `components/simulations/`

### Step 4: Run Dev Server
```bash
npm run dev
```

Visit `http://localhost:3000/simulations` to see the simulations in action.

---

## 📦 What's Included

### Core Components
| File | Purpose |
|------|---------|
| `SimulationShell.tsx` | Shared UI shell (controls, stepper, KPIs panel) |
| `DriverCheckInOutSim.tsx` | Driver experience simulation |
| `FacilityOpsSim.tsx` | Facility operations simulation |
| `NetworkEffectSim.tsx` | Network effect (C-suite) simulation |
| `index.ts` | Clean exports |

### Example Pages
| File | Purpose |
|------|---------|
| `app/simulations/page.tsx` | Full-page example with all 3 simulations |

---

## 🎯 Usage Patterns

### Pattern 1: All Three on One Page
```tsx
import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';

export default function SimulationsPage() {
  return (
    <div className="bg-gray-950 py-20">
      <div className="mx-auto max-w-7xl px-4 space-y-24">
        <DriverCheckInOutSim />
        <FacilityOpsSim />
        <NetworkEffectSim />
      </div>
    </div>
  );
}
```

### Pattern 2: Individual Simulation Pages
```tsx
// app/driver/page.tsx
import { DriverCheckInOutSim } from '@/components/simulations';

export default function DriverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <DriverCheckInOutSim />
    </div>
  );
}
```

### Pattern 3: Embed in Marketing Site
```tsx
// app/page.tsx (home page)
import { NetworkEffectSim } from '@/components/simulations';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      
      {/* Network simulation as proof point */}
      <section className="bg-gray-950 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            The Network Effect
          </h2>
          <NetworkEffectSim />
        </div>
      </section>
      
      <Pricing />
      <CTA />
    </>
  );
}
```

### Pattern 4: Tabbed Interface
```tsx
'use client';

import { useState } from 'react';
import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';

export default function TabbedSimulations() {
  const [tab, setTab] = useState<'driver' | 'facility' | 'network'>('driver');

  return (
    <div className="bg-gray-950 py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setTab('driver')}
            className={`px-6 py-3 rounded-xl font-semibold ${
              tab === 'driver'
                ? 'bg-sky-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Driver Experience
          </button>
          <button
            onClick={() => setTab('facility')}
            className={`px-6 py-3 rounded-xl font-semibold ${
              tab === 'facility'
                ? 'bg-sky-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Facility Operations
          </button>
          <button
            onClick={() => setTab('network')}
            className={`px-6 py-3 rounded-xl font-semibold ${
              tab === 'network'
                ? 'bg-sky-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Network Effect
          </button>
        </div>

        {/* Content */}
        {tab === 'driver' && <DriverCheckInOutSim />}
        {tab === 'facility' && <FacilityOpsSim />}
        {tab === 'network' && <NetworkEffectSim />}
      </div>
    </div>
  );
}
```

---

## ⚙️ Configuration

### Tailwind CSS Setup
Ensure your `tailwind.config.js` includes:

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### TypeScript Path Aliases
Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🎨 Customization Quick Reference

### Change Animation Speed
```tsx
// In each simulation component's useEffect:
const t = setInterval(() => {
  setStepIndex((i) => (i + 1) % steps.length);
}, 2400); // ← Change this (milliseconds)
```

### Edit Step Content
```tsx
// Each simulation has a steps array like this:
const steps: SimStep[] = [
  {
    id: 'unique-id',
    title: 'Step Title',
    subtitle: 'Optional subtitle',
    narration: 'The story for this step...',
    callouts: [{ title: 'Label', body: 'Detail' }],
    metrics: {
      before: [
        { key: 'metric1', label: 'Gate Time', value: '25m', emphasis: 'bad' },
      ],
      after: [
        { key: 'metric1', label: 'Gate Time', value: '3m', delta: '-88%', emphasis: 'good' },
      ],
    },
  },
  // ... more steps
];
```

### Adjust Colors
All colors use Tailwind classes:
- **Cyan glow:** `sky-400`, `sky-500`
- **Good metrics:** `emerald-400`
- **Bad metrics:** `rose-400`
- **Glass panels:** `bg-white/[0.04]`

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve 'framer-motion'"
```bash
npm install framer-motion lucide-react
```

### "Cannot find module '@/components/simulations'"
Check that:
1. Files are in `components/simulations/`
2. `tsconfig.json` has `"@/*": ["./*"]` in paths
3. You're using the App Router (Next.js 13+)

### Simulations not animating
Ensure all components are client components (`'use client'` at the top).

### Tailwind classes not applying
1. Check `tailwind.config.js` content paths include `components/**`
2. Restart dev server after changing Tailwind config
3. Clear `.next` cache: `rm -rf .next && npm run dev`

---

## 📊 Performance Tips

1. **Lazy Load:** If embedding in a long page, lazy load the simulations:
```tsx
import dynamic from 'next/dynamic';

const NetworkEffectSim = dynamic(
  () => import('@/components/simulations').then(mod => mod.NetworkEffectSim),
  { ssr: false }
);
```

2. **Intersection Observer:** Only start animations when in viewport:
```tsx
'use client';

import { useEffect, useState, useRef } from 'react';

export default function LazySimulation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible && <NetworkEffectSim />}
    </div>
  );
}
```

---

## 🎥 Video/Screenshot Capture

These simulations look great in:
- **Loom/Vidyard:** Screen recordings for async demos
- **Slides/Decks:** Screenshot "after" state with high metrics
- **Social Media:** Short clips of the before/after toggle

**Pro Tip:** Set browser to 1920x1080, zoom to 100%, record in 1080p.

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# If using Git
git add .
git commit -m "Add YardFlow simulations"
git push

# Vercel will auto-deploy
```

### Manual Build
```bash
npm run build
npm run start
```

### Static Export (if needed)
```js
// next.config.js
module.exports = {
  output: 'export',
}
```

```bash
npm run build
# Output in /out directory
```

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🤝 Support

Need help customizing? Common requests:

1. **Match existing brand colors** → Update Tailwind classes
2. **Add more steps** → Extend the `steps` array
3. **Different KPIs** → Modify the `metrics` objects
4. **Custom SVG art** → Replace the inline SVG in scene components

---

**You're all set!** 🎉

Start the dev server and visit `/simulations` to see your interactive simulations in action.
