const fs = require("fs")
const pathVars = require("#paths")
function startLog(){
    var toWrite = "ML Model started, at: "+Date.now()+"\n"
    fs.appendFileSync(pathVars.join(pathVars.processPath, "bin", "stoplogs.txt"), toWrite)
}
function stopLog(){
    var toWrite = "ML Model stopped, with exit code 0, at: "+Date.now()+"\n"
    fs.appendFileSync(pathVars.join(pathVars.processPath, "bin", "stoplogs.txt"), toWrite)
}
module.exports = {
    startLog,
    stopLog
}