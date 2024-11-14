import getRuntime  from './utils/getRuntime.js';
import checkWarmContainer from './utils/checkWarmContainer.js';
import installNpmPackage from './utils/cache.js';
import executeContainer from './utils/execution.js';
import readCSVFile from './utils/readCSVfile.js';
import writeCSVFile from './utils/writeCSVfile.js';


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
                if(executionType === 'cold') {
                    const msg = await installNpmPackage(containerName, this.args);
                } 
                const {execOutput,killOutput,removeOutput,executionTime} = await executeContainer(containerName, this.args,executionType);
                const data = [{
                    time: new Date().toISOString(),
                    containerName,
                    executionType,
                    executionTime,
                    execOutput,
                }]
                await writeCSVFile('/home/hari73118/project/logs/logger_output.csv',data);
                
        } catch (error) {
            console.error('Error in initiator:', error);
            process.exit(1);
        }
    }
    async orchestrator() {
        try {
            const data = await readCSVFile('/home/hari73118/project/dataset/gru_wait_delay.csv');
            let count = 0;
            for (const row of data) {
                if(count <= 20) {
                    console.log('Starting Orchetration');

                    const runtime = await getRuntime(this.args);
                    const { executionType, containerName } = await checkWarmContainer(runtime);
                    if(executionType === 'cold') {
                        const msg = await installNpmPackage(containerName, this.args);  
                    }
                    console.log('Orchetration Complete:',containerName,executionType);
                    console.log('sleeping for:',parseInt(row.wait));
                    await this.sleep(parseInt(row.wait));
                }else {
                    console.log('End of Run');
                    break;
                }
                count++;
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


