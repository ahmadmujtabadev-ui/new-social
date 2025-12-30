// src/config/apiconfig.ts

// ================= PUBLIC / FRONTEND-SAFE VALUES =================

// Base backend API (your Node server)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://social-be-roan.vercel.app";
  // http://localhost:5000/
  // https://social-be-roan.vercel.app

// Public sheet ID extracted from your URL
export const GOOGLE_SHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SHEET_ID ||
  '1B7s54EipqjSe5GG2SZlkoGJMeryBhYDKrP3AHKRMrEg';

// Optional: full sheet URL (safe for frontend)
export const GOOGLE_SHEET_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
  'https://docs.google.com/spreadsheets/d/1B7s54EipqjSe5GG2SZlkoGJMeryBhYDKrP3AHKRMrEg/edit?gid=0#gid=0';

// The sheet tab name
export const GOOGLE_SHEET_TAB =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';

// ================= SERVER-ONLY SECRETS (DO NOT USE IN CLIENT) =================

// OAuth scopes for Google Sheets
export const GOOGLE_SHEETS_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

// Service account email from your JSON
export const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  'sheets@pivotal-realm-480702-m9.iam.gserviceaccount.com';

// Service account private key from your JSON
// Kept as a single string with explicit \n line breaks.
export const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+aK1lq2TpmbF7\n' +
  '7zMXHFwpWZzRnzCJZ3VKgOWlWWYHR7so6Y5p2Au3mHPGJ135srPMYv1fFJ+wvFY6\n' +
  'Jw/xwmhVOzFhEqRiJ4nDCTozQM2E1OXZQsVuiIAgXXGoWjH6z7/MPLsGZF9Ncq5g\n' +
  '50UBwHINbTBHRL7r8l+9faxUj5iAROso0AHqjF6qK7aTosyVb4a3ODddbHEpGnt2\n' +
  'o6LWJ5XR9jvpnYYgfyRWO2Uxx15QMwgva6TJmk+IUyg1Hopt5hyCteYOoAk4g6IO\n' +
  '0syJvmFeXWD39HB01LkCKET3YwRFTea0bepYxixNf4ucPO63XSAUk8I2fd7jqzCk\n' +
  'bt1DnQtLAgMBAAECggEAUKkCT2/4SzcG5yPw5ijm58Nk+a3wfzybBMkuv0lsPchG\n' +
  'wjGSWUciy48i+D3EAxuPLBWBFO6lKVbXRkI28Gi1DuoI5IDjrwrlwn/drkmU5mDT\n' +
  'z6IIBeeAM3WySKmQw5mPO+M8LRyG/MWIlldSNchC6GopSf+Wy1f888ZRou7DoQ4V\n' +
  '3Tk6FAxGpVTW0TavK7m3AQIWn9oEhKIUjbNnaJq5FH82ilRAalr4cgGxJjKHQrHs\n' +
  'TVJZKnAAbu/f5yPyZL2Vk9e8DHyHQGSRt77tcrdBd+ABu9pwG7V+n8Vca+oex1G4\n' +
  'a61EOVLVykAdM17MDZvQiTugz6IS3gcsvwNL4GlQ4QKBgQDiUW0FlxqYaK+/7Ror\n' +
  'IYWj1yxuccATDVDsUXFohyqeTKzY5hzzygptEP1E7CApOfEPuIbeAQLAJ70mYgMt\n' +
  'k30xTpXROSpLZ0HUfLs/HPRPsmfsBfmfUoY+Ha5rblTPq598+z3kj+KR+tQB4LIp\n' +
  'h4Z6WRTxQobvhfCBm+/Goq1qqwKBgQDXYZwUadkurvYntyGyaUJ9SNoVARQm57vF\n' +
  'nb5guTRXomwsRI3gGRhpAu7EoSXJEIxUTdXgF7+vzvDff8JOJy4ZZuAOTaMvcd3g\n' +
  'uqnTEzM70L8bWGpBAd7YwFa3N3QHAd2XI1t2x2Y6O+UYrYMhnXptFkCUBIpgFpMO\n' +
  '6YNkG1bh4QKBgBesGrI1/vMoKBH0NAOE6xybGiunPEcB4pAFaM5dLQkHziCV2Ttq\n' +
  'y7Jiz4sRA8AsLlnNnFXGV0pQHcnRALIYtkSdCrCqwRDICSu3rEJKvgdECvi2G0kd\n' +
  '8aq3ohHcpYRfWDxTb0LkBffs+5YCscAES/2qKbWelsyg/uofrHHjfC4nAoGBAKud\n' +
  'vzwUy1UDXGhw54y9iplBf2PVJDWL2HayJovzht19Mixjw5iY5nZmO9K5hN4dLXPP\n' +
  'QWf6BGcVwaCUsEKNvZHIAyfifPDFDkKO+dqSJfS3dE9Zt/BsiSC0wWPj77PVrLdN\n' +
  'GQggAjjMmNN9Dkuuq2pYnMRUid3envb24hbWIfiBAoGARANY6KS+smWkev3XIJEw\n  ' +
  'lAvL3rkVmVfH3IpTUTLON2+1C4jCISaCLPiVOrCCMZ9Vs9avRhu8kzYIaoLNEVFl\n' +
  'TnSAsPBDel3MPPK4vD5Sj4Jfkl0ZkoqhONp9/pSFd5REkaQb1ttMb79wbwFH1H22\n' +
  'D5BEvVtr6Wwa3UWrVRS36Yc=\n' +
  '-----END PRIVATE KEY-----\n';
