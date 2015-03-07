(function() {
  angular
    .module('Vectorizer.services')
    .service('Uploader', Uploader);

  Uploader.$inject = ['$http'];

  function Uploader($http) {
    return {
      upload: upload
    };

    function upload(data) {
      return $http.post('/url', data)
    }
  }

})();