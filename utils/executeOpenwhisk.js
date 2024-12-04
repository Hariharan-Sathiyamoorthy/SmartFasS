
import { exec } from 'child_process';
import util from 'util';
import { performance } from 'perf_hooks';


/**
 * Execute Openwhisk
 * @param {Array} args - Arguments
 * @param {String} homeDir - Home directory
 * @returns {Object} - Execution time and function name
 */

const execPromise = util.promisify(exec);

const executeOpenwhisk = async (args,homeDir) => {
        try {
            console.log('Creating Openwhisk Action...');
            const startTime = performance.now();
            const {stdout: createStdout} = await execPromise(`sudo wsk -i action create ${args[2]} --kind nodejs:default ${homeDir}/SmartFasS
/${args[0]} `);
            console.log('Invoking Openwhisk Action...');
            const {stdout: invokeStdout} = await execPromise(`sudo wsk -i action invoke ${args[2]} --blocking`);
            const endTime = performance.now();
            console.log('Deleting Openwhisk Action...');
            const {stdout: deleteStdout} = await execPromise(`sudo wsk -i action delete ${args[2]}`);
            console.log('Total Execution time is',endTime - startTime);
            return {executionTime:endTime - startTime,func:args[2]};


        } catch (error) {   
            console.error(error);
            return;
        }

}

export default executeOpenwhisk;

