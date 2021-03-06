///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.directives')
    .directive('konva', konva);

  function konva() {
    return {
      restrict: 'E',
      scope: {
        stage: '='
      },
      link: function(scope, element, attrs) {
        scope.stage.element = element;
        scope.stage.stage = new Konva.Stage({
          container: element[0],
          width: 110,
          height: 110
        });
        scope.stage.offsetWidth = element.parent()[0].offsetWidth - 30;

       
      }
    };
  }
})(); 