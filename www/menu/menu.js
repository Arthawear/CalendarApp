(function () {
    'use strict';
    angular.module('app').controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$rootScope', '$scope', 'navigationBar', '$window'];

    function MenuCtrl($rootScope, $scope, navigationBar, $window) {
        var vm = this;
        var logger = Logger.getInstance("MenuCtrl");
        logger.start();
        vm.badgePosition = $scope.windowWidth-50;

        function activate() {
            var logMethod = logger.startMethod ("activate");


            $rootScope.contentPaddingTop = 75;
            $rootScope.contentPaddingBottom = 0;

            navigationBar.setup({
                title: "Hauptmenü",
                class: 'navigationBarIcon',
                backVisible: false,
                buttonVisible: false});
            $scope.reloadMenuItems();
            $scope.setCurrentMenuItem("");

            //add resize listener to root
            logMethod.log(Logger.lvlDebug, "register resize listener");
            $scope.registerResizeListener("menu", function () {

                resizeBlocks();
            });
            $scope.$on("$destroy", function(){
                $scope.unregisterResizeListener("menu");
            });
            resizeBlocks();

            logMethod.end();
        }

        function resizeBlocks () {
            var screenWidth = $window.innerWidth-20;
            var blockWidth = 50;
            var blockImageWidth = 60;
            var blockFontSize = 16;
            var blockImageFontSize = 40;
            if (screenWidth>=600) {
                //tablet or landscape

                var size = 130;
                if (screenWidth>800) size = 240;
                else if (screenWidth>700) size = 200;

                var blockCount = parseInt(screenWidth/size);
                if (blockCount>3) blockCount = 3;

                blockWidth = parseInt((screenWidth-(blockCount*20))/blockCount);
                blockWidth = blockWidth * 0.9;
            } else {
                //2 blocks on screen
                blockWidth = parseInt((screenWidth-40)/2);
            }

            blockImageWidth = blockWidth*0.4;
            blockImageFontSize = blockWidth*0.25;
            blockFontSize = blockWidth*0.1;
            if (blockImageWidth<60) blockImageWidth = 60;
            if (blockImageFontSize<40) blockImageFontSize = 40;
            if (blockFontSize<16) blockFontSize = 16;
            $scope.blockFontSize = blockFontSize;
            $scope.blockImageFontSize = blockImageFontSize;
            $scope.blockImageWidth = blockImageWidth;
            $scope.blockWidth = blockWidth;
        }


        activate();
        logger.end();

    }
})();
