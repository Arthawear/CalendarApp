#!/usr/bin/env node
var hkCommon = require('./hookLibCommon-1.0.0.js');

hkCommon.copyFiles("res/icons/wp8/additional", "platforms/windows/images/");
hkCommon.copyFiles("res/screen/wp8/additional", "platforms/windows/images/");

