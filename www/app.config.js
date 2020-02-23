var APP_MODULE_NAME = "app";

(function () {
    'use strict';
    angular.module('app').config(config);

    config.$inject = ['$routeProvider', '$translateProvider', 'hammerDefaultOptsProvider', '$sceProvider', '$httpProvider'];

    function config($routeProvider, $translateProvider, hammerDefaultOptsProvider, $sceProvider, $httpProvider) {

        // config for routing
        $routeProvider.when('/menu', {
            templateUrl: 'menu/menu.html',
            controller: 'MenuCtrl',
            controllerAs: 'vm'
        }).when('/calendar', {
            templateUrl: 'calendar/calendar.html',
            controller: 'CalendarCtrl',
            controllerAs: 'vm'
        }).otherwise({redirectTo: '/view1'});

        hammerDefaultOptsProvider.set({
            recognizers: [
                [Hammer.Pan,{ event: 'pan'}],
                [Hammer.Pinch, { event: 'pinch', pointers: 2}]
            ]
        });

        // config of angular-translate
        $translateProvider.useStaticFilesLoader({
            prefix: 'translation/',
            suffix: '.json'
        });

        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');

        $sceProvider.enabled (false);


        $httpProvider.interceptors.push(function ($rootScope, $q) {
            return {
                request: function (config) {
                    config.timeout = 10000; //global timeout
                    return config;
                },
                responseError: function (rejection) {
                    switch (rejection.status){
                        case 408 :
                            break;
                    }
                    return $q.reject(rejection);
                }
            }
        });


    };
})();
