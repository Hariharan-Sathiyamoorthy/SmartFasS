import { createClient } from "redis";

const totalNumberOfDatabases = 1;
const redisClients = [];
(async function createDatabes() {
    for (let i = 0; i < totalNumberOfDatabases; i++) {
        const redisClient = createClient({
            host: 'localhost',
            port: 6379,
            database: i
        });
        redisClient.on('error', err => {
            console.error(err);
            process.exit(1);
        });
        // await redisClient.connect();
        let a = `client${i}`;
        redisClients.push(redisClient);
        try {
            await redisClient.connect();
        } catch (error) {
            console.log(error);
            
        }
        console.log(`Database ${i} created`);
        // i === totalNumberOfDatabases - 1 && console.log('All databases created') && process.exit(0);
    }
})();

export default redisClients
// module.exports = {  createDatabes };



