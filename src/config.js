"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
exports.setUser = setUser;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var CONFIG_FILE_NAME = ".gatorconfig.json";
function getConfigFilePath() {
    return path_1.default.join(os_1.default.homedir(), CONFIG_FILE_NAME);
}
function validateConfig(rawConfig) {
    if (!rawConfig.db_url) {
        throw new Error("Config file is missing 'db_url'");
    }
    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };
}
function writeConfig(cfg) {
    var filePath = getConfigFilePath();
    var data = JSON.stringify({
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    }, null, 2);
    fs_1.default.writeFileSync(filePath, data);
}
function readConfig() {
    var filePath = getConfigFilePath();
    try {
        var rawData = fs_1.default.readFileSync(filePath, "utf-8");
        var jsonContent = JSON.parse(rawData);
        return validateConfig(jsonContent);
    }
    catch (error) {
        throw new Error("Could not read config file: ".concat(error));
    }
}
function setUser(userName) {
    var currentConfig = readConfig();
    currentConfig.currentUserName = userName;
    writeConfig(currentConfig);
    console.log("User set to: ".concat(userName));
}
