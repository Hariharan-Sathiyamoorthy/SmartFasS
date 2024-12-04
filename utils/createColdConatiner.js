import { exec } from 'child_process';
import exp from 'constants';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
const execPromise = util.promisify(exec);

/**
 * Create a cold container
 * @param {String} homeDir - Home directory
 * @returns {String} - Container name
 */

async function createColdContainer(homeDir){
    try{
        let  containerName = 'coldMitigation_node_'+ uuidv4();
        console.time('Creating cold container');
        await execPromise(`sudo docker run -e NODE_PATH=/usr/local/lib/node_modules -v ${homeDir}/.npm/:/root/.npm -dit --name ${containerName} node:20-alpine`);
        console.timeEnd('Creating cold container');
        return containerName;
    }catch(error){
        console.error(error);
        return;
    }
   
}

export default createColdContainer;