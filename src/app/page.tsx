import { getReadings } from '@/lib/data';
import { calculateConsumptionData } from '@/lib/analysis';
import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/header';

export default async function Home() {
  const readings = await getReadings();
  const processedReadings = calculateConsumptionData(readings);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Dashboard initialReadings={processedReadings} />
      </main>
    </div>
  );
}
