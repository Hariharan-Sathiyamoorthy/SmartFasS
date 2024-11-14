import getRuntime from './utils/getRuntime.js';
import checkWarmContainer from './utils/checkWarmContainer.js';
import installNpmPackage from './utils/cache.js';
import executeContainer from './utils/execution.js';
import readCSVFile from './utils/readCSVfile.js';
import writeCSVFile from './utils/writeCSVfile.js';
import executeOpenwhisk from './utils/executeOpenwhisk.js';

/**
 * 
 * Error handling pending
 * code cleanse
 */

const args = process.argv.slice(2);



class Main {
    constructor(args) {
        this.args = args;
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
 * Initiates the process by checking for a warm container, installing necessary npm packages if the container is cold,
 * executing the container, and logging the execution details to a CSV file.
 *
 * @async
 * @function initiator
 * @param {Object} this.args - The arguments to be passed to the container.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
    async initiator() {
        try {
            const { executionType, containerName } = await checkWarmContainer('node');
            if (executionType === 'cold') {
                const msg = await installNpmPackage(containerName, this.args);
            }
            const { execOutput, killOutput, removeOutput, executionTime } = await executeContainer(containerName, this.args, executionType);
            const data = [{
                time: new Date().toISOString(),
                containerName,
                executionType,
                executionTime,
                execOutput,
            }]
            await writeCSVFile('/home/hari73118/project/logs/logger_output.csv', data);

        } catch (error) {
            console.error('Error in initiator:', error);
            process.exit(1);
        }
    }
    /**
     * Orchestrates the process by reading data from a CSV file, checking for a warm container,
     * installing necessary npm packages if the container is cold, and executing the container.
     * The process is repeated for a specified number of times with delays between each execution.
     *
     * @async
     * @function orchestrator
     * @param {Object} this.args - The arguments to be passed to the container.
     * @returns {Promise<void>} - A promise that resolves when the orchestration process is complete.
     */
    async orchestrator() {
        try {
            const data = await readCSVFile('/home/hari73118/project/dataset/ML_Delays.csv');
            for (const row of data) {
                console.log('Starting Orchetration');
                const runtime = await getRuntime(this.args);
                const { executionType, containerName } = await checkWarmContainer(runtime);
                if (executionType === 'cold') {
                    const msg = await installNpmPackage(containerName, this.args);
                }
                console.log('Orchetration Complete:', containerName, executionType);
                console.log('sleeping for:', parseInt(row.wait));
                await this.sleep(parseInt(row.wait));
            };
        } catch (error) {
            console.error('Error reading CSV file:', error);
            process.exit(1);
        }
    }
    /**
     * Executes an OpenWhisk action with the provided arguments and logs any errors that occur.
     *
     * @async
     * @function openWhisk
     * @param {Object} this.args - The arguments to be passed to the OpenWhisk action.
     * @returns {Promise<void>} - A promise that resolves when the OpenWhisk action execution is complete.
     */
    async openWhisk() {
        try {
            const executionTime = await executeOpenwhisk(this.args);
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


