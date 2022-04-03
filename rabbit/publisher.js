const EventEmitter = require('events');
const amqp = require('amqplib');

module.exports = class Publisher extends EventEmitter {
  constructor() {
    super();

    this.address = 'amqp://guest:guest@localhost:5672/';
    this.queue = 'my-queue';
  }

  async init() {
    this.connection = await amqp.connect(this.address);
    this.channel = await this.connection.createChannel();
  }

  startSendingMessages() {
    for(let i = 0; i < 500; i++) {
      console.log('send')
      this.channel.sendToQueue(this.queue, Buffer.from('message'));
    }
  }

};