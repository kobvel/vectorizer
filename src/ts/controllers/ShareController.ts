///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />
declare var VK:any;
(function() {
    angular
    .module('Vectorizer.controllers')
    .controller('ShareController', ShareController);

    ShareController.$inject = ['$scope', 'Stage'];

    function ShareController($scope, Stage) {
        var self = this;

        angular.extend(self, {
            stage: Stage,
            shareVk: shareVk
            });

        function shareVk() { 

            VK.init({
                apiId: 4888836
                });
            console.log(getImageFromStage());
            VK.Api.call('wall.post', {message: 'Test123'}, function(r) { 
                if (r.response) { 
                    alert(r.response); 
                } 
                }); 
        };

        function getImageFromStage() {
            var png = self.stage.svgLayer.toImage({
                callback: function(img){
                    console.log(img);
                }
                });
            return png;
        }
    };
    })();