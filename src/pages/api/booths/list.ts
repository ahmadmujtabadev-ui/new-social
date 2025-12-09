// src/pages/api/booths/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import {
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_TAB,
  GOOGLE_SHEETS_SCOPES,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
} from '@/config/apiconfig';

const SCOPES = GOOGLE_SHEETS_SCOPES;
const SERVICE_ACCOUNT_EMAIL = GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

const SPREADSHEET_ID = GOOGLE_SHEET_ID;
const SHEET_NAME = GOOGLE_SHEET_TAB;

async function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: SCOPES,
  });
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

interface BoothData {
  b_boothID: string;
  b_category: string;
  b_status: 'booked' | 'available';
  b_bookedTime: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const sheets = await getSheetsClient();

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
    });

    const rows = result.data.values || [];

    const data: BoothData[] = rows.slice(1).map((row) => ({
      b_boothID: row[0] || '',
      b_category: row[1] || '',
      b_status: (row[2] || 'available') as 'booked' | 'available',
      b_bookedTime: row[3] || '',
    }));

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching booths:', error);
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        error?.response?.data?.error?.message ||
        'Failed to fetch booth data',
    });
  }
}
