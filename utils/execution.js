import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const executeContainer = async (containerName, args) => {
    try {
        const {stdout} = await execPromise(`sudo docker cp ${args[0]} ${containerName}:/root/`);
        console.log(stdout); 
        const {stdout: execOutput} = await execPromise(`sudo docker exec -i ${containerName} node /root/${args[0]}`);
        console.log(execOutput);  

        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default executeContainer;