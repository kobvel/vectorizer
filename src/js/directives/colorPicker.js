(function() {
  angular
    .module('Vectorizer.directives')
    .directive('colorPicker', colorPicker);

  colorPicker.$inject = ['$document'];

  function colorPicker($document) {
    return {
      restrict: 'A',

      link: function(scope, element, attrs, ngModel) {
        scope.$on('setModel', setModel);
        var ctx, canvas;



        function bindClickDocument(event) {
          var isChild = element.has(event.target).length > 0;
          var isSelf = element[0] == event.target;
          var isInside = isChild || isSelf;

          if (!isInside) {
            $document.unbind('click', bindClickDocument);
            canvas.unbind('mousemove', bindMouseMove);
            canvas.unbind('click', setClickHandler);

          }
        }

        function setModel(event, data) {
          $document.bind('click', bindClickDocument);
          canvas = element.find('canvas:nth-child(1)');
          scope.picker = data.model;
          canvas.bind('mousemove', bindMouseMove);
          canvas.bind('click', setClickHandler);
          ctx = canvas[0].getContext("2d");
        };

        function bindMouseMove(e) {

          var canvasOffset = canvas.offset();
          var canvasX = Math.floor(e.pageX - canvasOffset.left);
          var canvasY = Math.floor(e.pageY - canvasOffset.top);
          var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
          var pixel = imageData.data;



          var pixelColor = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";
          scope.app.input[scope.picker] = pixelColor;
          scope.$apply();

        };

        function setClickHandler(e) {
          var canvasOffset = canvas.offset();
          var canvasX = Math.floor(e.pageX - canvasOffset.left);
          var canvasY = Math.floor(e.pageY - canvasOffset.top);
          var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
          var pixel = imageData.data;


          var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
          scope.app.input[scope.picker] = '#' + dColor.toString(16);
          scope.$apply();

          canvas.unbind("click", setClickHandler);
          canvas.unbind("mousemove", bindMouseMove);
        };

      }
    };
  }
})();