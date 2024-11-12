import getRuntime  from './utils/getRuntime.js';
import checkWarmContainer from './utils/checkWarmContainer.js';
import installNpmPackage from './utils/cache.js';
import executeContainer from './utils/execution.js';
import readCSVFile from './utils/readCSVfile.js';


const args = process.argv.slice(2);
const argCount = args.length;


class Main {
    constructor(args) {
        this.args = args;
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async initiator() {
        try {
            const { executionType, containerName } = await checkWarmContainer('node');
            const exec = await executeContainer(containerName, this.args);
        } catch (error) {
            console.error('Error in initiator:', error);
            process.exit(1);
        }
    }
    async orchestrator() {
        try {
            const data = await readCSVFile('/home/hari73118/project/dataset/gru_wait_delay.csv');
            for (const row of data) {
                console.log('row:', row.wait);
                const runtime = await getRuntime(this.args);
                const { executionType, containerName } = await checkWarmContainer(runtime);
                console.log('executionType:', executionType);
                this.containerName = containerName;
                const msg = await installNpmPackage(containerName, this.args);
                await this.sleep(parseInt(row.wait));
            };
        } catch (error) {
            console.error('Error reading CSV file:', error);
            process.exit(1);
        }
    }
}


const main = new Main(args);
//orchestrate
if (args[1] === 'orchestrate') main.orchestrator();

//initiate
if (args[1] === 'initiate') main.initiator();


