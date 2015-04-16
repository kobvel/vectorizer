///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.services')
    .service('Uploader', Uploader);

  Uploader.$inject = ['$http', '$q'];

  function Uploader($http, $q) {
    return {
      upload: upload,
      getFileData: getFileData
    };

    function upload(data) {
      return $http.post('/api/photo/', data, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });
    }

    function getFileData(file) {
      var deferred = $q.defer();
      var fr = new FileReader();
      var imageData;

      fr.onload = function(e) {
        console.log(e.target);
        imageData = e.target.result;
        var fd = new FormData;

        fd.append('imageData', imageData);
        deferred.resolve(fd);
      };

      fr.onerror = function frOnError(e) {
        deferred.reject(e);
      };

      fr.readAsDataURL(file);

      return deferred.promise;
    }
  }

})();