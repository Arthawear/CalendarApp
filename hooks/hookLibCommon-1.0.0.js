#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;


module.exports = {

    //common
    copyFiles: function (from, to) {
        fs.readdirSync(from).forEach(function(name) {
            var filePath = path.join(from, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                console.log("hookLibCommon.copyFiles> "+from+" to "+to+name);
                fs.writeFileSync(to+name, fs.readFileSync(filePath));
            }
        });
    },

    removePlugins: function () {
        fs.readdirSync("plugins").forEach(function(name) {
            if (!name == "fetch.json") {
                var buff = execSync("cordova plugin remove -f " + name).toString();
            }
            if (buff != "") console.log(buff);
            fs.writeFileSync("plugins/fetch.json", "{}");
        });
    },

    installPlugins: function (plugins) {
        plugins.forEach(function(plug) {
            var buff = execSync("cordova plugin add " + plug).toString();
            if (buff != "") console.log(buff);
        });
    }

};


