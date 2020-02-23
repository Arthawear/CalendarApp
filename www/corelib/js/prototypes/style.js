/**
 * getStyle
 * Returns the css for a given class name (always the first class in reversed order)
 *
 * var css = getStyle("cssClassName");
 * css.style.marginRight
 *
 */
function getStyle(className_) {
    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    for(var i = styleSheetsLength-1; i>=0; i--){
        var classes = styleSheets[i].rules || styleSheets[i].cssRules;
        var classesLength = classes.length;
        for (var x = 0; x < classesLength; x++) {
            if (classes[x].selectorText == className_) {
                return classes[x];
            }
        }
    }
}

function getStyleProperty(className_, property_) {
    var styleSheets = window.document.styleSheets;
    var styleSheetsLength = styleSheets.length;
    for(var i = styleSheetsLength-1; i>=0; i--){
        var classes = styleSheets[i].rules || styleSheets[i].cssRules;
        var classesLength = classes.length;
        for (var x = 0; x < classesLength; x++) {
            if (classes[x].selectorText == className_) {
                if (classes[x].style[property_] && classes[x].style[property_] !== "") {
                    return classes[x].style[property_];
                }
            }
        }
    }
}