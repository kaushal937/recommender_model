const fs = require('fs');
const dataSet = require('#dataset');

function parseTestFile(text) {
    const testData = [];
    text.trim().split('\n').forEach(line => {
        const [user, item, rating] = line.split('\t').map(Number);
        const idx = user - 1;
        if (!testData[idx]) testData[idx] = [];
        testData[idx].push({ item, rating });
    });
    return testData;
}

function popularityBaseline(trainData, testData, k = 20, threshold = 4) {
    const itemCounts = new Map();
    trainData.forEach(ratings => {
        if (!ratings) return;
        ratings.forEach((r, i) => {
            if (r != null) itemCounts.set(i + 1, (itemCounts.get(i + 1) || 0) + 1);
        });
    });
    const rankedItems = [...itemCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([item]) => item);

    let sumRecall = 0, count = 0;
    trainData.forEach((userRatings, idx) => {
        if (!userRatings || !testData[idx]) return;
        const recs = rankedItems.filter(item => userRatings[item - 1] == null).slice(0, k);
        const relevant = new Set(
            testData[idx].filter(t => t.rating >= threshold).map(t => t.item)
        );
        if (relevant.size === 0) return;
        const hits = recs.filter(item => relevant.has(item)).length;
        sumRecall += hits / relevant.size;
        count++;
    });
    return { recall: sumRecall / count, usersEvaluated: count };
}

const testText = fs.readFileSync('../dataset/ml-100k/u3.test', 'utf8');

const trainData = JSON.parse(dataSet.readData());
const testData = parseTestFile(testText);
const relevant = testData[0].filter(t => t.rating >= 4).map(t => t.item);
console.log(relevant);

const result = popularityBaseline(trainData, testData, 20, 4);
console.log('u2 popularity baseline recall@20 (threshold=4):', result.recall);
console.log('users evaluated:', result.usersEvaluated);