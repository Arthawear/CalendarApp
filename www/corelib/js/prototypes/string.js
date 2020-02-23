/**
 * startsWith
 * Checks, if a string starts with a given string
 *
 * if("test".startsWith("te")) {
 *      //starts with te
 * }
 *
 * 23.04.2015   1.0     MP      added
 */
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}
/**
 * endsWith
 * Checks, if a string ends with a given string
 *
 * if("test".endsWith("st")) {
 *      //ends with st
 * }
 *
 * 23.04.2015   MP      added
 */
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
        return this.slice(-str.length) == str;
    };
}

if (typeof String.prototype.endsWithMulti != 'function') {
    String.prototype.endsWithMulti = function(strs) {
        for (var i=0; i<strs.length; i++) {
            if (this.slice(-strs[i].length) == strs[i]) return strs[i];
        }
        return null;
    };
}

if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

if (typeof String.prototype.cutDownToWidth != 'function') {
    String.prototype.cutDownToWidth = function (font, maxWidth, step) {

        //how much chars should be cut by check
        if (!step) {
            step = 3;
        }


        //get string width
        var strWidth = this.width(font);

        //check if string fits
        if (strWidth <= maxWidth) {
            return this;
        } else {
            //string is to big
            var tmpStr = this;
            while (tmpStr.length > step && strWidth > maxWidth) {
                //while string is bigger than the step count AND bigger than the max width, continue checking

                var checkStr = (tmpStr.substring(0,tmpStr.length-step)+"...");
                var checkWidth = checkStr.width(font);

                //console.log(checkStr+" > "+checkWidth);
                if (checkWidth < maxWidth) {
                    return tmpStr.trim()+"...";
                } else {
                    strWidth = checkWidth;
                    tmpStr = tmpStr.substring(0, tmpStr.length-step);
                }
            }
            return tmpStr.trim()+"...";
        }


    };
}

if (typeof String.prototype.width != 'function') {
    String.prototype.width = function (font) {
        var f = font || '12px arial',
            o = $('<div>' + this + '</div>')
                .css({
                    'position': 'absolute',
                    'float': 'left',
                    'white-space': 'nowrap',
                    'visibility': 'hidden',
                    'font': f
                })
                .appendTo($('body')),
            w = o.width();

        o.remove();

        return w;
    }
}

if (typeof String.prototype.htmlEscape != 'function') {
    String.prototype.htmlEscape = function () {
        return String(this)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
if (typeof String.prototype.htmlUnescape != 'function') {
    String.prototype.htmlUnescape = function () {
        return String(this)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }
}
if (typeof String.prototype.base64ToBlob != 'function') {
    String.prototype.base64ToBlob = function (contentType) {

        var sliceSize = 512;
        var byteCharacters = atob(this);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
}
