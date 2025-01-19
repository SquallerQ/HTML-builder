const path = require('path');
const fs = require('fs');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(outputFolderPath, 'bundle.css');

const bundleFile = fs.createWriteStream(bundleFilePath);

fs.readdir(stylesFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((item) => {
    const filePath = path.join(stylesFolderPath, item.name);

    if (item.isFile() && path.extname(item.name) === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf8');
      readStream.pipe(bundleFile, { end: false });
    }
  });
  console.log('CSS bundle created');
});
