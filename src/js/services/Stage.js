(function() {
  angular
    .module('Vectorizer.services')
    .service('Stage', Stage);

  Stage.$inject = ['$q'];

  function Stage($q) {
    return {
      stage: {},
      imageLayer: null,
      svgLayer: null,
      loadData: loadData,
      image: null,
      svg: null,
    };

    function loadData(data) {
      var p = $q.defer();
      var self = this;


      this.imageLayer = new Konva.Layer();
      this.svgLayer = new Konva.Layer();
      var stage = this.stage;
      var imageLayer = this.imageLayer;
      var svgLayer = this.svgLayer;
      stage.destroyChildren();


      stage.add(imageLayer);
      stage.add(svgLayer);
      var imageObj = new Image();
      var svgObj = new Image();

      imageObj.onload = function() {
        self.image = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: imageObj.width,
          height: imageObj.height
        });

        stage.width(imageObj.width);
        stage.height(imageObj.height);

        imageLayer.add(self.image);
        imageLayer.draw();
        imageLayer.visible(false);
        svgObj.onload = function() {
          self.svg = new Konva.Image({
            x: 0,
            y: 0,
            image: svgObj,
            width: imageObj.width,
            height: imageObj.height
          });

          svgLayer.add(self.svg);
          svgLayer.draw();
          p.resolve();
        };

        svgObj.src = data.svg;
      };

      imageObj.src = data.image;

      return p.promise;

    }

  }

})();