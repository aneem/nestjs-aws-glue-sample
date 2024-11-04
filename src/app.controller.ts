import * as msglue from '@meinestadt.de/glue-schema-registry';
import { Controller, Get } from '@nestjs/common';
import {
  Client,
  ClientKafka,
  EventPattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { KafkaMicroServiceConfig, awsCredentialsProvider } from './kafkaconfig';
import {
  TestMessageSchema,
  TestMessageSchemaType,
} from './schemas/test-message';

@Controller()
export class AppController {
  @Client(KafkaMicroServiceConfig)
  client: ClientKafka;

  private registry = new msglue.GlueSchemaRegistry<TestMessageSchemaType>(
    'yara-kafka-test-registry',
    {
      region: 'ap-southeast-1',
      credentials: awsCredentialsProvider,
    },
  );

  constructor() {}

  getSchemaId = async () => {
    // try {
    //   const schemaId = await this.registry.createSchema({
    //     type: TestMessageSchema.type,
    //     schemaName: TestMessageSchema.schema.name,
    //     compatibility: TestMessageSchema.compatibility,
    //     schema: JSON.stringify(TestMessageSchema.schema),
    //   });
    //   return schemaId;
    // } catch (error) {
    //   console.log('error: ', error);
    // }

    // or register a version of an existing schema
    // creates a new version or returns the id of an existing one, if a similar version already exists
    const schemaId = await this.registry.register({
      schemaName: TestMessageSchema.schema.name,
      type: TestMessageSchema.type,
      schema: JSON.stringify(TestMessageSchema.schema),
    });
    return schemaId;
  };

  @Get()
  async getHello(): Promise<object> {
    // create a new schema & throws an error if the schema already exists
    const schemaId = await this.getSchemaId();
    const payload = {
      id: '1',
      timeStamp: new Date().toISOString(),
      type: 'test.type',
      payload: { message: 'This is my first message' },
      context: {},
    };
    console.log('schemaId: ', schemaId);

    // now you can encode an object
    const encodedmessage = await this.registry.encode(schemaId, payload);
    this.client.emit('test-topic', { value: encodedmessage });
    // this.client.emit('test-topic', { value: JSON.stringify('hello world') });

    return {
      msg: 'Hello world',
    };
  }

  @EventPattern('test-topic', Transport.KAFKA)
  async listener(@Payload() payload: Buffer): Promise<void> {
    try {
      const analyzedMsg = await this.registry.analyzeMessage(payload);
      console.log('analyzedMsg: ', analyzedMsg);
      const data = await this.registry.decode(
        payload,
        TestMessageSchema.schema,
      );
      console.log('data: ', data);
    } catch (e) {
      console.log(e);
    }
  }
}
