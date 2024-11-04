import {
  SchemaCompatibilityType,
  SchemaType,
} from '@meinestadt.de/glue-schema-registry';
import * as avro from 'avsc';

// avro schema
export const TestMessageSchema = {
  schema: avro.Type.forSchema({
    name: 'TestKafkaSchema',
    namespace: 'com.group.TestKafkaSchema',
    doc: 'Test Schema',
    type: 'record',
    fields: [
      {
        name: 'id',
        type: 'string',
        doc: 'Message Id',
      },
      {
        name: 'timeStamp',
        type: 'string',
        doc: 'Message Timestamp',
      },
      {
        name: 'type',
        type: 'string',
        doc: 'Message Type',
      },
      {
        name: 'payload',
        type: {
          name: 'payload',
          type: 'record',
          fields: [
            {
              name: 'message',
              type: 'string',
              doc: 'Message',
            },
          ],
        },
        doc: 'Message Payload',
      },
      {
        name: 'context',
        type: {
          name: 'context',
          type: 'record',
          fields: [],
        },
        doc: 'Message Context',
      },
    ],
  }),
  type: SchemaType.AVRO,
  compatibility: SchemaCompatibilityType.BACKWARD,
};

export interface TestMessageSchemaType {
  id: string;
  timeStamp: string;
  type: string;
  payload: object;
  context: object;
}
