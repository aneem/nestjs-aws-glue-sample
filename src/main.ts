import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { KafkaMicroServiceConfig } from './kafkaconfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<KafkaOptions>(KafkaMicroServiceConfig);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
