angular.module('app').directive('loadingScreen', function ($window, $timeout) {

    var widthHeightFix = 0;
    var dimensionTimer;

    return {
        restrict: 'E',
        templateUrl: 'assets/js/directives/loading-screen-template.html',
        link: function ($scope, elem, attrs) {


            angular.element($window).bind("scroll", function () {
                var elem = document.getElementById("loadingScreenContainer");
                elem.style.top = pageYOffset + 'px';
            });

            angular.element($window).bind("resize", function () {
                var elem = document.getElementById("loadingScreenContainer");
                elem.style.width = ($window.innerWidth+widthHeightFix)+'px';
                elem.style.height = ($window.innerHeight+widthHeightFix)+'px';
            });

            var listenForSizeChange = function () {
                dimensionTimer = $timeout(function () {
                    var elem = document.getElementById("loadingScreenContainer");
                    elem.style.width = ($window.innerWidth+widthHeightFix)+'px';
                    elem.style.height = ($window.innerHeight+widthHeightFix)+'px';

                    listenForSizeChange();
                },250);
            };

            $scope.$on("hideLoadingScreen", function (e) {
                var elem = document.getElementById("loadingScreenContainer");
                elem.style.visibility = "hidden";
                if (dimensionTimer) {
                    $timeout.cancel(dimensionTimer);
                }
            });

            $scope.$on("showLoadingScreen", function (e) {
                listenForSizeChange();
                var elem = document.getElementById("loadingScreenContainer");
                elem.style.visibility = "visible";
                elem.style.width = ($window.innerWidth+widthHeightFix)+'px';
                elem.style.height = ($window.innerHeight+widthHeightFix)+'px';
            });
            $scope.$on("setLoadingPercent", function (e, percent) {
                var elem = document.getElementById("loadingPercent");
                if (!percent || percent === "") {
                    elem.innerHTML = "";
                } else {
                    elem.innerHTML = percent + "%";
                }
            });
            $scope.$on("setLoadingText", function (e, text) {
                var elem = document.getElementById("loadingText");
                elem.innerHTML = text;
            });
        }
    };
});
