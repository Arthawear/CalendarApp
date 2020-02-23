#!/usr/bin/env node
var hkWindows = require('./hookLibWindows-1.0.0.js');

hkWindows.addContentURIs(
    hkWindows.MANIFEST_TYPE_PHONE,
    [
        "https://www.youtube.com"
    ]
);
hkWindows.addContentURIs(
    hkWindows.MANIFEST_TYPE_WINDOWS,
    [
        "https://www.youtube.com"
    ]
);
