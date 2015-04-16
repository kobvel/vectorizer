///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.services')
    .service('Loader', Loader);


  function Loader() {
    return {
      isLoading: false,
      loading: loading
    };

    function loading(isLoading) {
      this.isLoading = isLoading;
    }
  }
})();