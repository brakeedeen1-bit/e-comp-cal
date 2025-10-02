import { Zap } from 'lucide-react';
import { CsvControls } from './csv-controls';
import { ThemeToggle } from './theme-toggle';
import { getReadings } from '@/lib/data';
import { ReadingForm } from './reading-form';

export async function Header() {
  const readings = await getReadings();
  const lastReadingValue = readings.length > 0 ? readings[readings.length - 1].value : 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">VoltView</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <CsvControls readings={readings} />
        <ThemeToggle />
        <ReadingForm lastReadingValue={lastReadingValue} />
      </div>
    </header>
  );
}
