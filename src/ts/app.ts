///<reference path="../../tools/typings/tsd.d.ts" />
///<reference path="../../tools/typings/typescriptApp.d.ts" />

angular.module('Vectorizer.controllers', []);
angular.module('Vectorizer.directives', []);
angular.module('Vectorizer.services', []);


angular
  .module('Vectorizer', [
    'Vectorizer.controllers',
    'Vectorizer.directives',
    'Vectorizer.services',
    'ui.bootstrap',
    'ui.bootstrap-slider'
  ])
  .run(['$rootScope',
    function($rootScope) {
      $rootScope.loading = false;
    }
  ]);
