import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'service-credentials.json');


async function getFields(sheetName) {
  // Authenticate with Google and get an authorized client.
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: CREDENTIALS_PATH,
  });

  // Create a new Sheets API client.
  const sheets = google.sheets({version: 'v4', auth: auth});
  // Get the values from the spreadsheet.
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: '1fyNsFujj6BAK-TBVHFx2Bqt2KTtGnV4RBYwfAuaslKc',
    range: sheetName,
  });
  const rows = result.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  return rows;
}

export {getFields};