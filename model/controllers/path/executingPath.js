const {join, dirname} = require("path")
// const processPath = join(dirname(process.execPath), "/")
//devPhase
const fs = require("fs")
let projectRoot = __dirname;
while (!fs.existsSync(join(projectRoot, "package.json"))) {
    const parent = dirname(projectRoot);
    if (parent === projectRoot) {
        throw new Error("Project root not found");
    }
    projectRoot = parent;
}
//devPhase
const processPath = join(projectRoot, "/")
module.exports = {
    processPath,
    join
}