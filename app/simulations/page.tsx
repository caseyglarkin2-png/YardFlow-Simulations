'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Building2, Network } from 'lucide-react';
import SimulationShell from '@/components/SimulationShell';
import { ScenarioType } from '@/data/scenarios';

type TabType = 'driver' | 'facility' | 'network';

export default function SimulationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('driver');

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'driver', label: 'Driver', icon: Truck },
    { id: 'facility', label: 'Facility Ops', icon: Building2 },
    { id: 'network', label: 'Network', icon: Network },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0f1729] to-[#0b1220]">
      {/* Subtle noise texture */}
      <div 
        className="fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.05),transparent_50%)]" />

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
                YardFlow Simulations
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Deterministic simulations showing the operational mechanics of YardFlow YNS.
                Watch workflows transform from manual friction to digital orchestration.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
          <div className="container mx-auto px-6">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-6 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
                  >
                    <div className={`flex items-center gap-2 ${
                      isActive ? 'text-cyan-400' : 'text-white/50 hover:text-white/70'
                    }`}>
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </div>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Simulation Content */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SimulationShell scenarioType={activeTab as ScenarioType} />
          </motion.div>
        </div>

        {/* Footer Note */}
        <div className="container mx-auto px-6 py-12">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6">
            <div className="text-sm text-white/60 leading-relaxed">
              <strong className="text-white/80">About these simulations:</strong> Each scenario is a deterministic
              state machine driven by timestamped events. Metrics are computed from the event stream, not randomized.
              The "Before" scenarios model manual workflows with friction (paperwork, phone calls, delays). The "After"
              scenarios show YardFlow's digital orchestration (QR scan, instant routing, exception handling). Press Play
              to watch the complete journey unfold.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
