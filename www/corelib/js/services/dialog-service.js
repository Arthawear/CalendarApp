angular.module('app').service('dialogService', function(ModalService) {

    return {

        confirm: function (title, message, callback) {
            ModalService.showModal({
                templateUrl: "/dialogs/confirm.html",
                controller: "CommonDialogCtrl",
                inputs: {
                    title: title,
                    message: message
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (callback) callback(result);
                });
            });
        },

        notify: function (title, message, callback) {
            ModalService.showModal({
                templateUrl: "/dialogs/notify.html",
                controller: "CommonDialogCtrl",
                inputs: {
                    title: title,
                    message: message
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (callback) callback(result);
                });
            });
        },

        error: function (title, message, callback) {
            ModalService.showModal({
                templateUrl: "/dialogs/error.html",
                controller: "CommonDialogCtrl",
                inputs: {
                    title: title,
                    message: message
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (callback) callback(result);
                });
            });
        },

        imageViewer: function (source, deletable, callback) {
            ModalService.showModal({
                templateUrl: "/dialogs/imageviewer.html",
                controller: "ImageViewerDialogCtrl",
                inputs: {
                    source: source,
                    deletable: deletable
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    if (callback) callback(result);
                });
            });
        }

    };
});



angular.module('dialogService',[])

    // Add default templates via $templateCache
    .run(['$templateCache','$interpolate',function($templateCache,$interpolate){
        // get interpolation symbol (possible that someone may have changed it in their application instead of using '{{}}')
        var startSym = $interpolate.startSymbol();
        var endSym = $interpolate.endSymbol();

        $templateCache.put('/dialogs/imageviewer.html','<div class="modal fade"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header dialog-header-imageviewer"><h4 class="modal-title"><span class="glyphicon glyphicon-camera"></span> '+startSym+'"DIALOG_IMAGEVIEWER" | translate'+endSym+'</h4></div><div class="modal-body" id="viewerContent"><img src="data:image/jpeg;base64,{{source}}" align="center" id="viewerImage" hm-pinch="pinch($event)" hm-pan="pan($event)"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-show="deletable" ng-click="deleteImage()">'+startSym+'"DIALOG_DELETE" | translate'+endSym+'</button><button type="button" class="btn btn-default" ng-click="cancel()">'+startSym+'"DIALOG_CANCEL" | translate'+endSym+'</button></div></div></div></div>');
        $templateCache.put('/dialogs/notify.html','<div class="modal fade"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header dialog-header-notify"><h4 class="modal-title"><span class="glyphicon glyphicon-align-left"></span> {{title}}</h4></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="ok()">'+startSym+'"DIALOG_OK" | translate'+endSym+'</button></div></div></div></div>');
        $templateCache.put('/dialogs/error.html','<div class="modal fade"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header dialog-header-error"><h4 class="modal-title"><span class="glyphicon glyphicon-remove-circle"></span> {{title}}</h4></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="ok()">'+startSym+'"DIALOG_OK" | translate'+endSym+'</button></div></div></div></div>');
        $templateCache.put('/dialogs/confirm.html','<div class="modal fade"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header dialog-header-confirm"><h4 class="modal-title"><span class="glyphicon glyphicon-info-sign"></span> {{title}}</h4></div><div class="modal-body">{{message}}</div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">'+startSym+'"DIALOG_CANCEL" | translate'+endSym+'</button><button type="button" class="btn btn-default" ng-click="ok()">'+startSym+'"DIALOG_OK" | translate'+endSym+'</button></div></div></div></div>');
    }]);



(function () {
    'use strict';
    angular.module('app').controller('CommonDialogCtrl', CommonDialogCtrl);

    CommonDialogCtrl.$inject = ['$scope', '$element', 'title', 'message', 'close'];

    function CommonDialogCtrl($scope, $element, title, message, close) {
        $scope.title = title;
        $scope.message = message;

        $scope.cancel = function () {
            $element.modal('hide');
            close({ canceled: true }, 500);
        }

        $scope.ok = function () {
            $element.modal('hide');
            close({ canceled: false }, 500);
        }

    }
})();


(function () {
    'use strict';
    angular.module('app').controller('ImageViewerDialogCtrl', ImageViewerDialogCtrl);

    ImageViewerDialogCtrl.$inject = ['$scope', '$element', 'source', 'deletable', 'close'];

    function ImageViewerDialogCtrl($scope, $element, source, deletable, close) {

        $scope.source = source;
        $scope.deletable = deletable;
        $scope.imgSize = {
            x: 0,
            y: 0
        };

        $scope.prepareStructure = function () {
            if (!$scope.imgSize.w) {
                var img = document.getElementById("viewerImage");
                $scope.imgSize.w = img.width;
                $scope.imgSize.h = img.height;
                $scope.imgSize.actualW = img.width;
                $scope.imgSize.actualH = img.height;
            }
        }


        /**
         * User zoomed image
         */
        $scope.pinch = function ($event) {
            $scope.prepareStructure();

            var img = document.getElementById("viewerImage");
            img.width = ($scope.imgSize.actualW * $event.scale);
            img.height = ($scope.imgSize.actualH * $event.scale);

            if ($event.eventType === 4) {
                //pinch ended
                $scope.imgSize.actualW = img.width;
                $scope.imgSize.actualH = img.height;
            }
            //console.log("pinch: "+$event.eventType);
            //console.log($event.scale+": "+$event.eventType);
        }


        /**
         * User dragged image around
         */
        $scope.pan = function ($event) {
            $scope.prepareStructure();

            var img = document.getElementById("viewerContent");
            /*
             img.style.overflowX = 100;
             img.style.overflowY = 100;
             img.scrollLeft = -100;
             img.scrollTop = -100;
             */
            var x = $scope.imgSize.x + -$event.deltaX;
            var y = $scope.imgSize.y + -$event.deltaY;
            img.scrollLeft = x;
            img.scrollTop = y;

            if ($event.eventType === 4) {
                //pan ended
                $scope.imgSize.x = x;
                $scope.imgSize.y = y;
            }
            //console.log("pan: "+$event.eventType);

            //console.log("x = "+x+", y = "+y+", "+$event.deltaX);
            //console.log($event);
        }


        $scope.deleteImage = function () {
            $element.modal('hide');
            close({ delete: true }, 500);
        }

        $scope.cancel = function () {
            $element.modal('hide');
            close({ canceled: true }, 500);
        }


    }
})();