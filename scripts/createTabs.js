const { google } = require('googleapis');
require('dotenv').config();

const spreadsheetId = '1plBGxddAlUz6QLHi-A5j22-bujqQuRLLYdOst0C-lxw';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

const tabTitles = [
  'Strategic Planning',
  'Cross-Border Tax Planning',
  'RCBI Tracker',
  'Legal Preparation',
  'Document Summaries',
  'Lifestyle Optimization',
  "Children's Planning"
];

async function addTabs() {
  try {
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = sheetMeta.data.sheets.map(sheet => sheet.properties.title);

    const requests = tabTitles
      .filter(title => !existingTitles.includes(title))
      .map(title => ({
        addSheet: {
          properties: {
            title,
            gridProperties: { rowCount: 100, columnCount: 20 }
          }
        }
      }));

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests }
      });
      console.log('Tabs created successfully.');
    } else {
      console.log('All tabs already exist.');
    }
  } catch (error) {
    console.error('Error creating tabs:', error);
  }
}

addTabs();
