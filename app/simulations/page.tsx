import SimulationShell from "@/components/SimulationShell";

export default function SimulationsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  return <SimulationShell initialSearchParams={searchParams ?? {}} />;
}
