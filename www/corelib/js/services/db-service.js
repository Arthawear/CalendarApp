angular.module('app').service('dbService', function ($rootScope) {
    var dbWrapper = {};
    dbWrapper.initalized = false;
    dbWrapper.debug = true;
    dbWrapper.dbName = "";
    dbWrapper.dbHandle = null;
    dbWrapper.logger = Logger.getInstance("dbService");


    dbWrapper._getDbName = function () {
        return "db_" + dbWrapper.dbName;
    }


    /**
     * Returns the initialized state.
     * @returns {boolean}
     */
    dbWrapper.isInitialized = function () {
        return dbWrapper.initialized;
    }

    /**
     * Initializes a db with the given name.
     * @param name The name of the db
     * @param callback Success callback function
     */
    dbWrapper.initDatabase = function (name, tables, callback) {
        var logMethod = dbWrapper.logger.startMethod("initDatabase. name: " + name);
        dbWrapper.dbName = name;
        dbWrapper.tables = tables;
        dbWrapper.dbHandle = {};
        dbWrapper.dbHandle.tables = {};
        dbWrapper.initialized = true;
        if (!name) {
            logMethod.end();
            callback();
        }
        else {
            logMethod.log(Logger.lvlDebug, "name = " + name);
            //load all tables of database
            for (var i = 0; i < dbWrapper.tables.length; i++) {
                var name = dbWrapper._getDbName() + "_" + dbWrapper.tables[i];
                
            }
        }
    };

    /**
     * Save data to the database
     * @param table
     * @param data
     * @param callback
     */
    dbWrapper.saveData = function (table, data, callback) {
        var logMethod = dbWrapper.logger.startMethod("saveData");
        logMethod.logObj(Logger.lvlDebug, table, "data:");

        //update data in table
        dbWrapper.dbHandle.tables[table] = data;
       
    }

    dbWrapper.commitTable = function (table, callback) {
        var logMethod = dbWrapper.logger.startMethod("commitTable");
        logMethod.log(Logger.lvlDebug, "table = " + table);

        
    }


    dbWrapper.deleteData = function (table, keys, callback) {
        var logMethod = dbWrapper.logger.startMethod("deleteData");
        logMethod.log(Logger.lvlDebug, "table = " + table);
        logMethod.logObj(Logger.lvlDebug, keys, "keys:");
        var objectDeleted = false;


        this.getDataFromTable(table, function (err, data) {
            //TODO err?

            //got data from table
            logMethod.log(Logger.lvlDebug, "got data from table");

            if (keys.length > 0) {
                //keys present, try to delete object(s)

                var dataToDelete = [];
                for (var i = data.length - 1; i >= 0; i--) {

                    //step through multiple keys
                    for (var j = 0; j < keys.length; j++) {
                        var keySet = keys[j];
                        var keyMatch = true;

                        //check all keys
                        for (var k = 0; k < keySet.length; k++) {
                            logMethod.log(Logger.lvlDebug, "try key: " + keySet[k].field + "=" + keySet[k].value);
                            //dbWrapper.logger.logObj(data[i]);
                            logMethod.log(Logger.lvlDebug, " - [" + data[i][keySet[k].field] + "]");

                            if (!data[i][keySet[k].field] || data[i][keySet[k].field] !== keySet[k].value) {
                                logMethod.log(Logger.lvlDebug, " - NO match");
                                keyMatch = false;
                                break;
                            }
                        }

                        if (keyMatch) {
                            //all keys are matching
                            logMethod.log(Logger.lvlDebug, " - match, delete data");
                            objectDeleted = true;
                            dataToDelete.push(i);
                        }
                    }
                }

                for (var i = 0; i < dataToDelete.length; i++) {
                    data.splice(dataToDelete[i], 1);
                }
            }

        }, {createIfNotExists: false, noFavorites: true});

        logMethod.end();
        callback(objectDeleted ? null : "FAILED");
    }

    dbWrapper.createOrUpdateData = function (table, keys, newDatas, callback) {
        var logMethod = dbWrapper.logger.startMethod("createOrUpdateData");
        logMethod.log(Logger.lvlDebug, "table = " + table);
        logMethod.logObj(Logger.lvlDebug, keys, "keys:");


        this.getDataFromTable(table, function (err, data) {
            //TODO err?

            //got data from table
            logMethod.logObj(Logger.lvlDebug, data, "got data from table");

            var returnData = [];
            if (newDatas) {
                for (var d = 0; d < newDatas.length; d++) {

                    var tmpNewData = newDatas[d];
                    var tmpKeys = keys[d] || [];

                    logMethod.logObj(Logger.lvlDebug, tmpKeys, "[" + d + "] keys");
                    logMethod.logObj(Logger.lvlDebug, tmpNewData, "[" + d + "] datas");


                    var objectUpdated = false;
                    if (tmpKeys.length > 0) {
                        //keys present, try to update object

                        for (var i = 0; i < data.length; i++) {
                            var keyMatch = true;

                            //check all keys
                            for (var j = 0; j < tmpKeys.length; j++) {
                                logMethod.log(Logger.lvlDebug, "[" + d + "] try key: " + tmpKeys[j].field + "=" + tmpKeys[j].value);
                                //dbWrapper.logger.logObj(data[i]);
                                logMethod.log(Logger.lvlDebug, "[" + d + "] - [" + data[i][tmpKeys[j].field] + "]");

                                if (!data[i][tmpKeys[j].field] || data[i][tmpKeys[j].field] !== tmpKeys[j].value) {
                                    logMethod.log(Logger.lvlDebug, "[" + d + "]  - NO match");
                                    keyMatch = false;
                                    break;
                                }
                            }


                            if (keyMatch) {
                                //all keys are matching
                                logMethod.log(Logger.lvlDebug, "[" + d + "]  - match");
                                objectUpdated = true;
                                data[i] = tmpNewData;
                                returnData.push(tmpNewData);
                                break;
                            }
                        }
                    }


                    if (tmpKeys.length === 0 || !objectUpdated) {
                        //not updated, create it
                        logMethod.log(Logger.lvlDebug, "[" + d + "] no keys, create");
                        data.push(tmpNewData);
                        returnData.push(tmpNewData);
                    }
                }
            }

            logMethod.end();
            if (newDatas && newDatas.length > 1) {
                callback(null, returnData);
            } else {
                callback(null, returnData[0]);
            }


        }, {createIfNotExists: true, noFavorites: true});

    }


    dbWrapper.getDataFromTable = function (table, callback, options) {
        var logMethod = dbWrapper.logger.startMethod("getDataFromTable");
        logMethod.log(Logger.lvlDebug, table);
        var data = null;

        //get data from table

        if (!dbWrapper.dbHandle.tables[table] && options && options.createIfNotExists) {
            dbWrapper.dbHandle.tables[table] = [];
        }

        if (dbWrapper.dbHandle.tables[table]) {
            //data found
            logMethod.log(Logger.lvlDebug, "found table data")
            data = dbWrapper.dbHandle.tables[table];
            logMethod.end();
            if (callback) {
                callback(null, data);
            }
        } else {
            logMethod.error(Logger.lvlError, "table '" + table + "' not found")
            logMethod.end();
            if (callback) {
                callback("TABLE_NOT_FOUND", data);
            }
        }

    }
    return dbWrapper;
});