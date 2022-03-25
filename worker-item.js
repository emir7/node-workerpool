module.exports = class WorkerItem {
  constructor(worker) {
    this.worker = worker;
    this.cb = null;
    this.isFree = true;
  }

  scheduleTask(cb, data) {
    this.cb = cb;
    this.worker.postMessage(data);
    this.isFree = false;
  }

  freeWorker() {
    this.cb = null;
    this.isFree = true;
  }
}
