(function() {
  angular
    .module('Vectorizer.services')
    .service('Stage', Stage);

  //Uploader.$inject = ['$http', '$q'];

  function Stage() {
    return {
      stage: {},
      imageLayer: null,
      svgLayer: null,
      loadData: loadData,
    };

    function loadData(data) {
      var stage = this.stage;
      var imageLayer = this.imageLayer;
      var svgLayer = this.svgLayer;
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
        imageLayer.visible(false);
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


    }

  }

})();