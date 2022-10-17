//  getSvg.js
var fs = require('fs');
var path = require('path');
const svgDir = path.resolve(__dirname, './icons');

// 读取单个文件
function readfile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function(err, data) {
      console.log(filename);
      console.log(data.replace(/<\?xml.*?\?>|<\!--.*?-->|<!DOCTYPE.*?>/g, ''));
      if (err) reject(err);
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: data,
      });
    });
  });
}

// 读取SVG文件夹下所有svg
function readSvgs() {
  return new Promise((resolve, reject) => {
   fs.readdir(svgDir, function(err, files) {
     if (err) reject(err);
     Promise.all(files.filter(fileName => fileName.endsWith('.svg')).map(filename => readfile(filename)))
      .then(data => resolve(data))
      .catch(err => reject(err));
   });
  });
}

// 生成icon文件
readSvgs().then(data => {
  let svgFile = 'export const icons = ' + JSON.stringify(Object.assign.apply(this, data), null, 2);
  fs.writeFile(path.resolve(__dirname, './icons.ts'), svgFile, function(err) {
    if(err) throw new Error(err);
  })
}).catch(err => {
    throw new Error(err);
  });