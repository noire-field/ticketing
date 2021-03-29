var http = require('https');
var fs = require('fs');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
  
request.on('response', (res) => {
    var downloaded = 0;
    var len = parseInt(res.headers['content-length'], 10);
    res.on('data', function(chunk) {
        
        downloaded += chunk.length;
        console.log("Downloading " + (100.0 * downloaded / len).toFixed(2) + "% " + downloaded + " bytes.");

    })
})
};

download('https://speed.hetzner.de/1GB.bin', './1GB.bin', () => {
    console.log('Done');
})