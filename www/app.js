'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngLocale',
    'ngCordova',
    'ngRoute',
    'ngTouch',
    'pascalprecht.translate',
    'ui.bootstrap',
    'angular-md5',
    'angularModalService',
    'dialogService',
    'angular-gestures',
    'treeGrid',
    'ngIOS9UIWebViewPatch'
]);



angular.module('app').factory('$exceptionHandler',function(){
    return function(exception, cause) {
        var logger = Logger.getInstance("$exceptionHandler");
        var logMethod = logger.startMethod("$exceptionHandler");
        logMethod.error(Logger.lvlError, "exception:");
        if (exception != null) {
            logMethod.error(Logger.lvlError, exception.toString());
            logMethod.error(Logger.lvlError, exception.stack);
        } else {
            logMethod.error(Logger.lvlError, "- not set -");
        }
        logMethod.error(Logger.lvlError, "cause:");
        logMethod.error(Logger.lvlError, cause);
        logMethod.end();

    };
});
