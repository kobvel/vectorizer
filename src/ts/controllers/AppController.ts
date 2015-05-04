///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />
declare var VK:any;

(function() {
  angular
  .module('Vectorizer.controllers')
  .controller('AppController', AppController);

  AppController.$inject = ['Uploader', 'Loader', 'Stage', 'BroadcastService', 'Params'];

  function AppController(Uploader, Loader, Stage, BroadcastService, Params) {
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
      processExistingImage: processExistingImage,
      changeVisibleLayer: changeVisibleLayer,
      changeToggleCollapse: changeToggleCollapse,
      processDataUrl: processDataUrl,
      visibleLayer: 'SVG',
      isCollapsed: true,
      Params: Params,
      tabs1: tabs1,
      tabs2: tabs2,
      currentTab1: tabs1[0],
      currentTab2: tabs2[0]
      });

    
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