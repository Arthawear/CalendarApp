angular.module('app').run(function ($rootScope, $window, $timeout, $location, $route, constants, navigationBar, toolsService) {
    
    var onReadyStart;
    var logger;

    var preventPageChange = false;

    var onDeviceReady = function () {
        constants.isWeb = false;
        Keyboard.automaticScrollToTopOnHiding = true;
        document.getElementById("appBlend").style.display = "none";

        onReadyStart = new Date();

        
        constants.isMobile = true; 
        constants.deviceID = device.uuid;

        if (window.cordova.logger) {
            window.cordova.logger.__onDeviceReady();
        }
        document.addEventListener("backbutton", onDeviceBackClicked, false);
        constants.isAndroid = true;
            
        $rootScope.navigateTo("/menu");
        $route.reload();
    };

    function onDeviceBackClicked() {
        $timeout(function () {
            navigationBar.goBack();
        }, 1);
    }
    $rootScope.navigateTo = function (path) {
        if (device.platform == 'iOS' && ((path.indexOf('workorderlist') !== -1) || (path.indexOf('overview') !== -1))) {
            if (!preventPageChange) {
                preventPageChange = true;
                $timeout(function () {
                    preventPageChange = false;
                    $location.path(path);
                }, 250);
            }
        } else {
            $location.path(path);
        }
    }
    $rootScope.navigateBack = function (path) {
        $rootScope.navigateTo("/menu");
        $route.reload();
    }
    toolsService.init();

    if ("cordova" in window) {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
});



