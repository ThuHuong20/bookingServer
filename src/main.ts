import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const server = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  server.enableCors();
  server.setGlobalPrefix('api');
  server.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Booking example')
    .setDescription('Booking Salon API description')
    .setVersion('1.0')
    .addTag('Booking Salon')
    .build();
  const document = SwaggerModule.createDocument(server, config);
  SwaggerModule.setup('api', server, document);

  server.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await server.listen(process.env.PORT);
}
bootstrap();
