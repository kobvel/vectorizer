///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
    angular
    .module('Vectorizer.controllers')
    .controller('EditorController', EditorController);

    EditorController.$inject = ['Stage'];

    function EditorController(Stage) {
        var self = this;
        var ctx, canvas;
        var mousePressed = false;
        var lastX;
        var lastY;        
        var cPushArray = [];
        var cStep = -1;

        angular.extend(self, {
            stage: Stage,
            editImage: editImage,
            stopEdit: stopEdit,
            clearArea: clearArea,
            cRedo: cRedo,
            cUndo: cUndo
            });

        function cPush() {
            cStep++;
            if (cStep < cPushArray.length) { cPushArray.length = cStep; }            
            cPushArray.push(canvas[0].toDataURL());
            console.log(cPushArray);
        }

        function cUndo(event) {
            if (cStep > 0) {
                cStep--;
                var canvasPic = new Image();
                canvasPic.src = cPushArray[cStep];
                canvasPic.onload = function() {
                    ctx.drawImage(canvasPic, 0, 0);
                };
            }
        }

        function cRedo(event) {
            if (cStep < cPushArray.length - 1) {
                cStep++;
                var canvasPic = new Image();
                canvasPic.src = cPushArray[cStep];
                canvasPic.onload = function() {
                    ctx.drawImage(canvasPic, 0, 0);
                };
            }
        }

        function editImage(event) {
            canvas = Stage.element.find('canvas:nth-child(3)');
            console.log(Stage.element, canvas);
            ctx = canvas[0].getContext('2d');
            canvas.bind('mousemove', moveHandler);
            canvas.bind('mousedown', downHandler);
            canvas.bind('mouseup', upHandler);
            canvas.bind('mouseleave', leaveHandler);

        }                     

        function stopEdit() {
            console.log(canvas);
            canvas.unbind('mousemove', moveHandler);
            canvas.unbind('mousedown', downHandler);
            canvas.unbind('mouseup', upHandler);
            canvas.unbind('mouseleave', leaveHandler);

        }
        function leaveHandler(e) {
            mousePressed = false;
        }
        function upHandler(e) {
            mousePressed = false;
        }
        function downHandler(e) {
            cPush();
            mousePressed = true;
            drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
        }
        function moveHandler(e) {
            if (mousePressed) {
                drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
            }
        }
        function clearArea() {                
            cStep = 1;
            cUndo(event);
        }

        function drawLine(x, y, isDown) {
            if (isDown) {
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                ctx.lineJoin = 'bevel';
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.stroke();
                
            }
            lastX = x; lastY = y;
        }

        
    };
    })();