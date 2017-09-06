let archiver = require("archiver");
let fs = require("fs");
const chalk = require('chalk');

var bundle = archiver('zip', {
    zlib: { level: 9 }
});
var output = fs.createWriteStream(__dirname + '/bundle.zip');

output.on('close', function() {
  printBytemark(bundle.pointer(), 13, 1024);
});
 
bundle.on('warning', function(err) {
  if (err.code === 'ENOENT') {
      // log warning
  } else {
      // throw error
      throw err;
  }
});
 
bundle.on('error', function(err) {
  throw err;
});
 
bundle.pipe(output);

bundle.glob('build/code.js');
bundle.glob('index.html');

bundle.finalize();

function printBytemark(size_, segments, segmentSize) {
    var print = function(text) {
        console.log(chalkColor(text));
    }
    var size = size_;    
    var chalkColor = null;

    if (size > segments * segmentSize){
        chalkColor = chalk.keyword("orange");
        print("Bundle size:\t" + size + " / " + segments * segmentSize);
    } else {
        chalkColor = chalk.keyword("limegreen");
        print("Bundle size:\t" + size + " / " + segments * segmentSize);    
    }

    var gauge = "[";

    for(var i = 0; i < segments; i++){
        var content = Math.min(size, segmentSize);
        size -= content;
        var symbol = chalkColor("+");
        if (content == segmentSize){
            symbol = chalkColor("*");
        } else if (content == 0) {
            symbol = chalkColor(" ");
        }
        gauge += symbol;
    }

    gauge += "]";    

    while (size > 0){
        size -= segmentSize;
        gauge += chalkColor("x");
    }

    console.log(gauge);
}