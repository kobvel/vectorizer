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
      pbm: null,
    };

    function loadData(data) {
      var p = $q.defer();
      var self = this;


      this.imageLayer = new Konva.Layer();
      this.svgLayer = new Konva.Layer();
      this.pbmLayer = new Konva.Layer();
      var stage = this.stage;
      var imageLayer = this.imageLayer;
      var svgLayer = this.svgLayer;
      var pbmLayer = this.pbmLayer;
      stage.destroyChildren();


      stage.add(imageLayer);
      stage.add(svgLayer);
      stage.add(pbmLayer);
      var imageObj = new Image();
      var svgObj = new Image();
      var pbmObj = new Image();

      imageObj.onload = function() {
        var scale = self.offsetWidth / imageObj.width;
        self.image = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: imageObj.width * scale,
          height: imageObj.height * scale
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
            width: imageObj.width * scale,
            height: imageObj.height * scale
          });

          svgLayer.add(self.svg);
          svgLayer.draw();
          p.resolve();
        };

        pbmObj.onload = function() {
          self.pbm = new Konva.Image({
            x: 0,
            y: 0,
            image: pbmObj,
            width: imageObj.width * scale,
            height: imageObj.height * scale
          });

          pbmLayer.add(self.pbm);
          pbmLayer.draw();
          pbmLayer.visible(false);
          p.resolve();
        };
        pbmObj.src = data.pbm;
        svgObj.src = data.svg;
      };

      imageObj.src = data.image;

      return p.promise;

    }

  }

})();