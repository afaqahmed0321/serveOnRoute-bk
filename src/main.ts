import { ValidationPipe, VersioningType} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { mongooseFilter } from '@filters/mongoose.filter';
import * as cookieParser from 'cookie-parser';
import {json} from 'express';
import { LoggerModule } from 'nestjs-pino';
import * as morgan from 'morgan'
import { HttpExceptionFilter } from './filters/httpException.filter';
import { CustomWsExceptionFilter } from './filters/wsException.filter';
import * as firebase from 'firebase-admin';


async function bootstrap() {
  const app = await NestFactory.create(AppModule,
  //   {
  //   // logger:['log','error','warn','debug','verbose']
  //   // logger:console
  // }
  );
  app.use(morgan('tiny'));
  app.enableCors();
  // app.use(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    }),
  );
  app.useGlobalFilters(
    // new CustomWsExceptionFilter(),
    new mongooseFilter(),
    new HttpExceptionFilter());
  app.use(cookieParser());
  app.use(json({limit: '50mb'}))

  const port = process.env.PORT || 3000;

  app.enableVersioning({
    defaultVersion: ['1'],
    type: VersioningType.URI
  });

  const config = new DocumentBuilder()
    .setTitle('RouteOn Backend NestJS')
    .setDescription(`RouteOn API v1
          
        Basically, A routing system will provide services to transfer parcels from one place to another.
        The system will allow people to register as driving hosts and they can add their 
        daily routes. The customers can select the pick and drop locations for their parcels 
        and the system will manage to all,{
          logger:['error','warn']
        }locate the driving host accordingly. The admin 
        panel will be handling the operations like accepting driving host registrations, Parcel
        Deliveries, and Analytics.

        Below are such APIs which provide support to the Route On\` Application
    `)
    .setVersion('1.0')
    .addTag('NestJS')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port}/api`,
    );
  });
}
bootstrap();
