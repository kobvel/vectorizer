(function() {
  angular
    .module('Vectorizer.directives')
    .service('konva', konva);

  function konva() {
    return {
      restrict: 'E',
      scope: {
        stage: '=',
      },
      link: function(scope, element, attrs) {
        scope.stage = new Konva.Stage({
          container: element,
          width: 0,
          height: 0
        });
      }
    };
  }
})();