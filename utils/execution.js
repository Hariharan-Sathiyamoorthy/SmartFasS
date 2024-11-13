import { exec } from 'child_process';
import util from 'util';
import { performance } from 'perf_hooks';
import writeCSVFile from './writeCSVfile.js';
const execPromise = util.promisify(exec);
const executeContainer = async (containerName, args,executionType) => {
    console.log(args);
    try {
        const {stdout} = await execPromise(`sudo docker cp ${args[0]} ${containerName}:/root/`);
        console.log(stdout); 
        const startTime = performance.now();
        const {stdout: execOutput} = await execPromise(`sudo docker exec -i ${containerName} node /root/${args[0]}`);
        const endTime = performance.now();

        // kill the container
        const {stdout: killOutput} = await execPromise(`sudo docker kill ${containerName}`);

        // remove the container
        const {stdout: removeOutput} = await execPromise(`sudo docker rm ${containerName}`);
        console.log('Total Execution time',endTime - startTime);  
        // write the output to csv file 
        const data = [{
            startTime,
            endTime,
            executionTime: endTime - startTime,
            containerName,
            functionName: args[0],
            executionType,
            runtime: 'node'
        }]
        console.log(data);
        await writeCSVFile('./logs/execution_output.csv',data);


    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default executeContainer;