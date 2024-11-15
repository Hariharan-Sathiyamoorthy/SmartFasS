
import { exec } from 'child_process';
import util from 'util';
import { performance } from 'perf_hooks';


/**
 * handle in use conatiners
 */

const execPromise = util.promisify(exec);

const executeOpenwhisk = async (args) => {
        try {
            console.log('Creating Openwhisk Action...');
            const startTime = performance.now();
            const {stdout: createStdout} = await execPromise(`sudo wsk -i action create simpleAction --kind nodejs:default /home/hari73118/project/${args[0]} `);
            console.log('Invoking Openwhisk Action...');
            const {stdout: invokeStdout} = await execPromise(`sudo wsk -i action invoke simpleAction --blocking`);
            const endTime = performance.now();
            console.log('Deleting Openwhisk Action...');
            const {stdout: deleteStdout} = await execPromise(`sudo wsk -i action delete simpleAction`);
            console.log('Total Execution time is',endTime - startTime);
            return endTime - startTime;


        } catch (error) {   
            console.error(error);
            return;
        }

}

export default executeOpenwhisk;

