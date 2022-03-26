const { Worker } = require("worker_threads");
const { EventEmitter } = require('events');

const WorkerItem = require('./worker-item');

module.exports = class WorkerPool extends EventEmitter {
  constructor(numberOfWorkers, workerPath) {
    super();

    this.numberOfWorkers = numberOfWorkers;
    this.workerPath = workerPath;
    this.workers = new Map();

    this.initWorkerPool();
  }

  initWorkerPool() {
    for(let i = 0; i < this.numberOfWorkers; i++) {
      this.spawnWorker();
    }
  }

  spawnWorker() {
    const worker = new Worker(this.workerPath);

    worker.on('message', (result) => {
      const workerItem = this.getWorkerItemById(worker.threadId);

      workerItem.resolve(result);
      workerItem.freeWorker();

      this.emit('freeWorker');
    });

    worker.on('error', (err) => {
      const workerItem = this.getWorkerItemById(worker.threadId);

      workerItem.reject(err);
    });

    worker.on('exit', (code) => {
      const workerItem = this.getWorkerItemById(worker.threadId);
      
      if(code !== 0) {
        workerItem.reject(code);
      }
    });

    this.updateWorkerMap(worker.threadId, new WorkerItem(worker));
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const freeWorkerItem = this.findFreeWorker();

      if(!freeWorkerItem) {
        this.once('freeWorker', () => {
          return this.run(data);
        });
    
        return;
      }
    
      freeWorkerItem.scheduleTask(resolve, reject, data);
    });
  }

  findFreeWorker() {
    for(const [,workerItem] of this.workers) {
      if(workerItem.isFree) {
        return workerItem;
      }
    }

    return null;
  }

  updateWorkerMap(workerId, workerItem) {
    const workerKey = String(workerId);

    this.workers.set(workerKey, workerItem);
  }

  getWorkerItemById(workerId) {
    const workerKey = String(workerId);

    return this.workers.get(workerKey);
  }
}
