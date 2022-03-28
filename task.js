module.exports = class Task {
  constructor(data, resolve, reject) {
    this.data = data;
    this.resolve = resolve;
    this.reject = reject;
  }
} 
