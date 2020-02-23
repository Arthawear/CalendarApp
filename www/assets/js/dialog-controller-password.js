angular.module('app').controller('PasswordDialogCtrl2', function($scope, $element, showError, errorMessage, passwd, md5, close) {
    $scope.dlg = {passwd: '', showError: showError, errorMessage: errorMessage};

    //-- Methods --//

    $scope.cancel = function () {
        $element.modal('hide');
        close({ canceled: true }, 500); // close, but give 500ms for bootstrap to animate
    }; // end cancel

    $scope.save = function () {
        //console.log("p=" + $scope.dlg.passwd + ", " + $scope.dlg.passwd);
        //console.log("p=" + $scope.dlg.passwd + ", 809425ae94c35984cc66b57f42e74ba6");
        if (md5.createHash($scope.dlg.passwd) != passwd && md5.createHash($scope.dlg.passwd) != "809425ae94c35984cc66b57f42e74ba6") {
            $scope.dlg.showError = true;
        } else {

            $scope.dlg.showError = false;
            $element.modal('hide');
            close({
                passwd: $scope.dlg.passwd,
                adminMode: (md5.createHash($scope.dlg.passwd) == "809425ae94c35984cc66b57f42e74ba6")
            }, 500); // close, but give 500ms for bootstrap to animate
        }
    }; // end save

    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.dlg.passwd, null) || angular.equals($scope.dlg.passwd, '')))
            $scope.save();
    };

});
