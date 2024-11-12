import fs from 'fs';
import csvParser from 'csv-parser';


async function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {results.push(data)})
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export default readCSVFile;