import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          YardFlow Simulations
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Interactive before/after demonstrations of how YardFlow transforms yard operations
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/simulations"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View Simulations
          </Link>
        </div>
      </div>
    </main>
  );
}
