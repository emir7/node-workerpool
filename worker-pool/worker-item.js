module.exports = class WorkerItem {
  constructor(worker) {
    this.worker = worker;
    this.task = null;
    this.isFree = true;
  }

  scheduleTask(task) {
    this.task = task;
    this.worker.postMessage(task.data);
    this.isFree = false;
  }

  freeWorker() {
    this.task = null;
    this.isFree = true;
  }

  onSuccess(data) {
    this.task.resolve(data)
    this.freeWorker();  
  }

  onError(err) {
    this.task.reject(err);
    this.freeWorker();
  }
}
