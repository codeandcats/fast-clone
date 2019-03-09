import * as fs from 'fs';
import * as path from 'path';
import resolveAppPath = require('resolve-app-path');

const appPath = resolveAppPath();

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

const filesToCopy = [
  'package.json',
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'src/index.d.ts'
];

filesToCopy.forEach((fileName) => {
  const sourceFileName = path.join(appPath, `./${fileName}`);
  const destinationFileName = path.join(appPath, `./dist/${path.basename(fileName)}`);
  fs.copyFileSync(sourceFileName, destinationFileName);
});

const packageJson = fs.readFileSync(path.join(appPath, './dist/package.json'), 'utf8');
const packageObject = JSON.parse(packageJson);

delete packageObject.private;
delete packageObject.scripts;
delete packageObject.devDependencies;
delete packageObject.husky;

fs.writeFileSync(
  path.join(appPath, './dist/package.json'),
  JSON.stringify(packageObject, null, '  '),
  'utf8'
);
