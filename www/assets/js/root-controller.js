(function () {
    'use strict';
    angular.module('app').controller('RootCtrl', RootCtrl);

    RootCtrl.$inject = ['$rootScope', '$route', '$scope', '$window', '$translate', '$filter', 'toolsService', 'constants',  'navigationBar',  '$timeout', 'ModalService', 'dialogService'];

    function RootCtrl($rootScope, $route, $scope, $window, $translate, $filter, toolsService, constants,  navigationBar,  $timeout, ModalService, dialogService) {
        var vm = this;
        vm.logger = Logger.getInstance("RootCtrl");
        vm.logger.start();


        //set default font size
        $scope.fontSize = "14";


        /**
         * Activate root controller
         */
        function activate() {
            var logMethod = vm.logger.startMethod("activate");

            //menu items must be public
            $scope.reloadMenuItems();
            $scope.title = "";
            $scope.headerBadgeCount = 0;

            //set window dimension
            $scope.windowWidth = $window.innerWidth;
            $scope.windowHeight = $window.innerHeight;
            vm.windowWidth = $scope.windowWidth;
            vm.windowHeight = $scope.windowHeight;

            //preset font size
            $scope.setFontSize();
            navigationBar.init(vm);
            //imageHandlerService.init(vm);
            logMethod.end();
        }

        $rootScope.isNetworkConnected = function () {
            if (typeof device !== 'undefined' && device != '') {
                 var networkState = navigator.connection.type;
                 return (networkState == Connection.NONE ? false : true);
             }
            return true;
        };


        $scope.reloadMenuItems = function () {
            var logMethod = vm.logger.startMethod("reloadMenuItems");

            $scope.menuItems = [
                {id: "menuCalendar", image: "1", path: "calendar", title: "Calendar", bg: "D6E9F5"},
                {id: "menuCalendar", image: "1", path: "calendar", title: "Insert", bg: "D6E9F5"},
                {id: "menuCalendar", image: "1", path: "calendar", title: "Setup", bg: "D6E9F5"},
                {id: "menuCalendar", image: "1", path: "calendar", title: "Other", bg: "D6E9F5"},
            ];
            logMethod.end();
        };


        /**
         * Listen to resize events
         */
        angular.element($window).bind("resize", function (evt) {
            var logMethod = vm.logger.startMethod("Event.resize");
            //set window dimension
            $scope.windowWidth = $window.innerWidth;
            $scope.windowHeight = $window.innerHeight;
            vm.windowWidth = $scope.windowWidth;
            vm.windowHeight = $scope.windowHeight;
            toolsService.checkForDeviceType();

            //reposition main menu
            //$scope.IpositionElements();
            $scope.IheaderMenuUpdate();
            $scope.resizeListeners.forEach(function (l) {
                logMethod.log(Logger.lvlDebug, "send event to listener");
                logMethod.logObj(Logger.lvlDebug, l);
                l.event();
            });
            logMethod.end();
        });

        $scope.$on("updateFontSize", function () {
            $scope.setFontSize();
        });
        $scope.setFontSize = function () {
            var logMethod = vm.logger.startMethod("setFontSize");
            var displayConfig = constants.displayConfig;
            if (!displayConfig || displayConfig === "") {
                //no config
                displayConfig = "M";
                constants.displayConfig = displayConfig;
            }
            logMethod.log(Logger.lvlInfo, "config = " + displayConfig);

            if (displayConfig === "XL") {
                //extra large
                if (constants.displayClass === "S") {
                    $scope.fontSize = "15";
                } else {
                    $scope.fontSize = "18";
                }
            } else if (displayConfig === "L") {
                //large
                if (constants.displayClass === "S") {
                    $scope.fontSize = "14";
                } else {
                    $scope.fontSize = "16";
                }
            } else if (displayConfig === "S") {
                //small
                if (constants.displayClass === "S") {
                    $scope.fontSize = "12";
                } else {
                    $scope.fontSize = "13";
                }
            } else {
                //medium = default
                if (constants.displayClass === "S") {
                    $scope.fontSize = "13";
                } else {
                    $scope.fontSize = "14";
                }
            }
            logMethod.log(Logger.lvlInfo, "font size = " + $scope.fontSize);
            logMethod.end();
        };

        /**
         * Other controllers can subscribe to resize events
         */
        $scope.resizeListeners = [];
        $scope.registerResizeListener = function (key, listener) {
            var logMethod = vm.logger.startMethod("registerResizeListener");
            $scope.resizeListeners.push({key: key, event: listener});
            logMethod.end();
        };
        $scope.unregisterResizeListener = function (key) {
            var logMethod = vm.logger.startMethod("unregisterResizeListener");
            for (var i = 0; i < $scope.resizeListeners.length; i++) {
                if ($scope.resizeListeners[i].key === key) {
                    logMethod.log(Logger.lvlDebug, "remove");
                    $scope.resizeListeners.splice(i, 1);
                    break;
                }
            }
            logMethod.end();
        };


        /**
         * Enables the new contracts available menu item
         */

        $scope.enableNewContractsItem = function () {
            //$scope.tmpNewContractCount = 10;
            $scope.menuItems[4].hide = false;
            $scope.menuItems[4].badge = 10;

            //$scope.headerMenuBadgeType = "red";
            $rootScope.updateBadgeCounts(true);
        };


        $rootScope.closeDropDowns = function () {
            /*
            $("#"+id).removeClass("open");
            $("#"+id).children(".btn").attr("aria-expanded","false");
            $("#"+id).children(".dropdown-backdrop").remove();
            */
            $(".btn-group").removeClass("open");
            $(".btn-group").children(".btn").attr("aria-expanded", "false");
            $(".btn-group").children(".dropdown-backdrop").remove();

        };


      


        /**
         * Highlights the current menu item
         */
        $scope.setCurrentMenuItem = function (path) {
            var logMethod = vm.logger.startMethod("setCurrentMenuItem");
            if (path == "") path = "x";

            for (var i = 0; i < $scope.menuItems.length; i++) {
                if ($scope.menuItems[i].path == path) {
                    $scope.menuItems[i].selected = " selected";
                } else {
                    $scope.menuItems[i].selected = "";
                }
            }
            logMethod.end();
        }

        $scope.interruptPageChange = function (interrupt) {
            var logMethod = vm.logger.startMethod("interruptPageChange");
            logMethod.log(Logger.lvlInfo, "interrupt = " + interrupt);
            vm.interruptPageChange = interrupt;
            logMethod.end();
        }

        /**
         * Called, when the back button has been pressed
         */

        $scope.$on("navigationBarBackClicked", function (event, backPath) {
            var logMethod = vm.logger.startMethod("RootCtrl.navigationBarBackClicked");
            logMethod.log(Logger.lvlInfo, "backPath = " + backPath);

            //shout broadcast, so sub controllers can respond
            $scope.$broadcast('headerBackClicked');
            logMethod.log(Logger.lvlInfo, "interrupt = " + vm.interruptPageChange);

            //find back routing
            var path = "";
            if (backPath != null && backPath !== "") {
                path = backPath;
            } else {
                var prevUrl = "menu";
                try {
                    prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
                    logMethod.log(Logger.lvlInfo, "route to: " + prevUrl);
                } catch (e) {
                    logMethod.log(Logger.lvlInfo, "last route not available");
                }
                path = prevUrl;
            }

            //check if routing has to be interrupted
            if (vm.interruptPageChange) {
                vm.interruptPageChange = false;
                //ask for save
                dialogService.confirm(
                    $translate.instant('COMMON.DIALOGS.TITLE_ATTENTION'),
                    $translate.instant('DIALOGS.REALLY_DISCARD_DATA.MESSAGE'),
                    function (result) {
                        if (!result.canceled) {
                            $scope.navigateBack(path);
                        }
                    }
                );
            } else {
                $scope.navigateBack(path);
            }


            logMethod.end();
        });

        /**
         * Called, when the menu button has been pressed
         */
        $scope.$on("navigationBarButtonClicked", function () {
            var logMethod = vm.logger.startMethod("RootCtrl.navigationBarButtonClicked");
            $scope.$broadcast('headerBackClicked');
            logMethod.log(Logger.lvlInfo, "interrupt = " + vm.interruptPageChange);

            if (vm.interruptPageChange) {
                vm.interruptPageChange = false;

                //ask for save
                dialogService.confirm(
                    $translate.instant('COMMON.DIALOGS.TITLE_ATTENTION'),
                    $translate.instant('DIALOGS.REALLY_DISCARD_DATA.MESSAGE'),
                    function (result) {
                        if (!result.canceled) {
                            $scope.IheaderMenuClicked();
                        }
                    }
                );
            } else {
                $scope.IheaderMenuClicked();
            }

            logMethod.end();
        })

        /**
         * Internal function. Called, when the menu button has been pressed
         */
        var sideBarOpen = false;
        $scope.$on("closeMenu", function (event, backPath) {
            sideBarOpen = false;
            $scope.IheaderMenuUpdate();
        });

        function setElementPosition(id, pos) {
            var elem = $(id);
            if (elem) elem.css("left", pos + "px");
            elem = null;
        }

        $scope.IheaderMenuUpdate = function () {
            $scope.barWidth = parseInt(vm.windowWidth * 0.8);
            if ($scope.barWidth > 350) $scope.barWidth = 350;

            $scope.overlayBadgePosition = $scope.barWidth - 55;

            if (!sideBarOpen) {
                $("#navigationBar").css("left", "0px");
                $("#content").css("left", "0px");
                $("#sidebar").css("left", "3000px");
                $("#contentOverlay").css("left", "3000px");
                $("#contentOverlay").css("opacity", "0");

                setElementPosition("#sub-nav", 0);
                setElementPosition("#content-body", 0);
                setElementPosition(".page-buttons", 0);
                setElementPosition(".page-buttons-with-indicator", 0);

            } else {
                $("#navigationBar").css("left", "-" + $scope.barWidth + "px");

                setElementPosition("#sub-nav", "-" + $scope.barWidth);
                setElementPosition("#content-body", "-" + $scope.barWidth);
                setElementPosition(".page-buttons", "-" + $scope.barWidth);
                setElementPosition(".page-buttons-with-indicator", "-" + $scope.barWidth);

                var sidebar = vm.windowWidth - $scope.barWidth;
                $("#sidebar").css("left", sidebar + "px");
                $("#contentOverlay").css("left", -$scope.barWidth + "px");
                $("#contentOverlay").css("opacity", "0.7");
            }
        };
        $scope.IheaderMenuClicked = function () {
            if (navigationBar.isButtonEnabled()) {
                sideBarOpen = !sideBarOpen;
                $scope.IheaderMenuUpdate();
            }
        };

        $rootScope.updateOverviewIfNeeded = function (path) {
            if (path === "overviewDay") {
                $rootScope.$broadcast('setLoadingPercent', "");
                $rootScope.$broadcast("setLoadingText", "Wird geladen...");
                $rootScope.$broadcast('showLoadingScreen');
                $timeout(function () {
                    $rootScope.$broadcast('hideLoadingScreen');
                    $rootScope.navigateTo(path);
                }, 50);
                return true;
            } else if (path === "overviewOrder") {
                $rootScope.$broadcast('setLoadingPercent', "");
                $rootScope.$broadcast("setLoadingText", "Wird geladen...");
                $rootScope.$broadcast('showLoadingScreen');
                $timeout(function () {
                    $rootScope.$broadcast('hideLoadingScreen');
                    $rootScope.navigateTo(path);
                }, 50);
                return true;
            }
            return false;
        }

        /**
         * Called after a click on a menu item.
         */
        $scope.menuItemClicked = function (itm) {
            var logMethod = vm.logger.startMethod("menuItemClicked");
            logMethod.logObj(Logger.lvlDebug, itm, "clicked item");
            $rootScope.navigateTo(itm.path);
            $route.reload();
        };

        $scope.menuOutsideClick = function () {
            
        };


        $scope.openSettings = function () {
            //ask for password
            var logMethod = vm.logger.startMethod("openSettings");

            //LiveMode
            ModalService.showModal({
                templateUrl: "assets/templates/dialog-passwd.html",
                controller: "PasswordDialogCtrl2",
                inputs: {
                    showError: false,
                    errorMessage: $translate.instant("DIALOGS.ENTER_PASSWORD.MESSAGES.PASSWORD_INCORRECT"),
                    passwd: constants.settingsPassword
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (!result.canceled) {
                        $rootScope.settingsAdminMode = result.adminMode;
                        $scope.navigateTo ("settings");
                    }
                });
            });


            logMethod.end();
        }


        $rootScope.openCertificateWindow = function (certFile, androidPath) {
            //ask for password
            var logMethod = vm.logger.startMethod("openCertificateWindow");

            //LiveMode
            ModalService.showModal({
                templateUrl: "assets/templates/dialog-cert.html",
                controller: "CertDialogCtrl",
                inputs: {
                    certFile: certFile,
                    androidPath: androidPath
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (!result.canceled) {
                        console.log(result);
                        if (result.successfull) {
                            dialogService.notify($translate.instant('COMMON.DIALOGS.TITLE_INFORMATION'),$translate.instant('DIALOGS.CERT_IMPORT.IMPORTED'),function (){});
                        } else {
                            dialogService.notify($translate.instant('COMMON.DIALOGS.TITLE_ERROR'),$translate.instant('DIALOGS.CERT_IMPORT.IMPORT_FAILED'),function (){});
                        }
                    }
                });
            });

            // for testing anything related to synch (provide hosts, uncomment live mode -part for omitting ADMIN PW
            // $rootScope.settingsAdminMode = true;
            // $scope.navigateTo ("settings");


            logMethod.end();
        }

        $scope.openUserSettings = function () {
            var logMethod = vm.logger.startMethod("openUserSettings");

            $scope.navigateTo("userSettings");

            logMethod.end();
        }


        $scope.checkSelectedCount = function (src, min, max) {
            max = max || 9999;

            var cnt = 0;
            src.forEach(function (srcd) {
                if (srcd.selected) cnt++;
            });

            if (cnt < min) {
                dialogService.error(
                    $translate.instant('COMMON.DIALOGS.TITLE_ERROR'),
                    $translate.instant('COMMON.DIALOGS.ERROR_SELECT_MINIMUM', {count: min}),
                    function () {
                    }
                );
            } else if (cnt > max) {
                dialogService.error(
                    $translate.instant('COMMON.DIALOGS.TITLE_ERROR'),
                    $translate.instant('COMMON.DIALOGS.ERROR_SELECT_MAXIMUM', {count: max}),
                    function () {
                    }
                );
            } else {
                return true;
            }

            return false;
        }


        $scope.checkTreeSelectedCount = function (src, min, max) {
            max = max || 9999;
            var cnt = 0;
            src.forEach(function (l1) {
                l1.children.forEach(function (l2) {
                    l2.children.forEach(function (l3) {
                        if (l3.entrySelected) cnt++;
                    });
                });
            });
            if (cnt < min) {
                dialogService.error(
                    $translate.instant('COMMON.DIALOGS.TITLE_ERROR'),
                    $translate.instant('COMMON.DIALOGS.ERROR_SELECT_MINIMUM', {count: min}),
                    function () {
                    }
                );
            } else if (cnt > max) {
                dialogService.error(
                    $translate.instant('COMMON.DIALOGS.TITLE_ERROR'),
                    $translate.instant('COMMON.DIALOGS.ERROR_SELECT_MAXIMUM', {count: max}),
                    function () {
                    }
                );
            } else {
                return true;
            }

            return false;
        }

        $scope.numberStrWithComma = function (number) {
            number = ("" + number);
            if (number.indexOf(".") != -1) {
                return number.replace(/\./, ",");
            }
            return number;
        }

        $scope.numberStrWithDot = function (number) {
            number = ("" + number);
            if (number.indexOf(",") != -1) {
                return number.replace(/,/, ".");
            }
            return number;
        }

        $scope.checkNumber = function (number, success) {
            //validate quantity
            var newNumber = 0;
            var confirmNumber = false;
            var confirmNumberMsg = "";
            var commaCount = number.split(",").length - 1;// (number.match(/,/g) || []).length;
            var dotCount = number.split(".").length - 1; //(number.match(/./g) || []).length;

            if (number.indexOf(".") != -1 && number.indexOf(",") != -1) {
                //both . and , found in quantity
                newNumber = number.replace(/\./g, "");
                confirmNumber = true;
                confirmNumberMsg = $translate.instant("DIALOGS.CHECK_NUMBER_FORMAT.MESSAGE_DOT_AND_COMMA", {newNumber: newNumber});
            } else if (commaCount > 1) {
                //to much commas
                dialogService.error($translate.instant("COMMON.DIALOGS.TITLE_ERROR"), $translate.instant("DIALOGS.CHECK_NUMBER_FORMAT.MESSAGE_TOO_MUCH_COMMAS"));
            } else if (commaCount == 0 && dotCount == 1) {
                //to much dots
                newNumber = number.replace(/\./g, ",");
                confirmNumber = true;
                confirmNumberMsg = $translate.instant("DIALOGS.CHECK_NUMBER_FORMAT.MESSAGE_NO_COMMA_BUT_DOTS", {newNumber: newNumber});
            } else if (commaCount == 0 && dotCount > 0) {
                //to much dots
                newNumber = number.replace(/\./g, "");
                confirmNumber = true;
                confirmNumberMsg = $translate.instant("DIALOGS.CHECK_NUMBER_FORMAT.MESSAGE_NO_COMMA_BUT_DOTS", {newNumber: newNumber});
            } else {
                success(number);
            }

            if (confirmNumber) {
                dialogService.confirm($translate.instant("COMMON.DIALOGS.TITLE_ATTENTION"), confirmNumberMsg, function (result) {
                    if (!result.canceled) {
                        success(newNumber);
                    }
                });

            }
        }


        $scope.checkNumberSilent = function (number) {
            number = "" + number;
            var re = new RegExp("^[-,\.0-9]+$");
            if (!re.test(number)) {
                return false;
            }
            var commaCount = number.split(",").length - 1;
            var dotCount = number.split(".").length - 1;
            if (number.indexOf(".") != -1 && number.indexOf(",") != -1) {
                //both . and , found in quantity
                return false;
            } else if (commaCount > 1) {
                //to much commas
                return false;
            } else if (commaCount == 0 && dotCount > 0) {
                //to much dots
                return false;
            } else if (isNaN(parseFloat($scope.numberStrWithDot(number)))) {
                return false;
            } else {
                return true;
            }
        }

        activate();
        vm.logger.end();
    }
})();