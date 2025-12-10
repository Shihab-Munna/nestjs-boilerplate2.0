import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType, Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ServerConfigService } from './server-config/server-config.service';
import { json } from 'express';
import { EnvType } from './server-config/models/env-type.enum';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  const logger = new NestLogger('Init');
  const serverConfigService = app.get<ServerConfigService>(ServerConfigService);

  // Body parser configuration
  const jsonSizeLimit = process.env.BODY_PARSER_JSON_SIZE_LIMIT || '10mb';
  app.use(json({ limit: jsonSizeLimit }));

  // CORS configuration
  const whitelist = serverConfigService.corsAllowedOrigins;
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf('*') !== -1 || whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`${origin} not allowed by CORS.`));
      }
    },
  });

  // API Versioning - path
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: serverConfigService.apiVersion,
  });

  // API Logger
  logger.log(serverConfigService.printConfig(), 'App configs');

  // Swagger setup (only in non-production environments)
  if (serverConfigService.deployEnv !== EnvType.production.toString()) {
    const documentBuilder = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API Documentation for the application')
      .setVersion(serverConfigService.apiVersion)
      .addBearerAuth(
        {
          type: 'http',
          name: 'Authorization',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT',
      );

    const swaggerUiOptions: SwaggerUiOptions = { defaultModelsExpandDepth: -1 }; // Hide schemas

    if (EnvType.dev.toString() === serverConfigService.deployEnv) {
      // Schemas are only available in the dev env
      swaggerUiOptions.defaultModelsExpandDepth = 1;

      // Allow multiple servers only in dev environment
      const devUrl = `${serverConfigService.baseUrls.dev}`;
      documentBuilder.addServer(devUrl, EnvType.dev.toString());
      documentBuilder.addServer(serverConfigService.baseUrls.staging, EnvType.staging.toString());
    }

    const config = documentBuilder.build();

    const document = SwaggerModule.createDocument(app, config);
    const swaggerPath = `v${serverConfigService.apiVersion}/api-docs`;
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: swaggerUiOptions,
    });

    logger.log(
      `Swagger documentation is available at: http://localhost:${serverConfigService.serverPort}/${swaggerPath}`,
      'Swagger',
    );
  }

  await app.listen(serverConfigService.serverPort);
  logger.log(
    `Application is running on: http://localhost:${serverConfigService.serverPort}`,
    'Bootstrap',
  );
}

void bootstrap();
