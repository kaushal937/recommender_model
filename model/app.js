const ML = require('./model/MLmodel')
const controller = new AbortController()
const { signal } = controller
ML.startModel(signal)
process.on("SIGINT", ()=>{
  console.log("\nShutdown signal received...");
  controller.abort();
  setTimeout(ML.returnExit(), 1000);
})