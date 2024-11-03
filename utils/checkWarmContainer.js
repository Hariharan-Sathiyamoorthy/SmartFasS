import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const checkWarmContainer = async (runtime) => {
    try {
        let executionType, totalCount, containerName;

        const { stdout: warmContainerCountStdout } = await execPromise(`sudo docker ps | grep -i _${runtime} | grep -i warm | grep -v prewarm | wc -l`);
        let warmContainerCount = parseInt(warmContainerCountStdout);
        console.log(warmContainerCount);

        if (warmContainerCount >= 1) {
            executionType = 'warm';

            const { stdout: containersStdout } = await execPromise(`sudo docker ps --format '{{.Names}}' | grep -i _${runtime} | grep -i warm | grep -v prewarm`);
            let sortedContainers = containersStdout.split('\n').sort((a, b) => a - b);
            console.log(sortedContainers);

            let foundContainer = false;
            for (const container of sortedContainers) {
                if (foundContainer) break;

                const { stdout: countStdout } = await execPromise(`ps -ef | grep ${container} | grep docker | wc -l`);
                let count = parseInt(countStdout);
                console.log(count);

                totalCount = count > 1 ? 1 : 0;
                if (totalCount === 0) {
                    containerName = container;
                    console.log('yooo', containerName);
                    foundContainer = true;
                }
            }
        } else {
            executionType = 'cold';
            containerName = 'dls_node_warm';

            await execPromise(`sudo docker run -v /home/hari73118/.npm/:/root/.npm -dit --name ${containerName} node:20-alpine`);
            console.log('inside cold container');
        }
        return {executionType,containerName};
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default checkWarmContainer;