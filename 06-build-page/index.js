const path = require('path');
const fs = require('fs');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const assetsDestDir = path.join(projectDist, 'assets');

function createDir(dirPath, callback) {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
    callback();
  });
}

function copyAssets(srcDir, destDir) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(srcDir, { withFileTypes: true }, (err, items) => {
      if (err) {
        console.error(err);
        return;
      }

      items.forEach((item) => {
        const srcPath = path.join(srcDir, item.name);
        const destPath = path.join(destDir, item.name);

        if (item.isDirectory()) {
          copyAssets(srcPath, destPath);
        } else if (item.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      });
    });
  });
}

function buildStyles() {
  const outputCssPath = path.join(projectDist, 'style.css');

  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const writeStream = fs.createWriteStream(outputCssPath);

    cssFiles.forEach((file, index) => {
      const filePath = path.join(stylesDir, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');

      readStream.pipe(writeStream, { end: index === cssFiles.length - 1 });
    });

    console.log('Styles bundled');
  });
}

function buildHtml() {
  const outputHtmlPath = path.join(projectDist, 'index.html');

  fs.readFile(templatePath, 'utf8', (err, templateContent) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(componentsDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      const htmlSections = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.html',
      );

      let htmlContent = templateContent;
      let completed = 0;

      htmlSections.forEach((file) => {
        const sectionTag = `{{${path.basename(file.name, '.html')}}}`;
        const componentPath = path.join(componentsDir, file.name);

        fs.readFile(componentPath, 'utf8', (err, componentContent) => {
          if (err) {
            console.error(err);
            return;
          }

          htmlContent = htmlContent.replace(sectionTag, componentContent);
          completed += 1;

          if (completed === htmlSections.length) {
            fs.writeFile(outputHtmlPath, htmlContent, (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('HTML builded');
              }
            });
          }
        });
      });
    });
  });
}

function buildProject() {
  createDir(projectDist, () => {
    copyAssets(assetsDir, assetsDestDir);
    buildStyles();
    buildHtml();
  });
}

buildProject();
