import amqplib from "amqplib";
import { Handler } from "../../application/handlers/handler";
import { Broker } from "../../application/ports/brokers/broker";
import { Command } from "../../domain/commands/command";
import { Event } from "../../domain/events/event";

export class RabbitMQAdapter implements Broker {
  handlers: Handler[];

  connection: any;

  async connect(): Promise<void> {
    this.connection = await amqplib.connect("amqp://rabbitmq:5672");
    // this.connection = await amqplib.connect("amqp://localhost:5672");
  }

  async close(): Promise<void> {
    await this.connection.close();
  }

  async subscribe(handler: Handler, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertExchange(handler.name, "fanout", { durable: true });
    const queue = await channel.assertQueue("", { exclusive: true });
    channel.bindQueue(queue.queue, handler.name, "");
    channel.consume(
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
    const channel = await this.connection.createChannel();
    await channel.assertExchange(input.name, "fanout", { durable: true });
    channel.publish(input.name, "", Buffer.from(JSON.stringify(input)));
  }

  async schedule(input: Command): Promise<void> {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.publish(input);
  }

  register(handler: Handler): void {
    throw new Error("Method not implemented.");
  }
}
