(function() {
  angular
    .module('Vectorizer.directives')
    .directive('fileInput', fileInput);

  function fileInput() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        fileChanged: '&'
      },
      link: function(scope, element, attrs, ngModel) {

        element.on('change', handleChange);

        function handleChange(event) {
          var file = element[0].files[0];

          if (file) {
            ngModel.$setViewValue(file);
            scope.fileChanged();
          };
        }
      }
    };
  }
})();