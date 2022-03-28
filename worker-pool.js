const { Worker } = require("worker_threads");

const Task = require("./task");
const WorkerItem = require('./worker-item');

module.exports = class WorkerPool {
  constructor(numberOfWorkers, workerPath) {
    this.numberOfWorkers = numberOfWorkers;
    this.workerPath = workerPath;
    this.workers = new Map();
    this.taskQueue = [];

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

      workerItem.onSuccess(result);

      const nextTask = this.taskQueue.shift();

      if(nextTask) {
        workerItem.scheduleTask(nextTask);
      }
    });

    worker.on('error', (err) => {
      const workerItem = this.getWorkerItemById(worker.threadId);

      workerItem.onError(err);
    });

    worker.on('exit', (code) => {
      const workerItem = this.getWorkerItemById(worker.threadId);
      
      if(code !== 0) {
        workerItem.onError(`Worker exited with error code: ${code}`);
      }
    });

    this.updateWorkerMap(worker.threadId, new WorkerItem(worker));
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const freeWorkerItem = this.findFreeWorker();
      const task = new Task(data, resolve, reject);
        
      if(!freeWorkerItem) {
        this.taskQueue.push(task);
    
        return;
      }
    
      freeWorkerItem.scheduleTask(task);
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
