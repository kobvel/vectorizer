///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
    angular
    .module('Vectorizer.controllers')
    .controller('EditorController', EditorController);

    EditorController.$inject = ['Stage', '$rootScope'];

    function EditorController(Stage, $rootScope) {
        var self = this;
        var ctx, canvas;
        var mousePressed = false;
        var lastX;
        var lastY;        
        var cPushArray = [];
        var cStep = 0;
        var curColor;
        var imageData;
        var pixelStack = [];
        var fillColor;
        var counter1 = 0;
        var counter2 = 0;
        angular.extend(self, {
            stage: Stage,
            editImage: editImage,
            stopEdit: stopEdit,
            clearArea: clearArea,
            getCanvas: getCanvas,
            fillArea: fillArea,
            saveFirstState: saveFirstState,
            cRedo: cRedo,
            cUndo: cUndo,
            zoomArea: zoomArea,
            checkedColor: 'black'
            });

        function zoomArea(){

            var layer = self.stage.pbmLayer;
            var stage = self.stage;
            var zoomLevel = 2;
            canvas = Stage.element.find('canvas:nth-child(3)');
            ctx = canvas[0].getContext('2d');
            canvas.on('mouseenter', function() {
                layer.scale({
                    x : zoomLevel,
                    y : zoomLevel
                    });
                layer.draw();
                });
            canvas.on('mousemove', function(e) { 

                var canvasOffset = canvas.offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);                            
                layer.x( - (canvasX));
                layer.y( - (canvasY));
                layer.draw();
                });
            canvas.on('mouseleave', function() {
                layer.x(0);
                layer.y(0);
                layer.scale({
                    x : 1,
                    y : 1
                    });
                layer.draw();
                });
        }


        function saveFirstState() {
            canvas = Stage.element.find('canvas:nth-child(3)');            
            cStep++;
            cPushArray[0] = canvas[0].toDataURL();            
        }

        function getCanvas() {
            return canvas[0].toDataURL();            
        }

        function cPush() {
            cStep++;
            if (cStep < cPushArray.length) { 
                cPushArray.length = cStep;
            }            
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
            console.log($rootScope);
            canvas = Stage.element.find('canvas:nth-child(3)');
            ctx = canvas[0].getContext('2d');
            canvas.bind('mousemove', moveHandler);
            canvas.bind('mousedown', downHandler);
            canvas.bind('mouseup', upHandler);
            canvas.bind('mouseleave', leaveHandler);

        }                     
      
        function stopEdit() {
            console.log(counter1, counter2);
            canvas.unbind();
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
        function fillArea(color) {           

            if (color === 'black') {
                fillColor = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 255
                };
            }
            else {
                fillColor = {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 255
                };

            }
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
            console.log(canvasX, canvasY);
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var colorLayerData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            pixelStack = [[canvasX, canvasY]];
            

            cPush(); 
            floodfill(canvasX,canvasY,fillColor,ctx, canvasWidth, canvasHeight, 254);



//Floodfill functions
function floodfill(x,y,fillcolor,ctx,width,height,tolerance) {  

    var img = ctx.getImageData(0,0,width,height);
    var data = img.data;
    var length = data.length;
    var Q = [];
    var i = (x+y*width)*4;
    curColor = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
    };
    var e = i, w = i, me, mw, w2 = width*4;
    var targetcolor = [data[i],data[i+1],data[i+2],data[i+3]];
  

    if(!pixelCompare(i,targetcolor,fillcolor,data,length,tolerance)) { return false; }
    Q.push(i);
    while(Q.length) {
        i = Q.pop();
        if(pixelCompareAndSet(i,targetcolor,fillcolor,data,length,tolerance)) {
            e = i;
            w = i;
            mw = parseInt(i/w2)*w2; //left bound
            me = mw+w2;    //right bound            
            while(mw<(w-=4) && pixelCompareAndSet(w,targetcolor,fillcolor,data,length,tolerance)); //go left until edge hit
            while(me>(e+=4) && pixelCompareAndSet(e,targetcolor,fillcolor,data,length,tolerance)); //go right until edge hit
            for(var j=w;j<e;j+=4) {
                if (j - w2 >= 0 && pixelCompare(j - w2, targetcolor, fillcolor, data, length, tolerance)) {
                    Q.push(j - w2); } 
                    if (j + w2 < length && pixelCompare(j + w2, targetcolor, fillcolor, data, length, tolerance)){ 
                        Q.push(j + w2);
                    };
                }             
            }
        }
        ctx.putImageData(img,0,0);
    }

    function pixelCompare(i, targetcolor, fillcolor, data, length, tolerance) {

        if (i < 0 || i >= length) { 
            return false;
        } //out of bounds
        if (data[i + 3] === 0) {
            return true;
            };  //surface is invisible

            if (
                //(targetcolor[3] === fillcolor.a) &&
                (targetcolor[0] === fillcolor.r) &&
                (targetcolor[1] === fillcolor.g) &&
                (targetcolor[2] === fillcolor.b)
                ) {
                counter1++;
        return false; //target is same as fill
    }

    if (

        //(targetcolor[3] === data[i + 3]) &&
        (targetcolor[0] === data[i]) &&
        (targetcolor[1] === data[i + 1]) &&
        (targetcolor[2] === data[i + 2])
        ) {
        return true; //target matches surface 
    }

    if (
        Math.abs(targetcolor[3] - data[i + 3]) <= (255 - tolerance) &&
        Math.abs(targetcolor[0] - data[i]) <= tolerance &&
        Math.abs(targetcolor[1] - data[i + 1]) <= tolerance &&
        Math.abs(targetcolor[2] - data[i + 2]) <= tolerance
        ) {
        
        return true; //target to surface within tolerance 
    }
    /*else{
        counter2++;
        console.log(targetcolor,data[i], data[i+1],data[i+2],data[i+3]);    
    }*/
    
    return false; //no match
}

function pixelCompareAndSet(i,targetcolor,fillcolor,data,length,tolerance) {
    if(pixelCompare(i,targetcolor,fillcolor,data,length,tolerance)) {
        //fill the color
        data[i] = fillcolor.r;
        data[i+1] = fillcolor.g;
        data[i+2] = fillcolor.b;
        data[i+3] = fillcolor.a;
        return true;
    }
    return false;
}
}

};
})();