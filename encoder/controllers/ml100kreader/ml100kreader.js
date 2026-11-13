const fs = require("fs")

function readml100kinit(){
    const data = fs.readFileSync("../dataset/ml-100k/u.data", 'utf-8');
    const TOTAL_USERS = 943;
    const TOTAL_MOVIES = 1682;
    const matrix = Array.from({ length: TOTAL_USERS }, () => 
        new Array(TOTAL_MOVIES).fill(null)
    );
    data.split('\n').forEach(line => {
        if (!line.trim()) return;
        const [userId, movieId, rating] = line.split('\t').map(Number);
        matrix[userId - 1][movieId - 1] = rating;
    });
    fs.writeFileSync("./controllers/ml100kreader/readdata.json", JSON.stringify(matrix))
}
function readml100k(){
    const data = fs.readFileSync("./controllers/ml100kreader/readdata.json", 'utf-8');
    return JSON.parse(data)
}

module.exports = {
    readml100k,
    readml100kinit
}