(function() {
  angular
    .module('Vectorizer.controllers')
    .controller('AppController', AppController);


  AppController.$inject = ['Uploader', 'Loader', 'Stage', '$scope'];


  function AppController(Uploader, Loader, Stage, $scope) {
    var self = this;

    angular.extend(self, {
      stage: Stage,
      loader: Loader,
      file: null,
      pickColor: pickColor,
      dataChanged: dataChanged,
      changeVisibleLayer: changeVisibleLayer,
      visibleLayer: null,
      input: {
        turdsize: 2,
        alphamax: 1,
        turnpolicy: 'black',
        opttolerance: 0.2,
        color: '#000000',
        fillcolor: '#FFFFFF',
        flat: false,
        tight: false
      },
      turnpolicy: ['black', 'white', 'minority', 'majority', 'left', 'right', 'random'],
    });

    function pickColor($event, model) {
      $event.stopPropagation();
      $scope.$broadcast("setModel", {
        model: model
      });

    };

    function changeVisibleLayer() {
      console.log(self);
      if (self.visibleLayer == 'SVG') {
        self.stage.svgLayer.visible(true);
        self.stage.imageLayer.visible(false);
      } else if (self.visibleLayer == 'IMG') {
        self.stage.svgLayer.visible(false);
        self.stage.imageLayer.visible(true);
      } else {
        self.stage.svgLayer.visible(true);
        self.stage.imageLayer.visible(true);

      }
    }

    function dataChanged() {
      var promise = Uploader
        .getFileData(self.file)
        .then(function getDataSuccess(fileData) {
          fileData.append('params', JSON.stringify(self.input));
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
          Stage.loadData(response.data).then(function() {
            $scope.$broadcast('imageChanged', {
              image: self.stage.image
            })
          })
        }, function uploadError(reason) {
          console.log(reason);
        });

      promise['finally'](function() {
        Loader.loading(false);
      });
    };
  };
})();