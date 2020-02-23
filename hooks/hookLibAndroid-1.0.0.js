#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;


module.exports = {

    removeSdkVersion: function () {
        console.log("hookLibAndroid.removeSdkVersion> removing sdk version");

        var data = fs.readFileSync('platforms/android/AndroidManifest.xml', 'utf8');

        if (data && data.indexOf("targetSdkVersion")!=-1) {
            //data = data.replace(//,"");
            var sdk = data.substring(data.indexOf("android:targetSdkVersion"),data.length);
            var sdkParts = sdk.split(" ");
            //sdk = sdk.substring(0,sdk.indexOf("\""));
            data = data.replace(sdkParts[0],"");

            fs.writeFileSync('platforms/android/AndroidManifest.xml', data, 'utf8');
            console.log("hookLibAndroid.removeSdkVersion> AndroidManifest patched");

        } else {
            console.log("hookLibAndroid.removeSdkVersion> no sdk version found");
        }

    }
};


