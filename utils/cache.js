import { exec } from 'child_process';
import exp from 'constants';
import util from 'util';
import { createClient } from 'redis';
import fs from 'fs';

const execPromise = util.promisify(exec);
const client = createClient();

/**
 * change npm package name to dynamic
 */

/**
 * 
 * @param {*} npmPackage 
 * @param {*} time 
 */

const storeCacheInRedis = async (npmPackage,time,homeDir) => {
    let lib_frequency = npmPackage+'_freq'
    let lib_count = npmPackage+'_count'
    let lib_last_used = npmPackage+'_last_used'
    let lib_install_time = npmPackage+'_install_time'
    let lib_cacheFound = npmPackage+'_cacheFound'
    let cacheDir = `${homeDir}/.npm/`
    try {

        if(fs.existsSync(cacheDir)){
            const { stdout } = await execPromise(`npm cache ls ${npmPackage}`);
            let resArr = stdout.split('\n');
            if(resArr.length > 1){
                await client.set(lib_cacheFound,'true')
            }
        }
        let totalEntries = await client.exists(lib_frequency)
        // let installTime = client.exists(lib_install_time)
    
        if (totalEntries === 0){
            await client.set(lib_frequency,'NEW')
            await client.set(lib_count,1)
            await client.set(lib_last_used,'TIME')
        }
        else {
            let frequency = await client.get(lib_frequency)
            if (totalEntries > 0 && frequency === 'NEW' ){
                let count = parseInt(await client.get(lib_count)) + 1
                await client.set(lib_frequency,'COMMON')
                await client.set(lib_count,count)
                await client.set(lib_last_used,'TIME')
            }else if(totalEntries > 0 && frequency === 'COMMON'){
                let count = parseInt(await client.get(lib_count)) + 1

                await client.set(lib_frequency,'COMMON')
                await client.set(lib_count,count)
                await client.set(lib_last_used,'TIME')
                if (count >= 5) {
                    await client.set(lib_frequency,'FREQUENT')
                    await client.set(lib_count,count)
                    await client.set(lib_last_used,'TIME')
                    exec(`npm cache ls ${npmPackage}`, async (err,stdout,stderr) => {
                        if(err){
                            console.error(err);
                            process.exit(1);
                        }
                        if(stdout){
                            let cachePath = stdout.split('\n');
                            if(cachePath.length > 1){
                               await client.set(lib_cacheFound,'true')
                            }
                        }
                    }
                    )  
                }
    
            } else if(totalEntries > 0 && frequency === 'FREQUENT'){
                let count = parseInt(await client.get(lib_count)) +1
                await client.set(lib_count,count)

            }
        }

    }catch(err){
        console.error(err);
        // process.exit(1);    
        return;
    }
    


}

const installNpmPackage = async (containerName,args,homeDir) => {
    try {
        await client.connect();
        const { stdout: getPackageName } = await execPromise(`cat ${homeDir}/project/${args[0]} | grep "require" | sed -e "s/.*require('//" -e "s/');//"`);
        let npmPackages = getPackageName.split('\n').filter(n => n);
        await Promise.all(npmPackages.map(async (npmPackage) => {
            const { stdout: npmView } = await execPromise
            (`sudo npm view ${npmPackage}`);
            if(npmView && npmView.includes('.integrity:')){
                const isExists = await client.exists(`${npmPackage}_cacheFound`);
                if(isExists){
                    const getCacheBool = await client.get(`${npmPackage}_cacheFound`);
                    if(getCacheBool === 'true'){
                        console.time('npm install offline');
                        const { stdout } = await execPromise(`sudo docker exec ${containerName} npm install -g ${npmPackage} --loglevel=verbose --offline`);
                        console.timeEnd('npm install offline');
                    }
                    
                }

                else {
                    console.time('npm install online');
                    const { stdout } = await execPromise(`sudo docker exec ${containerName} npm install -g ${npmPackage}`);
                    console.time('npm install online');

                }
            }
            await storeCacheInRedis(npmPackage,'Time',homeDir)
        }));
        return 'success';
    } catch (error) {
        console.error(error);
        // process.exit(1);
        return;
    }finally {
        await client.disconnect();
    }
}

export default installNpmPackage;


 