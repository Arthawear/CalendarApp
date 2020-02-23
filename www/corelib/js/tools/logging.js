/**
 * Requires: string.js (prototyp)
 */


var Logger = function() {
}

//constants
Logger.lvlNo = -1;
Logger.lvlAll = 100;
Logger.lvlError = 1;
Logger.lvlInfo = 5;
Logger.lvlDebug = 10;


//initial setup
Logger.config = {
    log: {
        level: Logger.lvlInfo,
        methodStartAndEndLevel: Logger.lvlDebug,
        allowLogObj: true,
        enabled: false
    },
    globalLog: {
        enabled: false,
        queueMaxSize: 100,
        level: Logger.lvlInfo
    },
    ajaxLog: {
        level: Logger.lvlInfo,
        enabled: false,
        bufferSize: 15,
        maxQueueSize: 50,
        timeout: 10,
        host: null,
        credentials: {
            username: null,
            password: null
        }
    },
    methodStatistic: {
        enabled: false
    }
};


/**
 * Clears all method statistic collections
 */
Logger.clearMethodStatistic = function () {
    Logger.methodStatistic = {};
}

/**
 * Adds a method to the method statistic. (Do not use this method manually)
 * @param methodName The name of the method
 * @param timeElapsed The time the method has taken in ms
 */
Logger._addMethodStatistic = function (methodName, timeElapsed) {
    if (Logger.config.methodStatistic.enabled) {
        if (!Logger.methodStatistic) {
            Logger.methodStatistic = {};
        }

        if (!Logger.methodStatistic[methodName]) {
            Logger.methodStatistic[methodName] = [];
        }

        Logger.methodStatistic[methodName].push(timeElapsed);
    }
};

/**
 * Prints out the method statistic to console
 */
Logger.printMethodStatistic = function () {
    if (Logger.config.methodStatistic.enabled) {
        if (!Logger.methodStatistic) {
            Logger.methodStatistic = {};
        }

        console.info("Method statistic");
        console.info("-----------------------------------------");
        var overallCalls = 0;
        Object.keys(Logger.methodStatistic).forEach(function (key) {
            var mStat = Logger.methodStatistic[key];
            var timeElapsedOverall = 0;
            var timeElapsedAverage = 0;

            for (var ms=0; ms<mStat.length; ms++) {
                if (mStat[ms] != null) {
                    timeElapsedOverall += mStat[ms];
                }
            }
            timeElapsedAverage = timeElapsedOverall/mStat.length;
            overallCalls += mStat.length;

            console.info(mStat.length+" x "+key+" [time="+timeElapsedOverall+"ms, av="+timeElapsedAverage+"ms]");
        });
        console.info("calls="+overallCalls);
        console.info("-----------------------------------------");
    }
};

/**
 * Enables/Disables the console output
 * @param enabled true to enable, false to disable
 */
Logger.enableConsoleOutput = function (enabled) {
    Logger.config.log.enabled = enabled;
};


Logger.sendLogToServer = function (jsonData, callback) {
    Logger._ajaxSendData(jsonData, false, callback);
};

Logger.initAjaxLog = function () {
    if (!Logger._ajaxLogInitialized) {
        //init ajax logger
        Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
        Logger._ajaxLogInitialized = true;
    }
};

Logger._ajaxThread = function () {
    if (!Logger.ajaxQueue) {
        Logger.ajaxQueue = [];
    }

    if (Logger.ajaxQueue.length<Logger.config.ajaxLog.bufferSize) {
        //not full enough
        Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
        return;
    }


    if (Logger.config.ajaxLog.credentials.username == null || Logger.config.ajaxLog.host == null) {
        Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
    } else {

        Logger._ajaxSendData(Logger._getAjaxLogQueue(), true);

    }

};

