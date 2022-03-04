import { existsSync, readFileSync, readdir, statSync, writeFileSync } from 'fs';

import { exit } from 'process';

const SERVER_MODULES_FOLDER = 'src/server/modules';
const SWAGGER_CONFIG_FILE = 'swaggerConfig.json';

const namespaces = ['dtos', 'routes', 'models', 'interfaces'];

enum STATUS_ENUM {
  'success' = 'success',
  'warning' = 'warning',
}
declare type Status = keyof typeof STATUS_ENUM;

/**
 * check if path is a valid directory and also validate that it contains
 * an index.ts export file
 *
 * @param dir
 */
function checkIfValid(dir: any): STATUS_ENUM {
  if (!statSync(dir).isDirectory() || !existsSync(`${dir}/index.ts`)) {
    console.warn(`No index.ts found for ${dir}`);
    return STATUS_ENUM.warning;
  }
  return STATUS_ENUM.success;
}

readdir(SERVER_MODULES_FOLDER, (err, modulesFolder: string[]) => {
  if (err) {
    console.error('import-dtos.js .Could not list the directory folders', err.message);
    exit(1);
  }
  // get swaggerConfig.json content and delete entryFile
  const data = readFileSync(SWAGGER_CONFIG_FILE, 'utf-8');
  const jsonData = JSON.parse(data);
  let status: Status = STATUS_ENUM.success;
  // init new entry file data
  // loop on modules folders to get names of the modules
  // add path for each module's index.ts
  const paths: string[] = [];
  modulesFolder.map((moduleFolder: string): string => {
    const pathToModulesSubDirectory = `${SERVER_MODULES_FOLDER}/${moduleFolder}`;

    if (statSync(pathToModulesSubDirectory).isDirectory()) {
      const statuses = [...namespaces.map((namespace) => checkIfValid(`${pathToModulesSubDirectory}/${namespace}`))];

      if (statuses.includes(STATUS_ENUM.warning)) {
        return ``;
      }
      paths.push(...namespaces.map((namespace) => `./${pathToModulesSubDirectory}/${namespace}/index.ts`));
    }
    return ``;
  });
  if (paths.length === 0) {
    console.warn(`No modules were found to export to swaggerJson`);
    status = STATUS_ENUM.warning;
  }
  // add and write the data into file
  // entryFile.push('./src/server/routes/index.ts');
  jsonData.swagger.entryFile = paths;
  writeFileSync(SWAGGER_CONFIG_FILE, JSON.stringify(jsonData, null, 2), 'utf-8');
  if (status === STATUS_ENUM.warning) {
    console.info('swagger import script completed with warnings.');
  } else {
    console.info('swagger import script completed successfully.');
  }
});
