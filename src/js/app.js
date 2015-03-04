(function() {
  var imageLayer, svgLayer, image, svg;
  var fileInput = $('#file-upload');
  var processWithParams = $('#process-btn');

  var sendData = function(url, data) {
    $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: data,
      processData: false,
      contentType: false,
      success: function(data) {
        stage.destroyChildren();

        imageLayer = new Konva.Layer();
        svgLayer = new Konva.Layer();

        stage.add(imageLayer);
        stage.add(svgLayer);
        var imageObj = new Image();
        var svgObj = new Image();

        imageObj.onload = function() {
          image = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: imageObj.width,
            height: imageObj.height
          });

          stage.width(imageObj.width);
          stage.height(imageObj.height);

          imageLayer.add(image);
          imageLayer.draw();

          svgObj.onload = function() {
            svg = new Konva.Image({
              x: 0,
              y: 0,
              image: svgObj,
              width: imageObj.width,
              height: imageObj.height
            });

            svgLayer.add(svg);
            svgLayer.draw();
          };

          svgObj.src = data.svg;
        };

        imageObj.src = data.image;

        fileInput.val('');
      }
    })

  }

  fileInput.on('change', function(event) {
    if (!this.files[0]) {
      return;
    };

    var fd = new FormData;

    fd.append('image', this.files[0]);
    sendData('/api/photo', fd);


  })
  processWithParams.on('click', function(event) {

    var params = JSON.stringify($('#potraceParams').serializeArray());
    var imageObj = imageLayer.getCanvas().toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");


    console.log(params);
    //console.log(canvasImg);
    //getImageColors(image);
    var fd = new FormData();
    fd.append('image', imageObj);
    fd.append('params', params);
    sendData('/api/photo', fd);

  })

  var stage = new Konva.Stage({
    container: 'container',
    width: 0,
    height: 0
  });


  function trackVisibilityKeypress(e) {
    var KeyID = (window.event) ? event.keyCode : e.keyCode;
    switch (KeyID) {
      case 118:
        //check of keypressing 'v' key
        svgLayer.visible(false);
        break;

      case 98:
        //check of keypressing 'b' key
        imageLayer.visible(false);
        break;

    }
    $(document).unbind('keypress', trackVisibilityKeypress);
    $(document).keyup(trackVisibilityKeyup);
  };

  function trackVisibilityKeyup(e) {
    if (e) {
      svgLayer.visible(true);
      imageLayer.visible(true);
      $(document).unbind('keyup', trackVisibilityKeyup);
      $(document).keypress(trackVisibilityKeypress);
    }
  }
  $(document).keypress(trackVisibilityKeypress);

  // Color thief library getting color palette from input image (Konva.image)
  $('#get-palette').click(function(e) {
    getColorsFromImage();

  })

  function getColorsFromImage() {
    if ($('#container > div > canvas:nth-child(1)').length > 0) {



      var imageObj = image.getImage();
      var colorThief = new ColorThief();
      var color = colorThief.getColor(imageObj);
      var palette = colorThief.getPalette(imageObj);
      var hex_colors = Array;
      //console.log(color, palette);
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      function rgbToHex(arr) {
        var r = arr[0];;
        var g = arr[1];;
        var b = arr[2];
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

      for (var i = 0; i < palette.length; i++) {
        hex_colors.push(rgbToHex(palette[i]));
      };
      console.log(hex_colros);




    }
  };






})();