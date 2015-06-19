///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />
declare var VK:any;

(function() {
  angular
  .module('Vectorizer.controllers')
  .controller('AppController', AppController);

  AppController.$inject = ['Uploader', 'Loader', 'Stage', 'BroadcastService', 'Params', '$scope'];

  function AppController(Uploader, Loader, Stage, BroadcastService, Params, $scope) {
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
      broadcast: BroadcastService,
      file: null,   
      svgUrl: null,
      saveImg: saveImg,  
      dataChanged: dataChanged,
      changeVisibleLayer: changeVisibleLayer,
      changeToggleCollapse: changeToggleCollapse,      
      process: process,
      checkTab: checkTab,
      visibleLayer: 'SVG',
      isCollapsed: true,
      Params: Params,
      tabs1: tabs1,
      tabs2: tabs2,
      currentTab1: tabs1[0],
      currentTab2: tabs2[0]
      });

    console.log($scope);
    $scope.$watch(self.currentTab2, function() {
      if (self.currentTab2 == 'Edit') {
        console.log('go');
        self.stage.pbmLayer.visible(true);
        self.stage.svgLayer.visible(false);
        self.stage.imageLayer.visible(false);
      }
      else{
        console.log(self.currentTab2);
      }
    });

    function checkTab() {
      
      if (self.file) {
        if (self.currentTab2.text === 'Edit') { 
          self.visibleLayer = 'PBM';       
          self.stage.pbmLayer.visible(true);
          self.stage.svgLayer.visible(false);
          self.stage.imageLayer.visible(false);
        }
      }
    }

    function changeToggleCollapse() {
      self.isCollapsed = !self.isCollapsed;
    }

    function saveImg(){
      
      var link = document.createElement('a');
      link.download = 'test.png';
      link.href = self.stage.svgLayer.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      link.click();
      
    }
    function changeVisibleLayer() {
      if (self.file) {
        
        switch (self.visibleLayer) {
          case 'SVG':
          self.stage.svgLayer.visible(true);
          self.stage.pbmLayer.visible(false);
          self.stage.imageLayer.visible(false);
          
          break;
          case 'IMG':
          self.stage.svgLayer.visible(false);
          self.stage.imageLayer.visible(true);
          self.stage.pbmLayer.visible(false);
       
          break;
          case 'PBM':
          self.stage.pbmLayer.visible(true);
          self.stage.svgLayer.visible(false);
          self.stage.imageLayer.visible(false);
          
          break;
          case 'ALL':
          self.stage.pbmLayer.visible(false);
          self.stage.svgLayer.visible(true);
          self.stage.imageLayer.visible(true);
          break;
          default:
          self.stage.pbmLayer.visible(false);
          self.stage.svgLayer.visible(true);
          self.stage.imageLayer.visible(false);
        }
      }
    }

    function dataChanged() {
      var promise = Uploader
      .getFileData(self.file)
      .then(function getDataSuccess(fileData) {
        console.log(fileData);
        fileData.append('params', JSON.stringify(Params.input));
        fileData.append('gamma', JSON.stringify(Params.gamma));
        uploadImageData(fileData);
        }, function getDataError(reason) {
          console.log(reason);
          });
    };
    function process() {
      if(self.currentTab2 === 'Edit'){
      processExistingImage();
      } else{
         var canvas = Stage.element.find('canvas:nth-child(3)');
         var data = canvas[0].toDataURL();
      processDataUrl(data);
      }
    }
    function processExistingImage() {
      var data = new FormData;                  
      data.append('imagesrc', Stage.imagePath);
      data.append('params', JSON.stringify(Params.input));
      data.append('gamma', JSON.stringify(Params.gamma));    
      uploadImageData(data);       
    };

    function processDataUrl(fileBase64) {
      var data = new FormData;                  
      data.append('imageData', fileBase64);
      data.append('params', JSON.stringify(Params.input));
      data.append('gamma', JSON.stringify(Params.gamma));    
      uploadImageData(data);    
    }


    function uploadImageData(fd) {
      Loader.loading(true);

      var promise = Uploader
      .upload(fd)
      .then(function uploadSuccess(response) {
        Stage.loadData(response.data).then(function() {
          self.broadcast.imageChanged(self.stage.image);
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