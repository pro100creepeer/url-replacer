const fs            = require('fs');
const process       = require('process');
const child_process = require('child_process');
const path          = require('path');

let inputFilename  = process.argv.indexOf('-i');
let outputFilename = process.argv.indexOf('-o');
let verbose        = process.argv.indexOf('-v') > 0;
if(inputFilename < 0 || outputFilename < 0)
  throw 'Cannot find input/output filename';
inputFilename  = process.argv[inputFilename + 1];
outputFilename = process.argv[outputFilename + 1];
fs.writeFileSync(
  outputFilename,
  fs.readFileSync(inputFilename).toString().replace(/url\(\'?(.+?)\'?\);/gi, (word, $1) => {
    if(!$1.startsWith('http')) return 'url(' + $1 + ');';
    let fn = $1.split('/');
    fn     = fn[fn.length - 1];
    download($1, fn);
    if(verbose) console.log('Replaced ' + $1 + ' -> ' + '/views/images/styles/' + fn);
    return 'url(/views/images/styles/' + fn + ');';
  }));

function download(finame, foname) {
  child_process.exec('rm -rf images/*')
  child_process.exec('wget -P images ' + finame)
}
