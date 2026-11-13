const logs = require("#logutils")
const dataset = require("#dataset")
const formulae = require("#formulae")
const fs = require("fs");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//maps
var umap=[]
//
function weightageForN(value){
    var eps = 100 // this is to avoid infinity
    var sANDn = value.split(',')
    return (parseFloat(sANDn[0]) + eps) / parseInt(sANDn[1])
    // return parseInt(sANDn[1])
}
function prepareTemp1(T1){
    return T1
        .map(e => ({ ...e, score: weightageForN(e.value) }))
        .sort((a, b) => b.score - a.score);
}
function prepareItems(arg, atcount, userATag){
    const dataSet = JSON.parse(dataset.readData())
    const userA = dataSet[parseInt(userATag)]
    let itemPoolingMap = new Map()
    for(let i=0; i<dataSet[0].length; i++){
        var toSet = 0
        if(userA[i] == null){
            for(let i2=0; i2<arg.length; i2++){
                var userIndex = arg[i2].key
                var userManhattanDistance = arg[i2].value.split(',')[0]
                var similarUserItems = dataSet[parseInt(userIndex)]
                if (similarUserItems[i] == null) continue
                toSet += arg[i2].score * similarUserItems[i]
                // toSet += (5 - userManhattanDistance) * similarUserItems[i]
            }
            itemPoolingMap.set(i+1, toSet)
        }
    }
    return [...itemPoolingMap.entries()].sort((a,b) => b[1] - a[1]).slice(0, atcount).map(([item]) => item)
}
function getRecommendation(user, n){
    var fsmap = JSON.parse(fs.readFileSync('./bin/umap.json', 'utf-8'))
    var obj = fsmap[(user-1).toString()]
    var innerDict = obj[(user-1).toString()];
    var toArgueT1= Object.entries(innerDict)
        .filter(([_, value]) => value !== null)
        .sort((a, b) => a[1].split(',')[0] - b[1].split(',')[0])
        .slice(0, 60)
        .map(([key, value]) => ({ key, value }));
    
    var toArgueT2 = prepareTemp1(toArgueT1)
    var toArgueT3 = prepareItems(toArgueT2, n, (user-1).toString())
    return toArgueT3
}
    
function usermapper(data){
    var temp = []
    data.forEach((element, index) => {
        temp.push({
            [index] : {}
        })
        data.forEach((elem, ind)=>{
            if(ind != index){
                temp[index][index][ind] = formulae.calcD(element, elem)
            }
        })
    });
    fs.writeFileSync('./bin/umap.json', JSON.stringify(temp))
    
}
//misc
function returnExit(){
    return () => {
        console.log("Shutting down ML")
        process.exit(0);
    }
}
async function startModel(signal){
    console.log("Started Model...");
    dataset.startdatafeeder(signal)
    logs.logfunction("start")
    await sleep(2000)
    for (; true;) {
        if(signal?.aborted == true){
            logs.logfunction("stop")
            break
        }
        usermapper(dataset.getData()["data"])
        await sleep(1000*60*10);
    }
}
module.exports = {startModel, returnExit, getRecommendation}