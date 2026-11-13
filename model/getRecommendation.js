const getRec = require("./model/MLmodel")
const fs = require("fs")

var tempToWrite = []
for(let i=1; i<=943; i++){
    console.log(i)
    tempToWrite.push(getRec.getRecommendation(i, 20))
}
console.log("Successfully generated @20 recommendations for 943 users in top20.json...")
fs.writeFileSync('../dataset/ml-100k/testing_scripts/u2_recall/top20.json', JSON.stringify(tempToWrite))

// console.log(getRec.getRecommendation(6, 20))