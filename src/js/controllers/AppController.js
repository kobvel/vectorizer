(function() {
  angular
    .module('Vectorizer.controllers')
    .controller('AppController', AppController);

  AppController.$inject = ['Uploader', 'Loader', 'Stage'];

  function AppController(Uploader, Loader, Stage) {
    var self = this;

    angular.extend(self, {
      stage: Stage,
      loader: Loader,
      file: null,
      fileChanged: fileChanged
    });

    function fileChanged() {
      var promise = Uploader
        .getFileData(self.file)
        .then(function getDataSuccess(fileData) {
          console.log(fileData);
          uploadImageData(fileData);
        }, function getDataError(reason) {
          console.log(reason);
        });
    };

    function uploadImageData(fd) {
      Loader.loading(true);

      var promise = Uploader
        .upload(fd)
        .then(function uploadSuccess(response) {
          Stage.loadData(response.data);
        }, function uploadError(reason) {
          console.log(reason);
        });

      promise['finally'](function() {
        Loader.loading(false);
      });
    };
  };
})();