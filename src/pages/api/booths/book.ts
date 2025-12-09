// src/pages/api/booths/book.ts
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { boothId, category } = req.body as {
      boothId?: string;
      category?: string;
    };

    if (!boothId || !category) {
      return res.status(400).json({
        success: false,
        message: 'boothId and category are required',
      });
    }

    const sheets = await getSheetsClient();

    const bookedTime = new Date().toISOString();
    const values = [[boothId, category, 'booked', bookedTime]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error booking booth:', error);
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        error?.response?.data?.error?.message ||
        'Server error when booking booth',
    });
  }
}
