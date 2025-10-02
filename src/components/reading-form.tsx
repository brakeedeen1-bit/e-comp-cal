'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { addReading, updateReading } from '@/app/actions';
import { useToast } from './ui/use-toast';
import { useEffect, useState } from 'react';
import type { Reading } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useFormState } from 'react-dom';

const readingSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  value: z.coerce.number().min(1, 'Reading must be a positive number.'),
});

type ReadingFormProps = {
  reading?: Reading;
  lastReadingValue: number;
  isOpen?: boolean;
  onClose?: () => void;
};

export function ReadingForm({ reading, lastReadingValue, isOpen = false, onClose }: ReadingFormProps) {
  const isEditMode = !!reading;
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof readingSchema>>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      id: reading?.id || '',
      date: reading ? format(new Date(reading.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      value: reading?.value || undefined,
    },
  });
  
  useEffect(() => {
    setIsDialogOpen(isOpen);
    if(isOpen && reading) {
        form.reset({
            id: reading.id,
            date: format(new Date(reading.date), 'yyyy-MM-dd'),
            value: reading.value,
        });
    } else if (!isOpen) {
        form.reset({ date: format(new Date(), 'yyyy-MM-dd'), value: undefined });
    }
  }, [isOpen, reading, form]);

  const action = isEditMode ? updateReading : addReading;
  const [formState, formAction] = useFormState(action, { message: '' });

  useEffect(() => {
    if (formState.message) {
      if (formState.errors) {
        toast({
          title: 'Error',
          description: formState.message,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Success', description: formState.message });
        handleClose();
      }
    }
  }, [formState, toast]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsDialogOpen(false);
    form.reset({ date: format(new Date(), 'yyyy-MM-dd'), value: undefined });
  };
  
  const FormContent = (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {isEditMode && <input type="hidden" {...form.register('id')} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* Hidden input to ensure the date value is submitted with the form */}
                <input type="hidden" {...field} value={field.value || ''} />
                <FormMessage>{(formState.errors as any)?.date}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter Reading (kWh)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 15240" {...field} />
                </FormControl>
                 <FormDescription>
                  Last reading: {lastReadingValue.toLocaleString()} kWh
                </FormDescription>
                <FormMessage>{(formState.errors as any)?.value}</FormMessage>
              </FormItem>
            )}
          />
        </div>
         <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Reading'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
  
  if (isEditMode) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Reading</DialogTitle>
                    <DialogDescription>
                        Update the details for your reading on {reading?.date ? format(new Date(reading.date), 'PPP') : 'this date'}.
                    </DialogDescription>
                </DialogHeader>
                {FormContent}
            </DialogContent>
        </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Reading
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Reading</DialogTitle>
          <DialogDescription>Enter the latest reading from your electricity meter.</DialogDescription>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  );
}
