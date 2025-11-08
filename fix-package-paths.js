// Fix package.json paths by removing dist/ prefixes
const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'dist', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Remove dist/ prefix from all path fields
if (pkg.main) pkg.main = pkg.main.replace(/^dist\//, '');
if (pkg.es2020) pkg.es2020 = pkg.es2020.replace(/^dist\//, '');
if (pkg.esm2020) pkg.esm2020 = pkg.esm2020.replace(/^dist\//, '');
if (pkg.fesm2020) pkg.fesm2020 = pkg.fesm2020.replace(/^dist\//, '');
if (pkg.fesm2022) pkg.fesm2022 = pkg.fesm2022.replace(/^dist\//, '');
if (pkg.typings) pkg.typings = pkg.typings.replace(/^dist\//, '');

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log('✅ Fixed package.json paths');

