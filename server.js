const express = require("express");
const app = express();
const WorkerPool = require('./worker-pool');
const workerPool = new WorkerPool(2, './processor.js');

app.get("/load", async (req, res) => {
    
    const result = await workerPool.run(null);
    console.log("result: "+result);
    /*workerPool.run(null, () => {
        console.log("finished");
    });*/
    
    return res.status(200).send({
        m: "ok"
    });
});

app.get("/alive", (_, res) => {
    return res.status(200).send({
        m: "staying alive"
    })
});

app.listen(3000, () => {
    console.log("server running on port 3000");
});
