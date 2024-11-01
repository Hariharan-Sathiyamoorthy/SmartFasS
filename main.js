import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
// storing the argument in a variable
await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
console.log(value);
await client.disconnect();
const args = process.argv.slice(2);
const argCount = args.length;





// Module to check the runtime of the function and validate if it is the right input
const getRuntime = (args) => {
    if (args.length === 1 && fs.existsSync(args[0])) {
        let runtime = path.extname(args[0]);
        if (runtime === '.js') {
            return 'node';
        } else {
            console.log("Please provide a valid js function")
            process.exit(1);
        }
    }
    else {
        console.log("Please provide a valid argument")
        process.exit(1);
    }
}

// storing the cache in the redis
const storeCacheInRedis = (npmPackage,time) => {
    let lib_frequency = lib+'_freq'
    let lib_freq = lib+'_freq'
    let lib_count = lib+'_count'
    let lib_cpath = lib+'_cpath'
    let lib_last_used = lib+'_last_used'
    let lib_install_time = lib+'_install_time'
    let cpath = 'None'
    let cacheDir = '/home/hari73118/.npm/'
    
}



// Module to install the npm package in the docker container
const installNpmPackage = (executionType,containerName) => {
    exec(`cat ${args[1]} | grep ^import | sed -e "s/.*from '//" -e "s/';//"`,(err,stdout,stderr) => {
        if(err){
            console.error(err);
            process.exit(1);
        }
        if(stdout){
            let npmPackages = stdout.split('\n');
            npmPackages.forEach((npmPackage) => {
                // check wheather the libiray is valid or not by checking the npm registry
                let time;
                exec(`npm view ${npmPackage}`,(err,stdout,stderr) => {
                    if(err){
                        console.error(err);
                        process.exit(1);
                    }
                    if(stdout && stdout.includes('.integrity:')){
                        if('redis lib exist'){

                        }else {
                            console.log(`Downloading Libiraries....`);

                            exec(`sudo docker exec ${containerName} npm install ${npmPackage}`,(err,stdout,stderr) => {
                                if(err){
                                    console.error(err);
                                    process.exit(1);
                                }
                            });
                            
                        }
                    }

                });
                storeCacheInRedis(npmPackage,time)
            });

        }
    });
}


// Module to check whether there is atleast one warm conatiner is present in the docker
const checkWarmContainer = () => {
    let executionType,totalCount,containerName;
    exec('sudo docker ps | grep -i _node | grep -i warm | grep -v prewarm | wc -l', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        if (stdout) {
            let warmContainerCount = parseInt(stdout);
            console.log(warmContainerCount);
            (warmContainerCount);
            if (warmContainerCount >= 1) {
                // check the warm container is occupied or not
                executionType = 'warm';
                exec(`sudo docker ps --format '{{.Names}}' | grep -i _node | grep -i warm | grep -v prewarm`, (err, stdout, stderr) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    if (stdout) {
                        console.log(stdout.split('\n').sort((a, b) => a - b));
                        let sortedContainers = stdout.split('\n').sort((a, b) => a - b);

                        let foundContainer = false;
                        sortedContainers.forEach((container) => {
                            if (foundContainer) return;
                            exec(`ps -ef | grep ${container} | grep docker | wc -l`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(err);
                                    process.exit(1);
                                }
                                else {
                                    let count = parseInt(stdout);
                                    console.log(count);
                                    count > 1 ? totalCount = 1 : totalCount = 0;
                                    if (totalCount === 0) {
                                        containerName = container;
                                        console.log('yooo',containerName);
                                        foundContainer = true;
                                    }
                                }
                            })
                        })
                    }
                })
            } else {
                executionType = 'cold';
                containerName = 'dls_node_warm';
                exec(`sudo docker run -v /home/hari73118/.npm/:/root/.npm -dit --name ${containerName} node:20-alpine`, (err, stdout, stderr) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    
                });
                console.log('inside cold container');

            }
        } 
    });
    installNpmPackage(executionType,containerName);
}
// const runtime =  getRuntime(args);
console.log(args);
// checkWarmContainer(runtime);