var loggerAjaxSendDataCallback;
var loggerAjaxSendDataRestartTimer;
Logger._ajaxSendData = function (jsonData, restartTimer, callback) {
    //console.log ("Posting data: " + jsonData);

    if (!Logger.config.ajaxLog.userDefinition) {
        Logger.config.ajaxLog.userDefinition = {};
    }

    var log = {
        userDefinition: Logger.config.ajaxLog.userDefinition,
        log: jsonData
    };


    var xreq = new XMLHttpRequest();
    try {
        xreq.withCredentials = true;
    } catch(e) {}

    xreq.timeout = Logger.config.ajaxLog.timeout*1000;

    xreq.open('POST', Logger.config.ajaxLog.host, true, Logger.config.ajaxLog.credentials.username, Logger.config.ajaxLog.credentials.password);
    xreq.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    //xreq.setRequestHeader("Content-length", jsonData.length);
    //xreq.setRequestHeader("Connection", "close");

    loggerAjaxSendDataCallback = callback;
    loggerAjaxSendDataRestartTimer = restartTimer;

    xreq.ontimeout = function () {
        if (loggerAjaxSendDataRestartTimer) Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
        if (loggerAjaxSendDataCallback) loggerAjaxSendDataCallback({ success: false, code: -1, error: "Request Timeout" });
    };
    xreq.onreadystatechange = function () {
        if (xreq.readyState == 4) {

            if (loggerAjaxSendDataRestartTimer) Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
            if (loggerAjaxSendDataCallback) {
                loggerAjaxSendDataCallback({ success: true, statusCode: xreq.status, statusText: xreq.statusText });
            }

        }
    };
    try {
        xreq.send(JSON.stringify(log));
    } catch (e) {
        if (loggerAjaxSendDataRestartTimer) Logger._ajaxLogTimer = window.setTimeout('Logger._ajaxThread()',Logger.config.ajaxLog.timeout*1000);
        if (loggerAjaxSendDataCallback) loggerAjaxSendDataCallback({ success: false, code: -2, error: e });
    }

};

/**
 * Adds a message to the ajax log. (don't use this method manually)
 * @param msg The message to add in json format: { type: log|logObj|error|info, msg: PlainMessage, error: true|false, date: new Date() }
 */
Logger._addToAjaxQueue = function (msg) {
    if (!Logger.ajaxQueue) {
        Logger.ajaxQueue = [];
    }
    while (Logger.ajaxQueue.length>Logger.config.ajaxLog.maxQueueSize) Logger.ajaxQueue.splice(0,1);
    Logger._getAjaxLogQueue().push(msg);
};
/**
 * Returns the ajax log queue
 * @returns Array of log objects
 */
Logger._getAjaxLogQueue = function () {
    if (!Logger.ajaxQueue) {
        Logger.ajaxQueue = [];
    }
    return Logger.ajaxQueue;
};





/**
 * Adds a message to the global log. (don't use this method manually)
 * @param msg The message to add in json format: { type: log|logObj|error|info, msg: PlainMessage, error: true|false, date: new Date() }
 */
Logger._addToLogQueue = function (msg) {
    if (!Logger.queue) {
        Logger.queue = [];
    }
    while (Logger.queue.length>Logger.config.globalLog.queueMaxSize) Logger.queue.splice(0,1);
    Logger.getLogQueue().push(msg);
};
/**
 * Returns the global log queue
 * @returns Array of log objects
 */
Logger.getLogQueue = function () {
    if (!Logger.queue) {
        Logger.queue = [];
    }
    return Logger.queue;
};




/**
 * Creates a new instance of the logger
 * @param instanceName The name of the instance (e.g. class name)
 * @returns {LoggerInstance}
 */
Logger.getInstance = function (instanceName) {
    return new LoggerInstance (instanceName);
};

/**
 * Constructs a new logger, use Logger.getInstance instead!
 */
var LoggerInstance = function (instanceName) {
    var loggerInstance = {};
    loggerInstance.name = instanceName;

    //class method
    loggerInstance.start = function () {
        loggerInstance.m = new LoggerMethod (instanceName, "init");
    };
    loggerInstance.end = function () {
        if (!loggerInstance.m) {
            console.error("NO END!");
        } else {
            loggerInstance.m.end();
        }
        loggerInstance.m = null;
    };

    //start method
    loggerInstance.startMethod = function (methodName) {
        return new LoggerMethod (this.name, methodName);
    };

    return loggerInstance;
};

/**
 * Constructs a new logger method. Call start from LoggerInstance
 */
