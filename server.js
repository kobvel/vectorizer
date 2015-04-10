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
var spawn = require('child_process').spawn;
var serveStatic = require('serve-static');



app.use(serveStatic('public', {
  'index': ['index.html']
}));

app.get('/', function(req, res) {
  res.sendfile("public/index.html");
});

app.post('/api/photo', multipartMiddleware, function(req, res) {

  var base64Data = req.body.imageData;
  var paramsData = req.body.params;
  var gammaData = req.body.gamma;
  var paramsTypes = ['turdsize', 'alphamax', 'opttolerance', 'turnpolicy', 'color', 'fillcolor', 'tight', 'invert'];
  var jsonparam = paramsData ? JSON.parse(paramsData) : {};

  var match = base64Data.match(/data:image\/(.+);base64,(.+)/);
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
      function convertImgBMP(callback) {
        var bmp = image.path + '.bmp';
        var child = exec('convert ' + image.srcPath + ' ' + bmp,
          function(error, stdout, stderr) {

            if (error) {
              callback(error);
            }

            callback(null);
          });
      },
      function convertImgPBM(callback) {
        var bmp = image.path + '.bmp';
        var pbm = image.path + '.pbm';
        var child = exec('mkbitmap ' + bmp + ' -n -t ' + gammaData + ' ' + pbm,
          function(error, stdout, stderr) {

            if (error) {
              callback(error);
            }

            callback(null);
          });
      },
      function convertImgPBM(callback) {
        var bmp = image.path + '.bmp';
        var pbm = image.path + '.pbm';
        var child = exec('convert ' + pbm + ' ' + bmp,
          function(error, stdout, stderr) {

            if (error) {
              callback(error);
            }

            callback(null);
          });
      },

      function processImg(callback) {
        var svg = image.path + '.svg';
        var pbm = image.path + '.pbm';
        var options = ["--svg"];

        if (jsonparam) {
          Object.keys(jsonparam).forEach(function(i) {
            if (paramsTypes.indexOf(i) !== -1) {
              if (!!jsonparam[i] && jsonparam[i] !== true) {
                options.push('--' + i);
                options.push(jsonparam[i]);
              } else if (jsonparam[i] == true) {

                options.push('--' + i);

              }
            }
          });
        };

        options = options.concat([pbm, '-o', svg]);

        var potrace = spawn('potrace', options);
        console.log('potrace', options);
        potrace.on('error', function(error) {
          callback(error);
        });
        potrace.on('close', function(code) {
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
    ],
    function(err) {
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
        svg: image.dir + image.name + '.svg',
        pbm: image.dir + image.name + '.bmp'
      });
    });
});


/*Run the server.*/
app.listen(3000, function() {
  console.log("Working on port 3000");
});