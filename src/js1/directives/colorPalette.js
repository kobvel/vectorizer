(function () {
    angular.module('Vectorizer.directives').directive('colorPalette', colorPalette);
    colorPalette.$inject = ['$document'];
    function colorPalette($document) {
        return {
            restrict: 'E',
            templateUrl: 'views/colorPalette.html',
            link: function (scope, element, attrs) {
                var elements;
                scope.$on('imageChanged', imageChanged);
                scope.$on('setModel', setModel);
                function setModel(event, data) {
                    $document.bind('click', bindClickDocument);
                    scope.picker = data.model;
                    elements = element.find('.swatch');
                    elements.bind('mousemove', bindMouseMove);
                    elements.bind('click', setClickHandler);
                }
                ;
                function bindClickDocument(event) {
                    var isChild = element.has(event.target).length > 0;
                    var isSelf = element[0] === event.target;
                    var isInside = isChild || isSelf;
                    if (!isInside) {
                        $document.unbind('click', bindClickDocument);
                        elements.unbind('mousemove', bindMouseMove);
                        elements.unbind('click', setClickHandler);
                    }
                }
                function bindMouseMove(e) {
                    scope.app.input[scope.picker] = colorToHex($(this).css('background-color'));
                    scope.$apply();
                }
                ;
                function setClickHandler(e) {
                    scope.app.input[scope.picker] = colorToHex($(this).css('background-color'));
                    scope.$apply();
                    elements.unbind('click', setClickHandler);
                    elements.unbind('mousemove', bindMouseMove);
                }
                ;
                function colorToHex(color) {
                    console.log(color);
                    if (color.substr(0, 1) === '#') {
                        return color;
                    }
                    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
                    var red = parseInt(digits[2]);
                    var green = parseInt(digits[3]);
                    var blue = parseInt(digits[4]);
                    var rgb = blue | green << 8 | red << 16;
                    return digits[1] + '#' + rgb.toString(16);
                }
                ;
                scope.rgbToHex = function (arr) {
                    var r = arr[0];
                    ;
                    var g = arr[1];
                    ;
                    var b = arr[2];
                    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
                };
                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }
                function imageChanged(event, data) {
                    var imageObj = data.image.getImage();
                    var colorThief = new ColorThief();
                    var palette = colorThief.getPalette(imageObj);
                    scope.palette = palette;
                    console.log(palette);
                }
            }
        };
    }
})();

//# sourceMappingURL=../directives/colorPalette.js.map