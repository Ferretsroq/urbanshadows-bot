import path from 'node:path';
import process from 'node:process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import * as fs from 'fs';
import { Character } from './characters.js';

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'service-credentials.json');

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
  // Authenticate with Google and get an authorized client.
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    keyFile: CREDENTIALS_PATH,
  });

  // Create a new Sheets API client.
  const sheets = google.sheets({version: 'v4', auth: auth});
  // Get the values from the spreadsheet.
  const result = await sheets.spreadsheets.values.get({
    //spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    spreadsheetId: '1fyNsFujj6BAK-TBVHFx2Bqt2KTtGnV4RBYwfAuaslKc',
    range: 'The Aware',
  });
  const rows = result.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  return rows;
  //fs.writeFileSync('data', String(rows), 'utf8');
  // Print the name and major of each student.
  //rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    //console.log(`${row[0]}, ${row[4]}`);
    //console.log(row);
 // });
}

function TransformCoordinates(rangeString)
{
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const preConvert = rangeString.split(':')[0].match(/[a-zA-Z]+|[0-9]+/g);
    const columnPre = preConvert[0];
    const rowPre = preConvert[1];
    console.log(preConvert);
    const rowPost = Number(rowPre) - 1;
    let columnValue = 0;
    for(let letterIndex = 0; letterIndex < columnPre.length; letterIndex++)
    {
        const letterValue = alphabet.indexOf(columnPre[letterIndex]);
        columnValue += letterValue + (letterIndex * 26)

    }
    const columnPost = columnValue;
    console.log(rowPost);
    console.log(columnPost);
    console.log('---');
    return [rowPost, columnPost];
}
//TransformCoordinates("A1");
//TransformCoordinates("O14");
/*const rows = await listMajors();
const test0 = TransformCoordinates("B18:O19");
console.log(rows[test0[0]][test0[1]]);
const test1 = TransformCoordinates("AG4:AI4");
console.log(rows[test1[0]][test1[1]]);*/

//await listMajors();

const foo = new Character(JSON.parse(fs.readFileSync("awareManifest.json")), await listMajors(), "Foo");
console.log(foo.toString());
//console.log(foo);