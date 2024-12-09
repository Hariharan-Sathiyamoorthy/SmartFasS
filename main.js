import os from 'os';
import getRuntime from './utils/getRuntime.js';
import checkWarmContainer from './utils/checkWarmContainer.js';
import installNpmPackage from './utils/cache.js';
import executeContainer from './utils/execution.js';
import readCSVFile from './utils/readCSVfile.js';
import writeCSVFile from './utils/writeCSVfile.js';
import executeOpenwhisk from './utils/executeOpenwhisk.js';


const homeDir = os.homedir();
const args = process.argv.slice(2);

/**
 * Main class
 * @class
 * @param {Array} args - Command line arguments
 * @param {Function} sleep - Function to sleep for a given time
 * @param {Function} initiator - Function to execute the node app inside Docker containers 
 * @param {Function} orchestrator - Function to orchestrate Docker containers
 * @param {Function} openWhisk - Function to execute openwhisk with Jmeter
 */


class Main {
    constructor(args) {
        this.args = args;
        this.today = new Date(Date.now());
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async initiator() {
        try {
            const { executionType, containerName } = await checkWarmContainer('node',homeDir);
            if (executionType === 'cold') {
                const msg = await installNpmPackage(containerName, this.args,homeDir);
            }
            const { execOutput, killOutput, removeOutput, executionTime } = await executeContainer(containerName, this.args, executionType,homeDir);
            const data = [{
                time: new Date().toISOString(),
                containerName,
                executionType,
                executionTime
            }]
            await writeCSVFile(`${homeDir}/SmartFasS/logs/results/IntiatorOutput2_${this.today.toISOString().slice(0,10)}.csv`, data);

        } catch (error) {
            console.error('Error in initiator:', error);
            process.exit(1);
        }
    }

    async orchestrator() {
        try {
            const data = await readCSVFile(`${homeDir}/SmartFasS/dataset/ML_Delays2.csv`);
            let count = 0;
            for (const row of data) {
                if (count <= 412) {
                console.log('Starting Orchetration');
                const runtime = await getRuntime(this.args);
                const { executionType, containerName } = await checkWarmContainer(runtime,homeDir);
                if (executionType === 'cold') {
                    const msg = await installNpmPackage(containerName, this.args,homeDir);
                }
                console.log('Orchetration Complete:', containerName, executionType);
                console.log('sleeping for:', parseInt(row.wait));
                await this.sleep(parseInt(row.wait));
                }else{
                    break;
                }
                count++;
            };
        } catch (error) {
            console.error('Error reading CSV file:', error);
            process.exit(1);
        }
    }

    async openWhisk() {
        try {
            const {executionTime,func} = await executeOpenwhisk(this.args,homeDir);
            const data = [{
                time: new Date().toISOString(),
                func,
                executionTime
            }]
            await writeCSVFile(`${homeDir}/SmartFasS/logs/results/OpenWhiskOutput_${this.today.toISOString().slice(0,10)}.csv`, data);
        } catch (error) {
            console.error('Error in openWhisk:', error);
            process.exit(1);
        }
    }
}


const main = new Main(args);

switch (args[1]) {
    case 'orchestrate':
        main.orchestrator();
        break;
    case 'initiate':
        main.initiator();
        break;
    case 'openwhisk':
        main.openWhisk();
        break;
    default:
        console.log('Invalid argument');
        break;
}


