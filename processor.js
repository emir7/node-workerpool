const { parentPort, threadId } = require("worker_threads");

function fibonacci(num) {
    if(num < 2) {
        return num;
    }
    else {
        return fibonacci(num-1) + fibonacci(num - 2);
    }
}

parentPort.on('message', () => {
    console.log("threadId: "+threadId + " is busy");
    const fib = fibonacci(5)
    console.log("threadId: "+threadId + " is free: "+fib);
    parentPort.postMessage(fib);
});
