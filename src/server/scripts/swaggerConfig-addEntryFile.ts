import { existsSync, readFileSync, readdir, statSync, writeFileSync } from 'fs';

import { exit } from 'process';

const SERVER_MODULES_FOLDER = 'src/server/modules';
const SWAGGER_CONFIG_FILE = 'swaggerConfig.json';
const DTOS_INDEX_PATH = 'dtos/index.ts';
enum STATUS_ENUM {
  'success' = 'success',
  'warning' = 'warning',
}
declare type Status = keyof typeof STATUS_ENUM;

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
  const entryFile = modulesFolder
    .map((moduleFolder: string): string => {
      const pathToModulesSubDirectory = `${SERVER_MODULES_FOLDER}/${moduleFolder}`;
      if (statSync(pathToModulesSubDirectory).isDirectory()) {
        if (
          !statSync(`${pathToModulesSubDirectory}/dtos`).isDirectory() ||
          !existsSync(`${pathToModulesSubDirectory}/${DTOS_INDEX_PATH}`)
        ) {
          console.warn(`No dtos/index.ts found for ${pathToModulesSubDirectory}/${DTOS_INDEX_PATH}`);
          status = STATUS_ENUM.warning;
          return ``;
        }
        return `./${SERVER_MODULES_FOLDER}/${moduleFolder}/${DTOS_INDEX_PATH}`;
      }
      return ``;
    })
    .filter(Boolean);
  if (entryFile.length === 0) {
    console.warn(`No modules were found to export to swaggerJson`);
    status = STATUS_ENUM.warning;
  }
  // add and write the data into file
  entryFile.push('./src/server/routes/index.ts');
  jsonData.swagger.entryFile = entryFile;
  writeFileSync(SWAGGER_CONFIG_FILE, JSON.stringify(jsonData, null, 2), 'utf-8');
  if (status === STATUS_ENUM.warning) {
    console.info('swagger import script completed with warnings.');
  } else {
    console.info('swagger import script completed successfully.');
  }
});
