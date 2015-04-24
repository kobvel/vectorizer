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
        var imageData;
        var pixelStack = [];

        angular.extend(self, {
            stage: Stage,
            editImage: editImage,
            stopEdit: stopEdit,
            clearArea: clearArea,
            getCanvas: getCanvas,
            fillArea: fillArea,
            cRedo: cRedo,
            cUndo: cUndo
            });

        function getCanvas() {
            return canvas[0].toDataURL();            
        }
        function cPush() {
            cStep++;
            if (cStep < cPushArray.length) { cPushArray.length = cStep; }            
            cPushArray.push(canvas[0].toDataURL());         
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
        function fillArea() {
            canvas = Stage.element.find('canvas:nth-child(3)');

            canvas.bind('click', startFill);
        }


        function startFill(e) {
            ctx = canvas[0].getContext('2d');
            var canvasOffset = canvas.offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            var canvasWidth = canvas[0].width;
            var canvasHeight = canvas[0].height;

            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var colorLayerData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            pixelStack = [[canvasX, canvasY]];
            console.log(imageData.data);
            var fillColor = {
                red: 111,
                green: 38,
                blue: 38,
                alpha: imageData.data[3]
            };
            var setColor = {
                red: 255,
                green: 255,
                blue: 255
            };
            
           
        
           
            while (pixelStack.length)
            {
                var newPos, x, y, pixelPos, reachLeft, reachRight;
                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];

                pixelPos = (y * canvasWidth + x) * 4;
                while(y-- >= 1 && matchStartColor(pixelPos))
                {
                    pixelPos -= canvasWidth * 4;
                }
                pixelPos += canvasWidth * 4;
                ++y;
                reachLeft = false;
                reachRight = false;
                while(y++ < canvasHeight+2  && matchStartColor(pixelPos))
                {

                    colorPixel(pixelPos);
                  

                    if(x > 0)
                    {

                        if(matchStartColor(pixelPos - 4))
                        {

                            if(!reachLeft){
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        }
                        else if(reachLeft)
                        {
                            reachLeft = false;
                        }
                    }

                    if(x < canvasWidth-1)
                    {
                        if(matchStartColor(pixelPos + 4))
                        {
                            if(!reachRight)
                            {
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        }
                        else if(reachRight)
                        {
                            reachRight = false;
                        }
                    }

                    pixelPos += canvasWidth * 4;
                }
            }
            console.log(colorLayerData);
            ctx.putImageData(colorLayerData, 0, 0);

            function matchStartColor(pixelPos)
            {
                var r = colorLayerData.data[pixelPos];    
                var g = colorLayerData.data[pixelPos+1];    
                var b = colorLayerData.data[pixelPos+2];
                console.log(r == fillColor.red && g ==  fillColor.green && b == fillColor.red);
                return (r == setColor.red && g ==  setColor.green && b == setColor.red);
            }

            function colorPixel(pixelPos)
            {
                colorLayerData.data[pixelPos] = fillColor.red;
                colorLayerData.data[pixelPos+1] = fillColor.green;
                colorLayerData.data[pixelPos+2] = fillColor.red;
                colorLayerData.data[pixelPos+3] = 255;
            }         


        }


    };
    })();