import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './exceptions/filters/exceptions.filters.db';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  // Register multipart plugin directly on the Fastify instance
  await fastifyAdapter.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TypeORMExceptionFilter());

  // TODO remove this once done testing
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Athletes API')
    .setDescription('CRUD of athletes')
    .setVersion('1.0')
    .addTag('athletes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001, '0.0.0.0');
}
bootstrap();
