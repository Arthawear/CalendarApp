#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var childProcess = require('child_process');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var os = require('os');


module.exports = {
    removeCFBundleIcons: function () {
        var find = execSync("find . -name *.plist").toString();
        var files = find.split("\n");
        files.forEach(function (f) {
            if (f != "") {
                var tmp = fs.readFileSync(f, "utf8");

                if (tmp.indexOf("CFBundleIcons")!=-1) {
                    tmp = tmp.replace("<key>CFBundleIcons</key>\n"+
                        "    <dict/>","");
                    tmp = tmp.replace("<key>CFBundleIcons~ipad</key>\n"+
                        "    <dict/>","");
                    tmp = tmp.replace("<key>CFBundleIconFile</key>\n"+
                        "    <string>icon.png</string>","");
                    fs.writeFileSync(f, tmp);
                }
            }
        });


    }
};



