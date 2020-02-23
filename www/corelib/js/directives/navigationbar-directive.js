(function () {
    'use strict';
    angular.module('app').directive('navigationBar', function ($rootScope, $window) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'corelib/js/directives/navigationbar-template.html',
            link: function ($scope, elem, attrs) {

                $scope.vm.navBarWidth = $window.innerWidth;

                angular.element($window).bind("resize", function (evt) {
                    $scope.$apply(function () {
                        $scope.vm.navBarWidth = $window.innerWidth;
                    });
                });

                $scope.vm.navBarBackClicked = function() {
                    if (!$scope.vm.navBarBackEnabled) return;

                    $scope.$broadcast("navigationBarBackClicked", $scope.vm.navBarBackPath);
                }
                $scope.vm.navBarButtonClicked = function() {
                    if (!$scope.vm.navBarButtonEnabled) return;

                    $scope.$broadcast("navigationBarButtonClicked");
                }
            }
        };
    });
})();



(function () {
    'use strict';
    angular.module('app').factory('navigationBar', navigationBar);

    navigationBar.$inject = [ '$rootScope', '$window'];

    function navigationBar($rootScope, $window) {

        //scope
        var navigationBar = {
            init: init,
            setup: setup,
            setBadgeCount: setBadgeCount,
            goBack: goBack,
            IsetSubTitle: IsetSubTitle,
            isBackEnabled: isBackEnabled,
            isButtonEnabled: isButtonEnabled,
            setButtonIcon: setButtonIcon,
            setBackButtonEnabled: setBackButtonEnabled,
            setButtonsEnabled: setButtonsEnabled,
            setButtonsVisible: setButtonsVisible
        };
        return navigationBar;

        function isButtonEnabled () {
            return (navigationBar.vm.navBarButtonEnabled && navigationBar.vm.navBarButtonVisible);
        }

        function isBackEnabled () {
            return (navigationBar.vm.navBarBackEnabled && navigationBar.vm.navBarBackEnabled);
        }

        function goBack () {
            $rootScope.$broadcast("navigationBarBackClicked", navigationBar.vm.navBarBackPath);
        }

        function init (vm) {
            navigationBar.vm = vm;
            navigationBar.vm.navBarLeft = 0;

            navigationBar.vm.getNavBarClass = function () {
                return navigationBar.vm.navBarClass;
            };
        }

        function setButtonsEnabled (back, button) {
            navigationBar.vm.navBarBackEnabled = back;
            navigationBar.vm.navBarButtonEnabled = button;
        }

        function setButtonsVisible (back, button) {
            navigationBar.vm.navBarBackVisible = back;
            navigationBar.vm.navBarButtonVisible = button;
        }

        function setBackButtonEnabled (enabled) {
            navigationBar.vm.navBarBackEnabled = enabled;
        }

        function setBadgeCount (cnt, type) {
            navigationBar.vm.navBarBadgeCount = cnt;
            navigationBar.vm.navBarBadgeType = type;
        }

        function setButtonIcon (icon) {
            navigationBar.vm.navBarButtonIcon = icon;
            if (icon.startsWith("glyphicon")) {
                navigationBar.vm.navBarButtonType = "glyph";
            } else {
                navigationBar.vm.navBarButtonType = "icon";
            }
        }

        function IsetSubTitle () {
            //calculate available space
            var subTitleSpace = 0;
            var winWidth = -1;

            if (navigationBar.vm.windowWidth == undefined) {
                winWidth = $window.innerWidth;
            } else {
                winWidth = navigationBar.vm.windowWidth;
            }


            if (navigationBar.vm.navBarBadgeCount > 0) {
                //badge count available
                subTitleSpace = winWidth-170;
            } else {
                //bon badge count
                //ip4 = 140
                //ip5 = ?
                //ip6 = 135
                subTitleSpace = winWidth-145;
            }

            //shorten subtitle to fit width
            navigationBar.vm.navBarSubTitle = navigationBar.vm.navBarSubTitleOrig.cutDownToWidth(navigationBar.vm.navBarSubTitleFont, subTitleSpace);
        }

        function setup (setup) {
            navigationBar.vm.navBarTitle = setup.title || "";
            navigationBar.vm.navBarSubTitleOrig = setup.subTitle || "";
            navigationBar.vm.navBarSubTitle = "";

            //back path
            navigationBar.vm.navBarBackPath = setup.backPath;

            //back enabled?
            if (setup.backEnabled != null) {
                navigationBar.vm.navBarBackEnabled = setup.backEnabled;
            } else {
                navigationBar.vm.navBarBackEnabled = true;
            }

            //back visible
            if (setup.backVisible != null) {
                navigationBar.vm.navBarBackVisible = setup.backVisible;
            } else {
                navigationBar.vm.navBarBackVisible = true;
            }

            //button enabled?
            if (setup.buttonEnabled != null) {
                navigationBar.vm.navBarButtonEnabled = setup.buttonEnabled;
            } else {
                navigationBar.vm.navBarButtonEnabled = true;
            }

            //back visible
            if (setup.buttonVisible != null) {
                navigationBar.vm.navBarButtonVisible = setup.buttonVisible;
            } else {
                navigationBar.vm.navBarButtonVisible = true;
            }

            //nav bar border color
            if (setup.class != null) {
                navigationBar.vm.navBarClass = setup.class;
            }
            /*
            if (setup.borderColor != null) {
                navigationBar.vm.navBarBorderColor = "#" + setup.borderColor;
            } else {
                navigationBar.vm.navBarBorderColor = "#fbba00";
            }
            */

            //button type
            if (setup.buttonIcon == null) {
                //no icon set, show menu button
                navigationBar.vm.navBarButtonType = "menu";
            } else {
                navigationBar.vm.navBarButtonIcon = setup.buttonIcon;
                if (setup.buttonIcon.startsWith("glyphicon")) {
                    navigationBar.vm.navBarButtonType = "glyph";
                } else {
                    navigationBar.vm.navBarButtonType = "icon";
                }
            }


            //check if there is a sub title
            if (navigationBar.vm.navBarSubTitleOrig == "") {
                //no subtitle, set style
                navigationBar.vm.navBarTitleClass = "navigationBarTitle";
            } else {
                //with subtitle, set style
                navigationBar.vm.navBarTitleClass = "navigationBarSubTitle";

                //set calculation font if not done yet
                if (!navigationBar.vm.navBarSubTitleFont) {
                    //TODO this have to be checked - when styles get overridden, this maybe wont work anymore
                    navigationBar.vm.navBarSubTitleFont = getStyle("#navigationBarTitle h2").style.fontSize+" "+getStyleProperty("body", "font-family");
                }


                IsetSubTitle();
            }
        }
    }
    ;
})();

