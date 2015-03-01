(function() {
  var imageLayer, svgLayer, image, svg;
  var fileInput = $('#file-upload')

  fileInput.on('change', function(event) {
    if (!this.files[0]) {
      return;
    };

    var fd = new FormData;

    fd.append('image', this.files[0]);

    $.ajax({
      url: '/api/photo',
      type: 'POST',
      dataType: 'json',
      data: fd,
      processData: false,
      contentType: false,
      success: function(data) {
        stage.clear();
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

  })

  var stage = new Konva.Stage({
    container: 'container',
    width: 0,
    height: 0
  });



  function trackVisibilityKeypress(e) {
    if (e) {
      svgLayer.visible(false);
      $(document).unbind('keypress', trackVisibilityKeypress);
      $(document).keyup('v', trackVisibilityKeyup);
    }
  };

  function trackVisibilityKeyup(e) {
    if (e) {
      svgLayer.visible(true);
      $(document).unbind('keyup', trackVisibilityKeyup);
      $(document).keypress("v", trackVisibilityKeypress);
    }
  }

  $(document).keypress("v", trackVisibilityKeypress);


})();