import fs from 'fs/promises';
import path from 'path';

const getRuntime = async (args) => {
    console.log(args);
    return fs.access(args[0])
        .then(() => {
            let runtime = path.extname(args[0]);
            if (runtime === '.js') {
                return 'node';
            } else {
                console.log('Unsupported file type');
                process.exit(1);
            }
        })
        .catch(() => {
            console.log('File not found');
            process.exit(1);
        });
}

export default getRuntime;