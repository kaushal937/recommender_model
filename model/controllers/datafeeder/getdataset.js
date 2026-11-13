const fs = require('fs')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
var matrix;
async function fetchHTTP(signal){
    for (; true;) {
        if(signal?.aborted == true){
            console.log("Shutting down DataSet Feeder")
            break;
        }
        const response = await fetch("http://127.0.0.1:9090/ml100k/get")
        if (!response.ok) {
            throw new Error(`Error in reading the dataset endpoint http://127.0.0.1:9090/ml100k/get`)
        }
        matrix = await response.json()
        fs.writeFileSync('./bin/dataset.json', JSON.stringify(matrix["data"]))
        await sleep(1000*60*5);
    }
}
function startdatafeeder(signal){
    fetchHTTP(signal)
}

module.exports = {
    startdatafeeder,
    getData: () => matrix,
    readData: () => fs.readFileSync('./bin/dataset.json', 'utf-8')
}