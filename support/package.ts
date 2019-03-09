import * as fs from 'fs';
import * as path from 'path';
import { rootPath } from 'get-root-path';

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
  const sourceFileName = path.join(rootPath, `./${fileName}`);
  const destinationFileName = path.join(rootPath, `./dist/${path.basename(fileName)}`);
  fs.copyFileSync(sourceFileName, destinationFileName);
});

const packageJson = fs.readFileSync(path.join(rootPath, './dist/package.json'), 'utf8');
const packageObject = JSON.parse(packageJson);

delete packageObject.private;
delete packageObject.scripts;
delete packageObject.devDependencies;
delete packageObject.husky;

fs.writeFileSync(
  path.join(rootPath, './dist/package.json'),
  JSON.stringify(packageObject, null, '  '),
  'utf8'
);
