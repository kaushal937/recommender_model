const {startLog, stopLog} = require("./startstop/startstoplogs")
function logfunction(type){
    if(type == "stop"){
        stopLog()
    }else if(type == "start"){
        startLog()
    }else{
        return
    }
}
module.exports = {
    logfunction
}