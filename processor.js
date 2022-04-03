const { parentPort, threadId } = require("worker_threads");

function fibonacci(num) {
  if(num < 2) {
    return num;
  }

  return fibonacci(num-1) + fibonacci(num - 2);
}

parentPort.on('message', (data) => {
  console.log("threadId: "+threadId + " is busy");
  const fib = fibonacci(data)
  console.log("threadId: "+threadId + " is free: "+fib);
  parentPort.postMessage(fib);
});
