///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
  .module('Vectorizer.directives')
  .directive('imageEditor', imageEditor);

  imageEditor.$inject = ['$document'];

  function imageEditor($document) {
      return {
          restrict: 'A',

          link: function(scope, element, attrs, ngModel) {
              scope.$on('editEnable', editEnable);
              var ctx, canvas;
              var mousePressed = false;
              var lastX;
              var lastY;

              function bindClickDocument(event) {

                  var isChild = element.has(event.target).length > 0;
                  var isSelf = element[0] === event.target;
                  var isInside = isChild || isSelf;

                  if (!isInside) {
                      /* $document.unbind('click', bindClickDocument);
                       canvas.unbind('mousemove', bindMouseMove);
                       canvas.unbind('click', setMouseUp);*/
                  }
              }           

              function editEnable(event) {
                  
                  canvas = element.find('canvas:nth-child(3)');
                  ctx = canvas[0].getContext('2d');

                  canvas.bind('mousemove', function(e) {
                      if (mousePressed) {
                          drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
                      }

                  });
                  canvas.bind('mousedown', function(e) {
                    mousePressed = true;
                      drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
                  });
                  canvas.bind('mouseup', function(e) {
                      mousePressed = false;
                  });

                  canvas.bind('mouseleave', function(e) {
                    mousePressed = false;
                  });
              }

              function clearArea() {
                  ctx.setTransform(1, 0, 0, 1, 0, 0);
                  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              }

              function drawLine(x, y, isDown) {
                  if (isDown) {
                      ctx.beginPath();
                      ctx.strokeStyle = '#000000';
                      ctx.lineWidth = 12;
                      ctx.lineJoin = 'round';
                      ctx.moveTo(lastX, lastY);
                      ctx.lineTo(x, y);
                      ctx.closePath();
                      ctx.stroke();
                  }
                  lastX = x; lastY = y;
              }
          }
      };

  }
})();