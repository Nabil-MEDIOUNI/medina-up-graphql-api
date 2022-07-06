const { google } = require('googleapis');

exports.client = new google.auth.JWT(
  process.env.client_email,
  null,
  process.env.private_key.replace(/\\n/gm, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets'],
);
