import { exec } from 'child_process';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import createColdContainer from './createColdConatiner.js';

/**
 * Check if the container is warm or cold
 * @param {String} runtime - Name of the runtime
 * @param {String} homeDir - Home directory
 * @returns {Object} - Execution type and container name
 */

const execPromise = util.promisify(exec);

const checkWarmContainer = async (runtime,homeDir) => {
    try {
        let executionType, totalCount, containerName;
        const { stdout: warmContainerCountStdout } = await execPromise(`sudo docker ps --format '{{.Names}}' | grep coldMitigation_${runtime} | wc -l`);
        let warmContainerCount = parseInt(warmContainerCountStdout);

        if (warmContainerCount >= 1) {
            executionType = 'warm';
            const { stdout: containersStdout } = await execPromise(`sudo docker ps --format '{{.Names}}' | grep coldMitigation_${runtime}`);
            let sortedContainers = containersStdout.split('\n').sort((a, b) => a - b);
            containerName = sortedContainers[0];
        } else {
            executionType = 'cold';
            containerName = await createColdContainer(homeDir);
        }
        return {executionType,containerName};
    } catch (error) {
        console.error(error);
        const containerName = await createColdContainer(homeDir);
        return {executionType:'cold',containerName};
    }
}

export default checkWarmContainer;