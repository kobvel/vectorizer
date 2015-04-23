///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
  .module('Vectorizer.services')
  .service('BroadcastService', BroadcastService);

  BroadcastService.$inject = ['$rootScope'];
  function BroadcastService($rootScope) {
    return {   
      imageChanged: imageChanged     
    };
  

    function imageChanged(image) {
      $rootScope.$broadcast('imageChanged', {
        image: image
        });
    }

    }})();