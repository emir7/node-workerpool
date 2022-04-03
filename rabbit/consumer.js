const EventEmitter = require('events');
const amqp = require('amqplib');

module.exports = class Consumer extends EventEmitter {
  constructor() {
    super();

    this.address = 'amqp://guest:guest@localhost:5672/';
    this.queue = 'my-queue';
  }

  async init() {
    this.connection = await amqp.connect(this.address);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.queue);


    await this.channel.prefetch(10);


    const channelOptions = {
      noAck: true
    };

    const messageHandler = (message) => {
      this.emit('message', message);
    };

    this.channel.consume(this.queue, messageHandler, channelOptions);
  }

  ackMessage(message) {
    this.channel.ack(message);
  }
};