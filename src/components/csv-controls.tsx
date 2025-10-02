'use client';

import { Button } from './ui/button';
import { FileDown, FileUp } from 'lucide-react';
import type { Reading } from '@/lib/types';
import { useRef } from 'react';
import { useToast } from './ui/use-toast';
import { importReadings } from '@/app/actions';

type CsvControlsProps = {
  readings: Reading[];
};

export function CsvControls({ readings }: CsvControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    if (readings.length === 0) {
      toast({ title: 'No Data', description: 'There are no readings to export.', variant: 'destructive' });
      return;
    }
    const headers = ['date', 'value'];
    const csvContent = [
      headers.join(','),
      ...readings.map(r => `${r.date},${r.value}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = `voltview_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Successful', description: 'Your readings have been downloaded.' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        if(headers[0] !== 'date' || headers[1] !== 'value') {
            throw new Error('Invalid CSV headers. Expected "date,value".');
        }

        const readingsToImport: Reading[] = lines.slice(1).map((line, index) => {
          const [date, value] = line.split(',');
          return {
            id: `import-${index}`,
            date: date.trim(),
            value: parseFloat(value.trim()),
          };
        });
        
        const result = await importReadings(readingsToImport);

        if(result.error) {
            toast({ title: 'Import Failed', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Import Successful', description: result.message });
        }

      } catch (error: any) {
        toast({ title: 'Import Failed', description: error.message || 'Could not parse CSV file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <FileDown className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={handleImportClick}>
        <FileUp className="mr-2 h-4 w-4" />
        Import
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".csv"
      />
    </div>
  );
}
