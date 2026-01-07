import { DriverCheckInOutSim, FacilityOpsSim, NetworkEffectSim } from '@/components/simulations';

export default function SimulationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            YardFlow Simulations
          </h1>
          <p className="mt-4 text-lg text-white/70">
            See the before/after difference across driver experience, facility operations, and network effects.
          </p>
        </div>

        <div className="space-y-20">
          <section id="driver-sim">
            <DriverCheckInOutSim />
          </section>

          <section id="facility-sim">
            <FacilityOpsSim />
          </section>

          <section id="network-sim">
            <NetworkEffectSim />
          </section>
        </div>
      </div>
    </main>
  );
}
