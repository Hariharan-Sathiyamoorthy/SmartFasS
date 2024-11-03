import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import getRuntime  from './utils/getRuntime.js';
import checkWarmContainer from './utils/checkWarmContainer.js';
import installNpmPackage from './utils/cache.js';
import executeContainer from './utils/execution.js';

const args = process.argv.slice(2);
const argCount = args.length;


class Main {
    constructor(args) {
        this.args = args;
    }

    async run() {
        const runtime = await getRuntime(this.args);
        const { executionType, containerName } = await checkWarmContainer(runtime);
        const msg = await installNpmPackage(containerName, this.args);
        console.log(msg);
        const exec = await executeContainer(containerName, this.args);
    }
}



const main = new Main(args);
main.run();

