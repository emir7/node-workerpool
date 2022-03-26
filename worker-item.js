module.exports = class WorkerItem {
    constructor(worker) {
      this.worker = worker;
      this.resolve = null;
      this.reject = null;
      this.isFree = true;
    }
  
    scheduleTask(resolve, reject, data) {
      this.resolve = resolve;
      this.reject = reject;
      this.worker.postMessage(data);
      this.isFree = false;
    }
  
    freeWorker() {
      this.resolve = null;
      this.reject = null;
      this.isFree = true;
    }
  }
