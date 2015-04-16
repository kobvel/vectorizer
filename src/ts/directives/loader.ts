///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.directives')
    .directive('loader', loader);

  function loader() {
    return {
      restrict: 'E',
      template: '<div class="loader" ng-if="$rootScope.loading">{{$rootScope.loading ? "+" : "-"}}</div>'
    };
  }
})();