process.env.TMPDIR = './tmp';

var express = require("express");
var app = express();
var fs = require('fs');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
var exec = require('child_process').exec;
var serveStatic = require('serve-static')

app.use(serveStatic('public', {
  'index': ['index.html']
}));

app.get('/', function(req, res) {
  res.sendfile("public/index.html");
});

app.post('/api/photo', multipartMiddleware, function(req, res) {

  console.log(JSON.stringify(req.files));
  var serverPath = './public/uploads/' + req.files.image.name.replace(/^(.+)\./, (new Date).getTime() + '.');

  console.log('serverPath', serverPath);

  async.waterfall([

    function moveFile(callback) {
      var path = serverPath;

      fs.rename(
        req.files.image.path,
        path,
        function(error) {
          if (error) {
            callback(error);
          };

          callback(null, path);
        });
    },
    function convertImg(path, callback) {
      var img = path;
      var pbm = path.replace(/\.[A-z]+$/, '.pbm');

      var child = exec('convert ' + img + ' ' + pbm,
        function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error) {
            callback(error);
          }

          callback(null, pbm);
        });
    },
    function processImg(pbm, callback) {
      var svg = pbm.replace(/\.[A-z]+$/, '.svg');

      var child = exec('potrace ' + pbm + ' -o ' + svg,
        function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error) {
            callback(error);
          }

          callback(null, svg);
        });
    }
  ], function(err, svg) {
    if (err) {
      console.log(err)
      res.send({
        error: 'Ah crap! Something bad happened'
      });
      return;
    };

    console.log('done')

    res.send({
      image: serverPath.substr(8),
      svg: svg.substr(8)
    });
  });
});






/*Run the server.*/
app.listen(3000, function() {
  console.log("Working on port 3000");
});