import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));


//   const options = new DocumentBuilder()
//   .setTitle('Cats example')
//   .setDescription('The cats API description')
//   .setVersion('1.0')
//   .addTag('cats')
//   .build();
// const document = SwaggerModule.createDocument(app, options);
// SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
