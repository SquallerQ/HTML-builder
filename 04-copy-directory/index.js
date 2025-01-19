const path = require('path');
const fs = require('fs');

const startFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.stat(copyFolder, (err) => {
  if (err && err.code === 'ENOENT') {
    fs.mkdir(copyFolder, { recursive: true }, (err) => {
      if (err) return console.error(err);
      copyFiles();
    });
  } else {
    fs.readdir(copyFolder, (err, files) => {
      if (err) return console.error(err);
      files.forEach((file) => {
        fs.unlink(path.join(copyFolder, file), (err) => {
          if (err) console.error(err);
        });
      });
      copyFiles();
    });
  }
});

function copyFiles() {
  fs.readdir(startFolder, (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
      fs.copyFile(
        path.join(startFolder, file),
        path.join(copyFolder, file),
        (err) => {
          if (err) console.error(err);
        },
      );
    });
    console.log('Files copied');
  });
}
