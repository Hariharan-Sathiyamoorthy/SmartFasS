import { exec } from 'child_process';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';

/**
 * handle in use conatiners
 */

const execPromise = util.promisify(exec);

const checkWarmContainer = async (runtime) => {
    try {
        let executionType, totalCount, containerName;
        const { stdout: warmContainerCountStdout } = await execPromise(`sudo docker ps --format '{{.Names}}' | grep coldMitigation_${runtime} | wc -l`);
        let warmContainerCount = parseInt(warmContainerCountStdout);

        if (warmContainerCount >= 1) {
            executionType = 'warm';
            const { stdout: containersStdout } = await execPromise(`sudo docker ps --format '{{.Names}}' | grep coldMitigation_${runtime}`);
            let sortedContainers = containersStdout.split('\n').sort((a, b) => a - b);

            // let foundContainer = false;
            // for (const container of sortedContainers) {
            //     if (foundContainer) break;

            //     const { stdout: countStdout } = await execPromise(`ps -ef | grep ${container} | grep docker | wc -l`);
            //     console.log('countStdout:', countStdout);
            //     let count = parseInt(countStdout);

            //     console.log('count is:', count);
            //     totalCount = count > 1 ? 1 : 0;
            //     if (totalCount === 0) {
            //         containerName = container;
            //         console.log('yooo', containerName);
            //         foundContainer = true;
            //     }
            // }
            containerName = sortedContainers[0];
        } else {
            executionType = 'cold';
            // create a new container with uuid
            containerName = 'coldMitigation_node_'+ uuidv4();
            console.time('Creating cold container');
            await execPromise(`sudo docker run -e NODE_PATH=/usr/local/lib/node_modules -v /home/hari73118/.npm/:/root/.npm -dit --name ${containerName} node:20-alpine`);
            console.timeEnd('Creating cold container');
        }
        return {executionType,containerName};
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default checkWarmContainer;