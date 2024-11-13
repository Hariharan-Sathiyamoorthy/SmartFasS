import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

async function writeCSVFile(filePath, data) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header:['startTime', 'endTime', 'executionTime', 'containerName', 'functionName', 'executionType', 'runtime'],
    append: true // This option enables appending to the file
  });

  try {
    await csvWriter.writeRecords(data);
    console.log('CSV file written successfully');
  } catch (error) {
    console.error('Error writing CSV file', error);
  }
}

export default writeCSVFile;