(function () {
    angular.module('Vectorizer.directives').directive('loader', loader);
    function loader() {
        return {
            restrict: 'E',
            template: '<div class="loader" ng-if="$rootScope.loading">{{$rootScope.loading ? "+" : "-"}}</div>'
        };
    }
})();

//# sourceMappingURL=../directives/loader.js.map