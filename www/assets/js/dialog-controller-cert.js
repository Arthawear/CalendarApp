angular.module('app').controller('CertDialogCtrl', function($scope, $element, certFile, androidPath, close, constants) {
    $scope.dlg = {certFile: certFile, androidPath: androidPath, passwd: ""};

    //-- Methods --//

    $scope.cancel = function () {
        clientCertificate.clearImportedCertificates(function () {});
        $element.modal('hide');
        close({ canceled: true }, 500); // close, but give 500ms for bootstrap to animate
    }; // end cancel

    $scope.save = function () {
        var path = "";
        if (constants.isAndroid) {
            path = androidPath;
        } else {
            path = "Inbox@"+certFile;
        }
        clientCertificate.registerAuthenticationCertificate(path, $scope.dlg.passwd, function () {
            clientCertificate.clearImportedCertificates(function () {});
            $element.modal('hide');
            close({
                successfull: true
            }, 500); // close, but give 500ms for bootstrap to animate
        }, function () {
            // failed
            // todo error message
            clientCertificate.clearImportedCertificates(function () {});
            $element.modal('hide');
            close({
                successfull: false
            }, 500); // close, but give 500ms for bootstrap to animate
        });
        //console.log("p=" + $scope.dlg.passwd + ", " + $scope.dlg.passwd);
        //console.log("p=" + $scope.dlg.passwd + ", 809425ae94c35984cc66b57f42e74ba6");
        /*
        if (md5.createHash($scope.dlg.passwd) != passwd && md5.createHash($scope.dlg.passwd) != "809425ae94c35984cc66b57f42e74ba6") {
            $scope.dlg.showError = true;
        } else {

            $scope.dlg.showError = false;
            $element.modal('hide');
            close({
                passwd: $scope.dlg.passwd,
                adminMode: (md5.createHash($scope.dlg.passwd) == "809425ae94c35984cc66b57f42e74ba6")
            }, 500); // close, but give 500ms for bootstrap to animate
        }*/
    }; // end save

    $scope.hitEnter = function (evt) {
        if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.dlg.passwd, null) || angular.equals($scope.dlg.passwd, '')))
            $scope.save();
    };

});
