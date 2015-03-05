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
var serveStatic = require('serve-static');



app.use(serveStatic('public', {
  'index': ['index.html']
}));

app.get('/', function(req, res) {
  res.sendfile("public/index.html");
});

app.post('/api/photo', multipartMiddleware, function(req, res) {

  var base64Data = req.body.imageData;
  var params = req.body.params;
  console.log(params);

  var match = base64Data.match(/data:image\/(.+);base64,(.+)/);


  //console.log(params);
  var image = {};

  image.dir = '/uploads/';


  image.ext = "." + (match[1] == 'jpeg' ? 'jpg' : match[1]);
  image.name = (new Date).getTime();
  image.publicPath = './public' + image.dir;
  image.srcPath = image.publicPath + image.name + image.ext;
  image.path = image.publicPath + image.name;


  async.waterfall([

    function moveFile(callback) {


      fs.writeFile(
        image.srcPath,
        new Buffer(match[2].replace(/ /g, '+'), 'base64'),
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

          if (error) {
            callback(error);
          }

          callback(null);
        });
    },
    function processImg(callback) {
      var bmp = image.path + '.bmp';
      var svg = image.path + '.svg';

      var child = exec('potrace --svg -a 5 ' + bmp + ' -o ' + svg,
        function(error, stdout, stderr) {

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

    console.log('done');

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