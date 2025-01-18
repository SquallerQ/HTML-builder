const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretFolder, file.name);
      fs.stat(filePath, (err, stats) => {
        const fileName = file.name.split('.')[0];
        const fileExtension = file.name.split('.')[1];
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      });
    }
  });
});
