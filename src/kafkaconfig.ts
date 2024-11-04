import { KafkaOptions, Transport } from '@nestjs/microservices';
import { KafkaConfig } from 'kafkajs';
import * as os from 'os';
import { generateAuthTokenFromCredentialsProvider } from 'aws-msk-iam-sasl-signer-js';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
export const awsCredentialsProvider = fromNodeProviderChain();
async function oauthBearerTokenProvider() {
  const authTokenResponse = await generateAuthTokenFromCredentialsProvider({
    region: 'ap-southeast-1',
    awsCredentialsProvider: awsCredentialsProvider,
  });
  return {
    value: authTokenResponse.token,
  };
}
export const KafkaClientConfig: KafkaConfig = {
  clientId: `yara_kafka_test_${os.hostname()}`,
  brokers: [
    'b-1-public.yaratest.m0729o.c3.kafka.ap-southeast-1.amazonaws.com:9198',
    'b-3-public.yaratest.m0729o.c3.kafka.ap-southeast-1.amazonaws.com:9198',
    'b-2-public.yaratest.m0729o.c3.kafka.ap-southeast-1.amazonaws.com:9198',
  ],
  ssl: true,
  sasl: {
    mechanism: 'oauthbearer',
    oauthBearerProvider: () => oauthBearerTokenProvider(),
  },
};

export const KafkaMicroServiceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: KafkaClientConfig,
    consumer: {
      groupId: 'test_group_id',
    },
    parser: {
      keepBinary: true,
    },
  },
};
