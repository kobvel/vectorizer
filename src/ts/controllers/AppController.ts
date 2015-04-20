///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.controllers')
    .controller('AppController', AppController);

  AppController.$inject = ['Uploader', 'Loader', 'Stage', '$scope', 'Params'];
  
  function AppController(Uploader, Loader, Stage, $scope, Params) {
    var self = this;
    var tabs1 = [
      { icon: 'icon-save', text: 'Save' },
      { icon: 'icon-share', text: 'Share' }
    ];
    var tabs2 = 
      [
      { icon: 'icon-edit', text: 'Edit' },
      { icon: 'icon-params', text: 'Params' },
      { icon: 'icon-filter', text: 'Filter' },
      { icon: 'icon-user', text: 'User' },
      { icon: 'icon-info', text: 'Info' },
      { icon: 'icon-docs', text: 'Docs' },
      { icon: 'icon-comment', text: 'Comment'}      
    ];

    angular.extend(self, {
      stage: Stage,
      loader: Loader,
      file: null,
      pickColor: pickColor,
      dataChanged: dataChanged,
      changeVisibleLayer: changeVisibleLayer,
      changeToggleCollapse: changeToggleCollapse,
      visibleLayer: null,
      isCollapsed: true,
      Params: Params,
      tabs1: tabs1,
      tabs2: tabs2,
      currentTab1: tabs1[0],
      currentTab2: tabs2[0]
    });

    function pickColor($event, model) {
      $event.stopPropagation();
      $scope.$broadcast('setModel', {
        model: model
      });

    };

    function changeToggleCollapse() {
      self.isCollapsed = !self.isCollapsed;
    }

    function changeVisibleLayer() {
      
      if (self.visibleLayer === 'SVG') {
        self.stage.svgLayer.visible(true);
        self.stage.imageLayer.visible(false);
      } else if (self.visibleLayer === 'IMG') {
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
          fileData.append('params', JSON.stringify(Params.input));
          fileData.append('gamma', JSON.stringify(Params.gamma));
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
                  });
              });
        }, function uploadError(reason) {
          console.log(reason);
        });

      promise['finally'](function() {
        Loader.loading(false);
      });
    };
  };
})();