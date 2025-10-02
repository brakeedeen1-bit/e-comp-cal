'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
    getReadings, 
    addReading as dbAddReading,
    updateReading as dbUpdateReading,
    deleteReading as dbDeleteReading,
    importReadings as dbImportReadings
} from '@/lib/data';
import type { Reading } from '@/lib/types';
import { format } from 'date-fns';

const SECRET_CODE = '2025dd'; // Hardcoded secret code

const ReadingSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  value: z.coerce.number().positive('Reading must be a positive number.'),
});

async function validateAndPrepare(formData: FormData): Promise<{data?: Omit<Reading, 'id'> & { id?: string }; errors?: any; message?: string; secretCode?: string}> {
    const rawFormData = {
        id: formData.get('id')?.toString(),
        date: formData.get('date') as string,
        value: formData.get('value'),
        secretCode: formData.get('secretCode') as string,
    };
  
    const validatedFields = ReadingSchema.safeParse(rawFormData);
  
    if (!validatedFields.success) {
      return {
        message: 'Invalid data provided.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    return { data: validatedFields.data, secretCode: rawFormData.secretCode };
}

export async function addReading(prevState: any, formData: FormData) {
  const { data, errors, message, secretCode } = await validateAndPrepare(formData);

  if (errors) {
    return { message, errors };
  }

  if (secretCode !== SECRET_CODE) {
    return { message: 'Incorrect secret code.' };
  }

  if (data) {
    try {
        await dbAddReading({ date: data.date, value: data.value });
        revalidatePath('/');
        return { message: 'Reading added successfully.' };
    } catch (e: any) {
        if (e.code === 'ER_DUP_ENTRY') {
            return { message: `A reading for ${data.date} already exists.` }
        }
        return { message: 'Failed to add reading.' };
    }
  }
  
  return { message: 'An unknown error occurred.' };
}

export async function updateReading(prevState: any, formData: FormData) {
  const { data, errors, message, secretCode } = await validateAndPrepare(formData);

  if (errors) {
    return { message, errors };
  }

  if (secretCode !== SECRET_CODE) {
    return { message: 'Incorrect secret code.' };
  }

  if (data && data.id) {
    try {
        await dbUpdateReading({ id: data.id, date: data.date, value: data.value });
        revalidatePath('/');
        return { message: 'Reading updated successfully.' };
    } catch (e: any) {
        if (e.code === 'ER_DUP_ENTRY') {
            return { message: `A reading for ${data.date} already exists.` }
        }
        return { message: 'Failed to update reading.' };
    }
  }

  return { message: 'Reading ID not found.' };
}

export async function deleteReading(id: string, secretCode: string) {
  if (secretCode !== SECRET_CODE) {
    return { message: 'Incorrect secret code.' };
  }
  try {
    await dbDeleteReading(id);
    revalidatePath('/');
    return { message: 'Reading deleted successfully.' };
  } catch (e) {
    return { message: 'Failed to delete reading.' };
  }
}

export async function importReadings(readingsToImport: Reading[]) {
  // Assuming import does not require secret code for now, or it's handled elsewhere.
  // If needed, the secret code would need to be passed here as well.
  try {
    if (!Array.isArray(readingsToImport) || readingsToImport.length === 0) {
      return { error: 'No valid readings to import.' };
    }
    const validReadings = readingsToImport.map(r => ({
      ...r,
      id: r.id || crypto.randomUUID(),
      date: format(new Date(r.date), 'yyyy-MM-dd')
    }));

    await dbImportReadings(validReadings);
    revalidatePath('/');
    return { message: `${validReadings.length} readings imported successfully.` };
  } catch (e) {
    return { error: 'Failed to import readings.' };
  }
}