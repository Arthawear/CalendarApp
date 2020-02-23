
angular.module('app').filter('commaNumber', function () {
    return function (value) {
        if (value && value.indexOf(".")!=-1) {
            return value.replace(/\./,",");
        }
        return value;
    };
});