(function() {
  angular
    .module('Vectorizer.controllers')
    .controller('AppController', AppController);

  function AppController() {
    var self = this;

    self.stage = null;
  };

})();