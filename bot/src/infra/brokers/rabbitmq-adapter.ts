import amqplib from "amqplib";
import { Handler } from "../../application/handlers/handler";
import { Broker } from "../../application/ports/brokers/broker";
import { Command } from "../../domain/commands/command";
import { Event } from "../../domain/events/event";

export class RabbitMQAdapter implements Broker {
  channel: any;

  async connect(): Promise<void> {
    const connection = await amqplib.connect("amqp://rabbitmq:5672");
    this.channel = await connection.createChannel();
  }

  async subscribe(handler: Handler, callback: Function): Promise<void> {
    await this.channel.assertExchange(handler.name, "fanout", { durable: true });
    const queue = await this.channel.assertQueue("", { exclusive: true });
    await this.channel.bindQueue(queue.queue, handler.name, "");
    await this.channel.consume(
      queue.queue,
      async function (msg: any) {
        if (msg.content) {
          const input = JSON.parse(msg.content.toString());
          console.log(input);
          await callback(input);
        }
      },
      { noAck: true }
    );
  }

  async subscribeDelayed(handler: Handler, callback: Function): Promise<void> {
    await this.channel.assertExchange(handler.name, "x-delayed-message", {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: {
        "x-delayed-type": "direct",
      },
    });
    const queue = await this.channel.assertQueue("", { exclusive: true });
    await this.channel.bindQueue(queue.queue, handler.name, "");
    await this.channel.consume(
      queue.queue,
      async function (msg: any) {
        if (msg.content) {
          const input = JSON.parse(msg.content.toString());
          console.log(input);
          await callback(input);
        }
      },
      { noAck: true }
    );
  }

  async publish(input: Event | Command): Promise<void> {
    console.log(input);
    await this.channel.assertExchange(input.name, "fanout", { durable: true });
    this.channel.publish(input.name, "", Buffer.from(JSON.stringify(input)));
  }

  async schedule(input: Command, date: Date): Promise<void> {
    await this.channel.assertExchange(input.name, "x-delayed-message", {
      autoDelete: false,
      durable: true,
      passive: true,
      arguments: {
        "x-delayed-type": "direct",
      },
    });
    const delayInMilliSeconds = Math.abs(date.getTime() - new Date().getTime());
    // console.log(delayInMilliSeconds, input);
    this.channel.publish(input.name, "", Buffer.from(JSON.stringify(input)), {
      headers: {
        "x-delay": delayInMilliSeconds,
      },
    });
  }
}
