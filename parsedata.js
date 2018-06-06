const util = require('util');
const yaml = require('js-yaml');
const glob = util.promisify(require('glob'));
const fs = require('fs');
const DATA_PATH = './app/data';

// FFS
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readYaml(path) {
    const data = await readFile(path, 'utf-8');
    return yaml.safeLoad(data);
}

async function main() {
    const base = await readYaml(`${DATA_PATH}/base.yaml`);
    const paths = await glob(`${DATA_PATH}/workouts/*.yaml`);

    for (let path of paths) {
        const workout = await readYaml(path);
        base.workouts.push(workout);
    }

    const data = JSON.stringify(base);

    writeFile(`${DATA_PATH}/data.json`, data);

    console.log('Wrote data.json file');
}

main();