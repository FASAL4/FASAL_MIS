import * as fs from 'fs';
import csv from 'csv-parser';

let count = 0;
fs.createReadStream('DEHAT_Cleaned_Data_with_Acres.csv')
  .pipe(csv())
  .on('headers', (headers) => {
    console.log("Headers:");
    console.log(headers);
  })
  .on('data', (data) => {
    if (count < 2) {
      console.log("Row", count, ":", data);
      count++;
    } else {
      process.exit(0);
    }
  });
