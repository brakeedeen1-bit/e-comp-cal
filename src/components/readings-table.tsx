'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { FilePenLine, Trash2 } from 'lucide-react';
import type { ReadingWithConsumption } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteReading } from '@/app/actions';
import { useToast } from './ui/use-toast';
import { useState } from 'react';
import { ReadingForm } from './reading-form';
import { format } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';


type ReadingsTableProps = {
  readings: ReadingWithConsumption[];
};

export function ReadingsTable({ readings }: ReadingsTableProps) {
  const { toast } = useToast();
  const [editingReading, setEditingReading] = useState<ReadingWithConsumption | null>(null);

  const handleDelete = async (id: string) => {
    const result = await deleteReading(id);
    if (result.message) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({
        title: 'Error',
        description: result.message || 'Failed to delete reading.',
        variant: 'destructive',
      });
    }
  };
  
  const lastReadingValue = readings.length > 0 ? readings[readings.length - 1].value : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Readings History</CardTitle>
          <CardDescription>
            A log of all your submitted meter readings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Reading (kWh)</TableHead>
                  <TableHead className="text-right">Consumption (kWh)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.length > 0 ? (
                  readings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell>{format(new Date(reading.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">{reading.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        {reading.consumption > 0 ? reading.consumption.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingReading(reading)}>
                          <FilePenLine className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this reading.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(reading.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )).reverse()
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No readings found. Add one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      {editingReading && (
        <ReadingForm
          reading={editingReading}
          isOpen={!!editingReading}
          onClose={() => setEditingReading(null)}
          lastReadingValue={lastReadingValue}
        />
      )}
    </>
  );
}
