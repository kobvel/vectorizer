(function() {
  angular
    .module('Vectorizer.directives')
    .directive('colorPalette', colorPalette);

  function colorPalette() {
    return {
      restrict: 'E',
      scope: {
        //getPalette: '&'
      },
      templateUrl: 'views/colorPalette.html',
      link: function(scope, element, attrs, ngModel) {
        scope.$on('imageChanged', imageChanged);

        scope.rgbToHex = function(arr) {
          var r = arr[0];;
          var g = arr[1];;
          var b = arr[2];
          return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function componentToHex(c) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        }

        function imageChanged(event, data) {

          var imageObj = data.image.getImage();
          var colorThief = new ColorThief();
          var palette = colorThief.getPalette(imageObj);
          scope.palette = palette;
          console.log(palette);
        }
      }
    };
  }
})();