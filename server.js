process.env.TMPDIR = './tmp';

var express = require("express");
var app = express();
var fs = require('fs');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
var sizeOf = require('image-size');
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

  var image = {};

  image.dir = '/uploads/';

  var name = req.files.image.name;
  var lastIndex = name.lastIndexOf('.');

  image.ext = name.substr(lastIndex, name.length);
  image.name = (new Date).getTime();
  image.publicPath = './public' + image.dir;
  image.srcPath = image.publicPath + image.name + image.ext;
  image.path = image.publicPath + image.name;

  console.log('image', image);

  async.waterfall([

    function moveFile(callback) {
      fs.rename(
        req.files.image.path,
        image.srcPath,
        function(error) {
          if (error) {
            callback(error);
          };

          callback(null);
        });
    },
    function convertImg(callback) {
      var bmp = image.path + '.bmp';

      var child = exec('convert ' + image.srcPath + ' ' + bmp,
        function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error) {
            callback(error);
          }

          callback(null);
        });
    },
    function processImg(callback) {
      var bmp = image.path + '.bmp';
      var svg = image.path + '.svg';

      var child = exec('potrace --svg ' + bmp + ' -o ' + svg,
        function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error) {
            callback(error);
          }

          callback(null);
        });
    },
    function resizeImg(callback) {
      var resize = image.path + '_resized' + image.ext;

      var child = exec('convert ' + image.srcPath + ' -resize 1024x700 ' + resize,
        function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error) {
            callback(error);
          }

          callback(null);
        });
    }
  ], function(err) {
    if (err) {
      console.log(err)
      res.send({
        error: 'Ah crap! Something bad happened'
      });
      return;
    };

    console.log('done')

    res.send({
      image: image.dir + image.name + '_resized' + image.ext,
      svg: image.dir + image.name + '.svg'
    });
  });
});


/*Run the server.*/
app.listen(3000, function() {
  console.log("Working on port 3000");
});