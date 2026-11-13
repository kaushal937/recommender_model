const fs = require("fs");
const path = require('path')

// Files
const relevantFile = path.join(__dirname, "u1_relevant.test");
const recommendationsFile = path.join(__dirname, "top20.json");
const outputFile = path.join(__dirname, "recall_results.txt");

// --------------------------------------------------
// 1. Read u1_relevant.test
// Format:
// userID movieID rating timestamp
// --------------------------------------------------

const relevantData = fs.readFileSync(relevantFile, "utf8");

const relevantByUser = new Map();

for (const line of relevantData.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const parts = line.trim().split(/\s+/);

    const userID = Number(parts[0]);
    const movieID = Number(parts[1]);

    if (!relevantByUser.has(userID)) {
        relevantByUser.set(userID, new Set());
    }

    relevantByUser.get(userID).add(movieID);
}

// --------------------------------------------------
// 2. Read Top-20 recommendations
//
// [
//   [23, 54, 643, ...],
//   [23, 54, 643, ...],
//   ...
// ]
//
// Array index 0 = User 1
// Array index 1 = User 2
// etc.
// --------------------------------------------------

const recommendations = JSON.parse(
    fs.readFileSync(recommendationsFile, "utf8")
);

// --------------------------------------------------
// 3. Calculate Recall@20 for every user
// --------------------------------------------------

let totalRecall = 0;
let evaluatedUsers = 0;

const results = [];

for (const [userID, relevantMovies] of relevantByUser) {


    const recommendationsForUser = recommendations[userID - 1];

    if (!recommendationsForUser) {
        console.log(`WARNING: No recommendations found for User ${userID}`);
        continue;
    }

    const recommendedSet = new Set(recommendationsForUser);

    let hits = 0;
    for (const movieID of relevantMovies) {
        console.log(recommendedSet)
        console.log(movieID)
        if (recommendedSet.has(movieID)) {
            
            hits++;
        }
    }

    const recall = hits / relevantMovies.size;

    totalRecall += recall;
    evaluatedUsers++;

    const result =
        `User ${userID}: ${hits}/${relevantMovies.size} ` +
        `=> Recall@20 = ${recall.toFixed(4)} ` +
        `(${(recall * 100).toFixed(2)}%)`;

    results.push(result);
}

// --------------------------------------------------
// 4. Calculate overall average
// --------------------------------------------------

const averageRecall =
    evaluatedUsers > 0
        ? totalRecall / evaluatedUsers
        : 0;

results.push("");
results.push("----------------------------------------");
results.push(`Users evaluated: ${evaluatedUsers}`);
results.push(
    `Average Recall@20: ${averageRecall.toFixed(4)} ` +
    `(${(averageRecall * 100).toFixed(2)}%)`
);

// --------------------------------------------------
// 5. Output
// --------------------------------------------------

const output = results.join("\n");

console.log(output);

fs.writeFileSync(outputFile, output);

console.log(`\nResults written to ${outputFile}`);