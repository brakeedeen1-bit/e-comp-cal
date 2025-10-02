'use server';

import pool from './db';
import type { Reading } from './types';
import { format } from 'date-fns';

export async function getReadings(): Promise<Reading[]> {
  const [rows] = await pool.query(
    'SELECT id, date, value FROM readings ORDER BY date DESC'
  );
  
  const readings = rows as Reading[];
  
  return readings.map(row => ({
    ...row,
    date: format(new Date(row.date), 'yyyy-MM-dd'),
  }));
}

export async function addReading(reading: Omit<Reading, 'id'>): Promise<Reading> {
  const id = crypto.randomUUID();
  const newReading = { ...reading, id };
  await pool.query('INSERT INTO readings (id, date, value) VALUES (?, ?, ?)', [
    newReading.id,
    newReading.date,
    newReading.value,
  ]);
  return newReading;
}

export async function updateReading(reading: Reading): Promise<void> {
  await pool.query('UPDATE readings SET date = ?, value = ? WHERE id = ?', [
    reading.date,
    reading.value,
    reading.id,
  ]);
}

export async function deleteReading(id: string): Promise<void> {
  await pool.query('DELETE FROM readings WHERE id = ?', [id]);
}

export async function importReadings(readingsToImport: Reading[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const reading of readingsToImport) {
            await connection.query('INSERT INTO readings (id, date, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?', [
                reading.id,
                reading.date,
                reading.value,
                reading.value
            ]);
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
