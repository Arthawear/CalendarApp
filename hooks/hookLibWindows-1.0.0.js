#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;


module.exports = {

    //windows phone & windows
    MANIFEST_TYPE_PHONE: "phone",
    MANIFEST_TYPE_WINDOWS: "windows",

    MANIFEST_FOREGROUND_LIGHT: "light",
    MANIFEST_FOREGROUND_DARK: "dark",


    fixForeground: function (type, color) {
        console.log("hookLibWindows.fixForeground> fix foreground of "+type);


        var data = fs.readFileSync("platforms/windows/package."+type+".appxmanifest", 'utf8');

        if (data.indexOf("ForegroundText=\""+color+"\"")!=-1) {
            console.log("hookLibWindows.fixForeground> already fixed");
        } else if (data.indexOf("ForegroundText")==-1) {
            console.log("hookLibWindows.fixForeground> no foreground found");

            data = data.replace("VisualElements", "VisualElements ForegroundText=\""+color+"\" ");

            fs.writeFileSync("platforms/windows/package."+type+".appxmanifest", data, 'utf8');
            console.log("hookLibWindows.fixForeground> appxmanifest patched");
        } else {
            //fix it

            data = data.replace("ForegroundText=\"light\"", "ForegroundText=\""+color+"\"");
            data = data.replace("ForegroundText=\"dark\"", "ForegroundText=\""+color+"\"");

            fs.writeFileSync("platforms/windows/package."+type+".appxmanifest", data, 'utf8');
            console.log("hookLibWindows.fixForeground> appxmanifest patched");
        }

    },

    addCapabilities: function (type, capabilities) {
        console.log("hookLibWindows.addCapabilities> add capabilities to "+type);


        var data = fs.readFileSync("platforms/windows/package."+type+".appxmanifest", 'utf8');

        var capsToAdd = "";
        //check if capab. are already added
        for (var i=0; i<capabilities.length; i++) {
            if (data.indexOf(capabilities[i])==-1) {
                capsToAdd += "<Capability Name=\""+capabilities[i]+"\" />";
            }
        }

        if (data.indexOf("<\/Capabilities>")!=-1) {
            console.log("hookLibWindows.addCapabilities> found capabilities node");

            var replaceString = ""+
                capsToAdd+
                "</Capabilities>";


            data = data.replace("<\/Capabilities>",replaceString);

            fs.writeFileSync("platforms/windows/package."+type+".appxmanifest", data, 'utf8');
            console.log("hookLibWindows.addCapabilities> appxmanifest patched");

        }


    },

    addContentURIs: function (type, uris) {
        console.log("hookLibWindows.addContentURIs> add content uris to "+type);

        var data = fs.readFileSync("platforms/windows/package."+type+".appxmanifest", 'utf8');

        if (data.indexOf("<\/Application>")!=-1) {
            console.log("hookLibWindows.addContentURIs> found application node");

            var rules = "";
            for (var i=0; i<uris.length; i++) {
                rules += "<Rule Match=\""+uris[i]+"\" Type=\"include\" />";
            }

            var replaceString = "<ApplicationContentUriRules>"+
                rules+
                "<\/ApplicationContentUriRules>"+
                "<\/Application>";


            data = data.replace("<\/Application>",replaceString);

            fs.writeFileSync("platforms/windows/package."+type+".appxmanifest", data, 'utf8');
            console.log("hookLibWindows.addContentURIs> appxmanifest patched");

        }

    }
};


