#!/usr/bin/env node
/**
 * TODO:
 * Connect to Redis Database
 * Check the file format and implement and only resitrict with node js
 * 
 */

import { createClient } from 'redis';

const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

await client.set('key', 'value');
const value = await client.get('key');
console.log(value)
await client.disconnect();
const args = process.argv;
const argCount = process.argv.length;

console.log(argCount);



// let functionArg;
// if (argCount >= 2) {
//     functionArg = process.argv[2];
// }

// Function to check the runtime of the function and validate if it is the right input
// function runtime() {
//     if (argCount === 2) {
//         if (fs.existsSync(functionArg)) {
//             const ext = path.extname(functionArg).substring(1);

//             if (ext) {
//                 switch (ext) {
//                     case 'py':
//                         console.log("\nRuntime is Python!\n");
//                         return "python";
//                     case 'js':
//                         console.log("\nRuntime is JavaScript!\nAt this point function does not support JavaScript! Quitting!\n");
//                         process.exit();
//                     case 'rb':
//                         console.log("\nRuntime is Ruby!\nAt this point function does not support Ruby! Quitting!\n");
//                         process.exit();
//                     case 'jar':
//                         console.log("\nRuntime is Java!\nAt this point function does not support Java! Quitting!\n");
//                         process.exit();
//                     case 'php':
//                         console.log("\nRuntime is PHP!\nAt this point function does not support PHP! Quitting!\n");
//                         process.exit();
//                     case 'swift':
//                         console.log("\nRuntime is Swift!\nAt this point function does not support Swift! Quitting!\n");
//                         process.exit();
//                     case 'go':
//                         console.log("\nRuntime is Go!\nAt this point function does not support Go! Quitting!\n");
//                         process.exit();
//                     default:
//                         console.log("\nUnknown runtime! Quitting!\n");
//                         process.exit();
//                 }
//             } else {
//                 console.log("\nRuntime could not be identified! Quitting!\n");
//                 process.exit();
//             }
//         } else {
//             console.log(`\nThe specified function - ${functionArg} could not be found!\nPlease check the input again!\nQuitting the execution now!\n`);
//             process.exit();
//         }
//     } else if (argCount > 2) {
//         console.log("\nThere are more than one functions found! Please enter only one at a time!\nQuitting the execution now!\n");
//         process.exit();
//     } else if (argCount === 1) {
//         console.log("\nNo function found to execute! Quitting!\nQuitting the execution now!\n");
//         process.exit();
//     }
// }




// if (functionArg && functionArg.toLowerCase() === "forecast") {
//     forecast();
// } else {
//     const env = runtime();
// }