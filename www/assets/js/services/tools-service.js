
(function () {
    'use strict';
    angular.module('app').factory('toolsService', toolsService);

    toolsService.$inject = [ '$rootScope', 'dbService', 'constants', '$window', '$location' ];

    function toolsService($rootScope,  dbService, constants, $window, $location) {
        var logger = Logger.getInstance("toolsService");

        //scope
        var toolsService = {
            init: init,
            isWifiConnected: isWiFiConnected,
            checkForDeviceType: checkForDeviceType,
            loadPreferences: loadPreferences
        };
        return toolsService;


        


        function init () {
            $rootScope.$on('$viewContentLoaded', function(event) {
                Logger.printMethodStatistic();
            });
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                //console.log("route from "+current+" to "+next);

                if (!dbService.isInitialized()) {
                    event.preventDefault();
                    return;
                }

                if ($rootScope.splashVisible) {
                    event.preventDefault();
                    return;
                }

                var logMethod = logger.startMethod("$routeChangeStart");

                

                //get data loaded flag
                var dataLoaded = constants.dataLoaded;
                if (!dataLoaded) {
                    //flag is null, first time start, or storage invalid
                    constants.dataLoaded = false;
                    dataLoaded = false;
                }
                logMethod.log(Logger.lvlDebug, "logged_in: " + loggedIn);
                logMethod.log(Logger.lvlDebug, "data_loaded: " + dataLoaded);


                if (current && current.controller) {
                    logMethod.log(Logger.lvlDebug, "current: " + current.controller);
                }
                if (next && next.controller) {
                    logMethod.log(Logger.lvlDebug, "next: " + next.controller);
                }


                if (next && next.controller) {
                    if (next.controller == "LoadingCtrl") {
                        //is ok
                        logMethod.end();
                    } else if (next.controller == "SettingsCtrl") {
                        //is ok
                        logMethod.end();
                    } else if (next.controller == "DebugCtrl") {
                        //is ok
                        logMethod.end();
                    } else if (next.controller == "LoginCtrl") {
                        //is ok
                        logMethod.end();
                    } else {
                        if (!loggedIn) {
                            logMethod.log(Logger.lvlInfo, "user needs to login before");
                            logMethod.end();
                            event.preventDefault();
                            $rootScope.navigateTo ("login");
                        } else {
                            //check if we have loaded all our data
                            if (dataLoaded) {
                                logMethod.log(Logger.lvlInfo, "goto " + next.controller);
                                logMethod.end();
                            } else {
                                logMethod.log(Logger.lvlInfo, "we need to load our data first");
                                logMethod.end();
                                event.preventDefault();
                            }
                        }
                    }
                } else {
                    logMethod.end();
                }
            });

            $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
                var logMethod = logger.startMethod("$routeChangeSuccess");
                $window.scrollTo(0, 0);
                $rootScope.$broadcast("closeMenu");
                logMethod.end();
            });
        }





        function isWiFiConnected() {
            if (navigator.connection) {
                var networkState = navigator.connection.type;
                /*
                 var states = {};
                 states[Connection.UNKNOWN]  = 'Unknown connection';
                 states[Connection.ETHERNET] = 'Ethernet connection';
                 states[Connection.WIFI]     = 'WiFi connection';
                 states[Connection.CELL_2G]  = 'Cell 2G connection';
                 states[Connection.CELL_3G]  = 'Cell 3G connection';
                 states[Connection.CELL_4G]  = 'Cell 4G connection';
                 states[Connection.CELL]     = 'Cell generic connection';
                 states[Connection.NONE]     = 'No network connection';

                 console.log('Connection type: ' + states[networkState]);
                 //console.log(JSON.stringify(navigator.connection));
                 */
                return (networkState === Connection.WIFI);
            } else {
                //console.log("no connection");
                return false;
            }
        }


        // Detect device type (phone/tablet)
        function checkForDeviceType() {
            var logMethod = logger.startMethod("checkForDeviceType");
            var w = $window.innerWidth;
            var h = $window.innerHeight;

            if (w > 768 || h > 768) {
                //must be a tablet (hopefully...)
                constants.isTablet = true;
                constants.isPhone = false;
                logMethod.log(Logger.lvlDebug, 'we are running on a tablet (hopefully)');
            } else {
                constants.isPhone = true;
                constants.isTablet = false;
                logMethod.log(Logger.lvlDebug, 'we are running on a phone (hopefully)');
            }


            //orientation
            if (w < h) {
                constants.isOrientationPortrait = true;
            } else {
                constants.isOrientationPortrait = false;
            }


            //display class
            var checkW = w;
            var checkH = h;
            logMethod.log(Logger.lvlDebug, "display check w: "+checkW);
            logMethod.log(Logger.lvlDebug, "display check h: "+checkH);
            if (!constants.isOrientationPortrait) {
                checkH = w;
                checkW = h;
            }
            if (checkW >= 500) {
                //tablet or big phone
                constants.displayClass = "XL";

            } else if (checkW >= 375) {
                //phone (6 or 6p)
                constants.displayClass = "L";

            } else {
                //phone (4 or 5)
                if (checkH <= 480) {
                    //small (4)
                    constants.displayClass = "S";
                } else {
                    //medium (5)
                    constants.displayClass = "M";
                }
            }

            logMethod.log(Logger.lvlDebug, 'display class: '+constants.displayClass);
            logMethod.log(Logger.lvlDebug, 'orientation is portrait: '+constants.isOrientationPortrait);
            logMethod.end();
        }



        //preference preloading
        var preferences = [];
        var preferencesCallback = null;
        function loadPreferences (callback) {
            $rootScope.preferencesChanged = false;
            preferencesCallback = callback;
            var logMethod = logger.startMethod("loadPreferences");
            preferences = [ "host","ws_host" ];

            loadPreference();

            logMethod.end();
        }

        function loadPreference () {
            var logMethod = logger.startMethod("loadPreference");

            if (preferences.length === 0) {
                //all loaded
                logMethod.log(Logger.lvlDebug, "all preferences loaded");
                logMethod.end();
                loadPreferencesDone();
                return;
            }

            //load image
            var preference = preferences[0];
            preferences.splice(0,1);

            logMethod.log(Logger.lvlDebug, "read preference: "+preference);
            
        }

        function loadPreferencesDone () {
            //var logMethod = logger.startMethod("loadPreferencesDone");
            //logMethod.end();
            $rootScope.preferencesChanged = false; //TODO unused right now
            preferencesCallback();
        }

    };
})();
