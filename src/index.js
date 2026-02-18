"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function main() {
    (0, config_1.setUser)("Iman");
    var updatedConfig = (0, config_1.readConfig)();
    console.log("Current Config on Disk:");
    console.log(updatedConfig);
}
main();
