import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ServerConfigModule } from './server-config/server-config.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { EnvType } from './server-config/models/env-type.enum';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception-handler/global-exception.filter';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Core modules
    CoreModule,
    ServerConfigModule,
    AuthModule,
    HealthModule,

    // Logger configuration
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        autoLogging: {
          ignore: (req: { url?: string }) => {
            return req && req.url === '/health';
          },
        },
        customProps: () => ({
          context: 'HTTP',
        }),
        transport:
          process.env.NODE_ENV === EnvType.dev.toString()
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              }
            : undefined,
        level: process.env.API_LOG_LEVEL || 'debug',
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
