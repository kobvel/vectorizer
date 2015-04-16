(function () {
    angular.module('Vectorizer.services').service('Loader', Loader);
    function Loader() {
        return {
            isLoading: false,
            loading: loading
        };
        function loading(isLoading) {
            this.isLoading = isLoading;
        }
    }
})();

//# sourceMappingURL=../services/Loader.js.map