var LoggerMethod = function (instanceName, methodName) {
    var loggerMethod = {};
    loggerMethod.name = methodName;
    loggerMethod.instanceName = instanceName;


    //class methods


    /**
     * Starts the method
     */
    loggerMethod.start = function () {
        loggerMethod.startDateTime = new Date();
        loggerMethod.log(Logger.config.log.methodStartAndEndLevel, "start");
    };
    /**
     * Ends the method
     */
    loggerMethod.end = function () {
        if (!isValid ()) return;
        var timeElapsed = "";
        if (loggerMethod.startDateTime) {
            var tmp = new Date()-loggerMethod.startDateTime;
            timeElapsed = " ("+tmp+"ms, "+(tmp/1000)+"s)";
            Logger._addMethodStatistic (loggerMethod.name, tmp);
            tmp = null;
        } else {
            Logger._addMethodStatistic (loggerMethod.name, null);
        }
        loggerMethod.log(Logger.config.log.methodStartAndEndLevel, "end"+timeElapsed);
        loggerMethod = null;
    };

    /**
     * Internal function. Method still valid?
     */
    var isValid = function () {
        if (loggerMethod && loggerMethod.instanceName) return true;
        return false;
    };

    /**
     * Internal function to format the log message
     * @param level Debug level
     * @param msg Log message
     * @param withDate Print date
     * @returns Formatted log message
     */
    var getLogMessage = function (level, msg, withDate) {
        var tmp = "";

        //level flag
        if (level == Logger.lvlDebug) {
            tmp = "DBG> ";
        } else if (level == Logger.lvlInfo) {
            tmp = "INF> ";
        } else if (level == Logger.lvlError) {
            tmp = "ERR> ";
        } else {
            tmp = "MSG> ";
        }

        //date
        if (withDate) {
            tmp += new Date().toLocaleString().replace(", "," ")+"."+new Date().getMilliseconds()+"> ";
        }

        //class, method
        tmp += loggerMethod.instanceName+"."+loggerMethod.name+"> ";

        //message
        if (typeof msg === 'object') {
            tmp += JSON.stringify(msg);
        } else {
            tmp += msg;
        }

        return tmp;
    };


    /**
     * Internal function to log out a message to console, global log or to some kind of interface
     * @param m Output type (log|logObj|info|error)
     * @param level Debug level
     * @param msg The log message
     */
    var out = function (m, level, msg) {
        if (!isValid ()) return;
        var convertedMessage = getLogMessage (level, msg, true);
        var queueMessage = getLogMessage (level, msg, false);
        var msgObject = { type: m, msg: queueMessage, error: false, date: new Date() };

        if (m === 'log') {
            if (ajaxOutAllowed(level)) Logger._addToAjaxQueue(msgObject);
            if (globalLogOutAllowed(level)) Logger._addToLogQueue(msgObject);
            if (consoleOutAllowed(level)) console.log(convertedMessage);
        } else if (m === 'logObj') {
            if (ajaxOutAllowed(level)) Logger._addToAjaxQueue(msgObject);
            if (globalLogOutAllowed(level)) Logger._addToLogQueue(msgObject);
            if (consoleOutAllowed(level)) {
                if ("cordova" in window) {
                    //on mobile systems, object logging is not possible always
                    console.log(JSON.stringify(msg));
                } else {
                    console.log(msg);
                }
            }
        } else if (m === 'info') {
            if (ajaxOutAllowed(level)) Logger._addToAjaxQueue(msgObject);
            if (globalLogOutAllowed(level)) Logger._addToLogQueue(msgObject);
            if (consoleOutAllowed(level)) {
                if ("cordova" in window) {
                    console.log("INFO: "+convertedMessage);
                } else {
                    console.info(convertedMessage);
                }
            }
        } else if (m === 'error') {
            msgObject.error = true;
            if (ajaxOutAllowed(level)) Logger._addToAjaxQueue(msgObject);
            if (globalLogOutAllowed(level)) Logger._addToLogQueue(msgObject);
            if (consoleOutAllowed(level)) {
                if ("cordova" in window) {
                    console.log("ERROR: "+convertedMessage);
                } else {
                    console.error(convertedMessage);
                }
            }
        }

        convertedMessage = null;
        msgObject = null;
        m = null;
        level = null;
        msg = null;
    };

    var ajaxOutAllowed = function (level) {
        return (level <= Logger.config.ajaxLog.level && Logger.config.ajaxLog.enabled);
    };
    var consoleOutAllowed = function (level) {
        return (level <= Logger.config.log.level && Logger.config.log.enabled);
    };
    var globalLogOutAllowed = function (level) {
        return (level <= Logger.config.globalLog.level && Logger.config.globalLog.enabled);
    };


    loggerMethod.log = function (level, msg) {
        out('log', level, msg);
    };
    loggerMethod.logObj = function (level, obj, title) {
        if (Logger.config.log.allowLogObj) {
            if (title != null && title !== "") {
                out('log', level, title);
            }
            out('logObj', level, obj);
        }
    };
    loggerMethod.info = function (level, msg) {
        out('info', level, msg);
    };
    loggerMethod.error = function (level, msg) {
        out('error', level, msg);
    };

    //start method
    loggerMethod.start();
    Logger.initAjaxLog();


    return loggerMethod;
};

