const path = require('path');

const express = require('express');
const app = express();

const WorkerPool = require('./worker-pool/worker-pool');

const Publisher = require('./rabbit/publisher');
const Consumer = require('./rabbit/consumer');

const publisher = new Publisher();
const consumer = new Consumer();

const workerPool = new WorkerPool(1, path.join(__dirname, 'processor.js'));

function fibonacci(num) {
  if(num < 2) {
    return num;
  }

  return fibonacci(num-1) + fibonacci(num - 2);
}

(async () => {
  console.log("here!");
  await publisher.init();

  publisher.startSendingMessages();
  
  //await consumer.init();
  
  /*consumer.on('message', async (message) => {
    //fibonacci(45);

    await workerPool.run(45);
  });*/

})();

app.get("/alive", (_, res) => {
  return res.status(200).send({
      m: "staying alive"
  });
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});
