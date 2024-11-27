import { exec } from 'child_process';
import util from 'util';
import { performance } from 'perf_hooks';
import writeCSVFile from './writeCSVfile.js';
const execPromise = util.promisify(exec);
const executeContainer = async (containerName, args,executionType,homeDir) => {
    console.log(args);
    try {
        const {stdout} = await execPromise(`sudo docker cp  ${homeDir}/project/${args[0]} ${containerName}:/root/`);
        console.log(stdout); 
        const startTime = performance.now();
        const {stdout: execOutput} = await execPromise(`sudo docker exec -i ${containerName} node /root/${args[0]}`);
        const endTime = performance.now();
        const {stdout: killOutput} = await execPromise(`sudo docker kill ${containerName}`);
        const {stdout: removeOutput} = await execPromise(`sudo docker rm ${containerName}`);
        console.log('Total Execution time',endTime - startTime);  
        // write the output to csv file 
       

        return {execOutput,executionTime:endTime - startTime};
    } catch (error) {
        console.error(error);
        // process.exit(1);
        return;
    }
}

export default executeContainer;