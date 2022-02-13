var fs = require('fs');
var process = require('process');

const serverModulesFolder = 'src/server/modules';
const swaggerConfigFile = 'swaggerConfig.json';

fs.readdir(serverModulesFolder, function (err, folders) {
  if (err) {
    console.error('import-dtos.js .Could not list the directory folders.', err);
    process.exit(1);
  }
  // get swaggerConfig.json content and delete entryFile
  const data = fs.readFileSync(swaggerConfigFile, 'utf-8');
  const jsonData = JSON.parse(data);
  delete jsonData.swagger.entryFile;
  // init new entry file data
  const entryFile = ['./src/server/routes/index.ts'];
  // loop on modules folders to get names of the modules
  // add path for each module's index.ts
  folders.forEach(function (moduleFolder) {
    if (fs.statSync(serverModulesFolder + '/' + moduleFolder).isDirectory()) {
      entryFile.push(`./src/server/modules/${moduleFolder}/dtos/index.ts`);
    }
  });
  // add and write the data into file
  jsonData.swagger.entryFile = entryFile;
  fs.writeFileSync(swaggerConfigFile, JSON.stringify(jsonData), 'utf-8');
});
