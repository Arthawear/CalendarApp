if (typeof Array.prototype.clone != 'function') {
    Array.prototype.clone = function() {
        return JSON.parse(JSON.stringify(this));
    };
}
if (typeof Array.prototype.contains != 'function') {
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
}
if (typeof Array.prototype.addArray != 'function') {
    Array.prototype.addArray = function (obj) {
        for (var i=0; i<obj.length; i++) {
            this.push(obj[i]);
        }
    };
}